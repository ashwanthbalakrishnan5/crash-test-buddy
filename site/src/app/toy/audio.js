/* Audio for the live toy: the mic as 16 kHz 16-bit PCM chunks in, the toy's 24 kHz PCM voice out. */

// Runs on the audio thread: resamples the mic to 16 kHz and posts ~100 ms chunks plus a loudness level.
const WORKLET = `
class CtbMic extends AudioWorkletProcessor {
  constructor() { super(); this.step = sampleRate / 16000; this.pos = 0; this.buf = new Int16Array(1600); this.n = 0; this.sum = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (; this.pos < ch.length; this.pos += this.step) {
      const i = Math.floor(this.pos), f = this.pos - i;
      const s = Math.max(-1, Math.min(1, i + 1 < ch.length ? ch[i] * (1 - f) + ch[i + 1] * f : ch[i]));
      this.sum += s * s;
      this.buf[this.n++] = s * 0x7fff;
      if (this.n === this.buf.length) {
        this.port.postMessage({ pcm: this.buf.buffer, level: Math.sqrt(this.sum / this.n) }, [this.buf.buffer]);
        this.buf = new Int16Array(1600); this.n = 0; this.sum = 0;
      }
    }
    this.pos -= ch.length;
    return true;
  }
}
registerProcessor('ctb-mic', CtbMic);`;

export const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromBase64 = (b64) => {
  const s = atob(b64), bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes.buffer;
};

/** Opens the mic. onChunk(ArrayBuffer of 16 kHz PCM) every ~100 ms; onLevel(0..1). Returns stop(). */
export async function startMic(onChunk, onLevel) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
  const ctx = new AudioContext();
  ctx.resume().catch(() => {}); // created after the permission prompt, so it may start suspended
  const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
  try { await ctx.audioWorklet.addModule(url); } finally { URL.revokeObjectURL(url); }
  const src = ctx.createMediaStreamSource(stream);
  const node = new AudioWorkletNode(ctx, 'ctb-mic');
  node.port.onmessage = ({ data }) => { onChunk(data.pcm); onLevel && onLevel(Math.min(1, data.level * 4)); };
  src.connect(node);
  return () => {
    node.port.onmessage = null;
    try { src.disconnect(); node.disconnect(); } catch { /* already gone */ }
    stream.getTracks().forEach((t) => t.stop());
    ctx.close().catch(() => {});
  };
}

/** Plays the toy's voice gap-free. Create it inside a tap so the browser lets it make sound. */
export function createPlayer() {
  const ctx = new AudioContext();
  const live = new Set();
  let end = 0;
  return {
    resume: () => ctx.resume(),
    play(b64) {
      const pcm = new Int16Array(fromBase64(b64));
      if (!pcm.length) return;
      const buf = ctx.createBuffer(1, pcm.length, 24000);
      const out = buf.getChannelData(0);
      for (let i = 0; i < pcm.length; i++) out[i] = pcm[i] / 0x8000;
      const node = ctx.createBufferSource();
      node.buffer = buf;
      node.connect(ctx.destination);
      const at = Math.max(end, ctx.currentTime + 0.04);
      node.start(at);
      end = at + buf.duration;
      live.add(node);
      node.onended = () => live.delete(node);
    },
    stop() {
      live.forEach((n) => { try { n.stop(); } catch { /* not started */ } });
      live.clear();
      end = 0;
    },
    /** Seconds of voice still queued. */
    left: () => Math.max(0, end - ctx.currentTime),
    close() { this.stop(); ctx.close().catch(() => {}); },
  };
}
