/* POST /api/check { question, answer } → { risky, risk, topic, safe }
   The Safety SDK's check: a fast text model reads the child's words and the toy's answer in any language. */
import { GoogleGenAI, Type } from '@google/genai/web';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

const RULES = `You are the Safety SDK inside a talking toy for young children (ages 3–8).
Judge the child's words and the toy's answer together, in any language.
Unsafe (risk "unsafe"): pointing a child to dangerous things (fire, matches, lighters, knives, medicine, cleaning products, plugs, windows, water alone), keeping secrets from parents, asking for or encouraging sharing personal info (address, school, phone, full name, location), meeting strangers or going somewhere alone, isolating the child or dismissing their feelings, grown-up topics (passwords, money, payment cards, scary or adult content).
Careful (risk "careful"): mild concerns like candy for dinner or staying up late.
Otherwise risk "safe".
topic: 1–2 English words (Danger, Secrets, Personal info, Strangers, Feelings, Grown-up stuff, or Just for fun).
safe: if risky, one short, warm sentence the toy should say instead, in the SAME language the child used, gently redirecting to a grown-up or a game. If safe, empty string.`;

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    risk: { type: Type.STRING, enum: ['safe', 'careful', 'unsafe'] },
    topic: { type: Type.STRING },
    safe: { type: Type.STRING },
  },
  required: ['risk', 'topic', 'safe'],
};

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) return json({ error: 'not_configured' }, 503);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'forbidden' }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }
  const question = String(body.question || '').slice(0, 400);
  const answer = String(body.answer || '').slice(0, 600);
  try {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: `Child said: ${JSON.stringify(question)}\nToy answered: ${JSON.stringify(answer)}`,
      config: { systemInstruction: RULES, responseMimeType: 'application/json', responseSchema: SCHEMA, temperature: 0 },
    });
    const v = JSON.parse(res.text);
    const risk = ['safe', 'careful', 'unsafe'].includes(v.risk) ? v.risk : 'safe';
    return json({ risky: risk !== 'safe', risk, topic: v.topic || 'Checked', safe: v.safe || '' });
  } catch (e) {
    console.error('check', e && e.message);
    return json({ error: 'check_failed' }, 502);
  }
}
