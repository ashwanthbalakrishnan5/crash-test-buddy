/* POST /api/live-token → { token }
   Mints a short-lived, single-use token for one live toy session. The real key stays here
   (Pages secret GEMINI_API_KEY); the token is locked to the toy's model and settings. */
import { GoogleGenAI } from '@google/genai/web';
import { MODEL, CONFIG } from '../../src/app/toy/live-config.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) return json({ error: 'not_configured' }, 503);
  // only our own pages may ask for a token
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'forbidden' }, 403);

  const now = Date.now();
  try {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY, httpOptions: { apiVersion: 'v1alpha' } });
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
        liveConnectConstraints: { model: MODEL, config: CONFIG },
        lockAdditionalFields: [],
      },
    });
    return json({ token: token.name });
  } catch (e) {
    console.error('live-token', e && e.message);
    return json({ error: 'token_failed' }, 502);
  }
}
