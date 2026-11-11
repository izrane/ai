// ═══════════════════════════════════════════════════════════════════════
// ChatMBR — Proxy TTS neuronal pour Cloudflare Pages (🛡️ FIX TTS CLOUDFLARE)
//
// Endpoint : /api/tts  (functions/api/tts.js — convention Cloudflare Pages)
// Rôle     : synthèse vocale neuronale Microsoft Edge côté serveur, car les
//            navigateurs Chrome / Firefox / Safari ne peuvent pas ouvrir le
//            WebSocket speech.platform.bing.com directement (Microsoft
//            exige un User-Agent Edge récent lors de la poignée de main).
//            Seul Microsoft Edge peut le faire depuis le navigateur — d'où
//            ce relais serveur, qui permet les voix neuronales
//            (fr-FR-DeniseNeural, hi-IN-SwaraNeural, …) à TOUS les visiteurs.
//
// Requête  : POST { "text": "...", "voice": "fr-FR-DeniseNeural" }
// Réponse  : audio/mpeg (MP3 24 kHz 48 kbit/s mono)
// Sonde    : OPTIONS → 200 application/json { ok: true } (utilisée par le
//            chatbot pour détecter la présence du proxy — un faux positif
//            type « page HTML de repli SPA » est ignoré côté client).
//
// Repli    : sans cette fonction (déploiement glisser-déposer sans
//            fonctions), le chatbot retombe automatiquement sur les voix
//            natives du navigateur — rien n'est cassé, la lecture reste
//            garantie.
//
// Jeton DRM : Sec-MS-GEC v2 — portage fidèle de edge-tts 7.3.0 (drm.py) :
//            SHA-256 modifié (mi-bloc + K[14] ajusté) et CS64, en calcul
//            32 bits pur (Math.imul), validé contre les vecteurs de
//            référence Python (l'ancien jeton v1 reçoit HTTP 403 depuis
//            octobre 2026).
//
// WebSocket sortant : Cloudflare Workers n'autorise pas les en-têtes
//            personnalisés avec `new WebSocket(url)` ; on utilise la
//            technique officielle « fetch + Upgrade: websocket » qui, elle,
//            permet d'envoyer le User-Agent Edge exigé par Microsoft.
//
// Déploiement : le dossier `functions/` doit être à la racine du projet
//            lors du déploiement (intégration Git ou `npx wrangler pages
//            deploy .`). Un glisser-déposer de fichiers seuls ne prend pas
//            en charge les fonctions → voix natives automatiques.
// ═══════════════════════════════════════════════════════════════════════

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const EDGE_TTS = {
  wss: 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1',
  token: '6A5AA1D4EAFF4E9FB37E23D68491D6F4',
  gecVersion: '2-143.0.3650.75',
};

const EDGE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0';

// ── jeton Sec-MS-GEC v2 (portage de drm.py, identique au client) ────────
function edgeSecGecV2() {
  const u32 = (x) => (x >>> 0);
  const mul = (a, b) => Math.imul(a | 0, b | 0) >>> 0;
  const add = (a, b) => u32((a >>> 0) + (b >>> 0));
  const rotR = (v, k) => u32((v >>> k) | u32(v << (32 - k)));
  const rol16 = (v) => u32(u32(v << 16) | (v >>> 16));
  const sg0 = (v) => u32((v >>> 7) ^ u32(v << 25) ^ (v >>> 18) ^ u32(v << 14) ^ (v >>> 3));
  const sg1 = (v) => u32((v >>> 17) ^ u32(v << 15) ^ (v >>> 19) ^ u32(v << 13) ^ (v >>> 10));
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const KMOD = K.slice(); KMOD[14] = 0xc9dc06a7;
  const ST0 = [0xfd9fbea2,0x91243ce7,0xbe499094,0xcd2e1e0a,0x6c006f49,0x04bd35ab,0xfeb0a7e4,0x03effbd2];
  const H0  = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const SCH = [0xeb24bf9e,0x1558691f,0xa0c09ee2,0x0cfa32ba,0xa622ee8c,0xd1dd9491,0xc0dd25a0,0xf9e70ab6,0xf0c31573,0x7058ce4e,0x7188e606,0x00e5ab33,0xd258b060,0x72766564];
  const COEF = [[0xe82e91b1,0xb32700d0],[0x44de24c6,0x88dff51d],[0x3beb65bc,0x29514038],[0xc89c5933,0xb328cbdf],[0x8d1ec211,0xd405b4d5],[0x314ef5d5,0x26e55f3c],[0xe92491b1,0x607801c6],[0xf0a5b9d5,0x82b2c1fb],[0x06064cf3,0xfa51a3da],[0xda79fa60,0x207cc464],[0xbed20560,0x3c3c74f3],[0x89f9c9f8,0xd2d14b61],[0x35fa38c6,0xbb04a2c1],[0xcb49e3c6,0xc5626167]];
  const F64 = 0x82893933, A0 = 0xf2f90b1a, A1 = 0x0b1a0000, S0A = 0x059c0b80, S1A = 0x000b92c0;

  const rounds = (state, w, fr) => {
    let [a, b, c, d, e, f, g, h] = state;
    const KC = (fr === 14) ? KMOD : K;
    for (let i = fr; i < 64; i++) {
      const S1 = u32(rotR(e, 6) ^ rotR(e, 11) ^ rotR(e, 25));
      const t1 = add(add(add(add(h, S1), u32(g ^ (e & (f ^ g)))), KC[i]), w[i]);
      const S0 = u32(rotR(a, 2) ^ rotR(a, 13) ^ rotR(a, 22));
      const t2 = add(S0, u32((a & b) | (c & (a | b))));
      const A = a, B = b, C = c, D = d, E = e, F = f, G = g;
      a = add(t1, t2); b = A; c = B; d = C; e = add(D, t1); f = E; g = F; h = G;
    }
    return [a, b, c, d, e, f, g, h];
  };
  const expand = (w, first) => {
    for (let i = first; i < 64; i++) {
      const x = w[i - 2], y = w[i - 15];
      w[i] = add(add(add(sg1(x), w[i - 7]), sg0(y)), w[i - 16]);
    }
  };
  const bOf = (s) => Uint8Array.from(s, c => c.charCodeAt(0) & 0xFF);
  const hexBE = (words) => words.map(x => u32(x).toString(16).padStart(8, '0').toUpperCase()).join('');
  const hexLE = (words) => words.map(x => {
    const v = u32(x);
    return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]
      .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }).join('');

  const shaInit = (salt7) => {
    const b = bOf(salt7);
    const w = new Array(64).fill(0);
    w[14] = u32((b[0] << 16) | (b[1] << 8) | b[2]);
    w[15] = u32((b[3] << 24) | (b[4] << 16) | (b[5] << 8) | b[6]);
    for (let index = 16; index < 30; index++) {
      let value = SCH[index - 16];
      if (index - 2 >= 14)  value = add(value, (index === 16) ? u32(sg1(w[index - 2]) ^ S1A) : sg1(w[index - 2]));
      if (index - 7 >= 14)  value = add(value, w[index - 7]);
      if (index - 15 >= 14) value = add(value, (index === 29) ? u32(sg0(w[index - 15]) ^ S0A) : sg0(w[index - 15]));
      w[index] = u32(value);
    }
    w[30] = u32(add(add(add(add(sg1(w[28]), w[23]), sg0(w[15])), w[14]) + 0xc9dc06a7 - K[14]));
    expand(w, 31);
    const working = rounds(ST0, w, 14);
    return working.map((x, i) => add(H0[i], x));
  };

  const sha256Custom = (str) => {
    const data = bOf(str);
    const length = 57 + data.length;
    const zeros = (((55 - length) % 64) + 64) % 64;
    const plen = (data.length - 7) + 1 + zeros + 8;
    const padded = new Uint8Array(plen);
    padded.set(data.subarray(7), 0);
    padded[data.length - 7] = 0x80;
    const lenBig = BigInt(length) * 8n;
    for (let i = 0; i < 8; i++) padded[plen - 1 - i] = Number((lenBig >> BigInt(8 * i)) & 0xFFn);
    let state = shaInit(str.slice(0, 7));
    for (let off = 0; off < plen; off += 64) {
      const w = [];
      for (let i = 0; i < 16; i++) w[i] = u32((padded[off + 4*i] << 24) | (padded[off + 4*i + 1] << 16) | (padded[off + 4*i + 2] << 8) | padded[off + 4*i + 3]);
      expand(w, 16);
      const working = rounds(state, w, 0);
      state = state.map((s, i) => add(s, working[i]));
    }
    return state;
  };

  const cs64 = (str, dg) => {
    const data = bOf(str);
    const dB = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
      dB[4*i] = (dg[i] >>> 24) & 255; dB[4*i+1] = (dg[i] >>> 16) & 255;
      dB[4*i+2] = (dg[i] >>> 8) & 255; dB[4*i+3] = dg[i] & 255;
    }
    const kA = u32(dB[0] | (dB[1] << 8) | (dB[2] << 16) | (dB[3] << 24)) | 1;
    const kB = u32(dB[4] | (dB[5] << 8) | (dB[6] << 16) | (dB[7] << 24)) | 1;
    const fA = mul(kA, F64), fB = mul(kB, F64);
    const terms = COEF.map(([coefficient], i) => mul(coefficient, (i % 2 === 0) ? fA : fB));
    const offs = COEF.map(([, offset]) => offset);
    const ext = new Uint8Array(data.length + 1);
    ext[0] = 0; ext.set(data, 1);
    const pad4 = (4 - (ext.length % 4)) % 4;
    const nW4 = (ext.length + pad4) / 4;
    const total = (nW4 % 2 === 0) ? nW4 : nW4 + 1;
    const buf = new Uint8Array(total * 4);
    buf.set(ext, 0);
    for (let i = 0; i < total; i++) {
      const word = u32(buf[4*i] | (buf[4*i + 1] << 8) | (buf[4*i + 2] << 16) | (buf[4*i + 3] << 24));
      let term = mul(word, (i % 2 === 0) ? kA : kB);
      let off = mul(rol16(word), (i % 2 === 0) ? 0xEF0569FB : 0xC31713DB);
      if (i === 0) { term = add(term, mul(A0, fA)); off = add(off, A1); }
      terms.push(term); offs.push(off);
    }
    let swapAcc = 0, swapLast = 0, state = 0, acc = 0;
    for (let index = 0; index < terms.length; index += 2) {
      const x = terms[index], y = terms[index + 1];
      let t = rol16(add(offs[index], x));
      let q = mul(t, 0x76F50F34);
      swapAcc = add(swapAcc, add(mul(rol16(q), 0xC3EFEA97), q));
      t = rol16(add(offs[index + 1], y));
      q = mul(t, 0x1881CE3C);
      swapLast = add(mul(rol16(q), 0x35BD1EC9), q);
      swapAcc = add(swapAcc, swapLast);
      state = add(mul(state, kA), x);
      state = mul(rol16(state), 0xCF98B111);
      state = mul(rol16(state), 0x87085B9F);
      state = mul(rol16(state), 0x12CEB96D);
      state = mul(rol16(state), 0x257E1D83);
      acc = add(acc, state);
      t = add(mul(state, kB), y);
      t = mul(rol16(t), 0xA27416F5);
      t = mul(rol16(t), 0xD38396FF);
      state = mul(rol16(mul(rol16(t), 0x7C932B89)), 0xBFA49F69);
      acc = add(acc, state);
    }
    return [u32(swapLast ^ state), u32(swapAcc ^ acc)];
  };

  const WIN_EPOCH = 11644473600;
  let ticks = Math.floor(Date.now() / 1000) + WIN_EPOCH;
  ticks -= ticks % 300;
  const str = (ticks * 1e7).toFixed(0) + EDGE_TTS.token;
  const dg = sha256Custom(str);
  const [a, b] = cs64(str, dg);
  return hexLE([a, b]) + '-' + hexBE(dg);
}

// ── date au format JavaScript exigé par le service ──────────────────────
function edgeTtsDate() {
  const d = new Date();
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const p2 = (n) => String(n).padStart(2, '0');
  return DAYS[d.getUTCDay()] + ' ' + MONS[d.getUTCMonth()] + ' ' + p2(d.getUTCDate()) + ' ' +
    d.getUTCFullYear() + ' ' + p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes()) + ':' +
    p2(d.getUTCSeconds()) + ' GMT+0000 (Coordinated Universal Time)';
}

// ── nom de voix long attendu dans le SSML ───────────────────────────────
function edgeFullVoice(v) {
  const m = /^(..-..)-(.+)$/.exec(String(v));
  return m ? 'Microsoft Server Speech Text to Speech Voice (' + m[1] + ', ' + m[2] + ')' : String(v);
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

// ── sonde du chatbot (détection du proxy) ───────────────────────────────
export async function onRequestOptions() {
  return new Response(JSON.stringify({ ok: true, service: 'chatmbr-tts' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// ── synthèse : POST { text, voice } → audio/mpeg ────────────────────────
export async function onRequestPost({ request }) {
  const json = (obj, status) => new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json', ...CORS },
  });

  let text, voice;
  try {
    const body = await request.json();
    text = String(body.text || '').trim();
    voice = String(body.voice || 'fr-FR-DeniseNeural');
  } catch (e) {
    return json({ ok: false, error: 'corps JSON invalide' }, 400);
  }
  if (!text) return json({ ok: false, error: 'texte vide' }, 400);
  if (text.length > 1000) return json({ ok: false, error: 'texte trop long (max 1000 caractères)' }, 413);

  let ws, timeout;
  try {
    const gec = edgeSecGecV2();
    const cid = crypto.randomUUID().replace(/-/g, '');
    const url = EDGE_TTS.wss.replace(/^wss:\/\//, 'https://') +
      `?TrustedClientToken=${EDGE_TTS.token}&ConnectionId=${cid}` +
      `&Sec-MS-GEC=${gec}&Sec-MS-GEC-Version=${EDGE_TTS.gecVersion}`;

    // Poignée de main WebSocket sortante — technique Cloudflare officielle
    // « fetch + Upgrade » : contrairement à new WebSocket(), elle permet
    // d'envoyer le User-Agent Edge requis par Microsoft.
    const resp = await fetch(url, {
      headers: {
        'Upgrade': 'websocket',
        'User-Agent': EDGE_UA,
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'muid=' + crypto.randomUUID().replace(/-/g, '').toUpperCase() + ';',
      },
    });
    if (!resp.webSocket) {
      return json({ ok: false, error: 'WebSocket refusé par le service (HTTP ' + resp.status + ')' }, 502);
    }
    ws = resp.webSocket;
    ws.accept();

    // Synthèse : config speech.config puis SSML — format edge-tts 7.3.0
    const ts = edgeTtsDate();
    ws.send('X-Timestamp:' + ts + '\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n' +
      JSON.stringify({ context: { synthesis: { audio: {
        metadataoptions: { sentenceBoundaryEnabled: 'true', wordBoundaryEnabled: 'false' },
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3' } } } }) + '\r\n');
    ws.send('X-RequestId:' + cid + '\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:' + ts +
      'Z\r\nPath:ssml\r\n\r\n' +
      '<speak version=\'1.0\' xmlns=\'http://www.w3.org/2001/10/synthesis\' xml:lang=\'en-US\'>' +
      '<voice name=\'' + edgeFullVoice(voice) + '\'>' +
      '<prosody pitch=\'+0Hz\' rate=\'+0%\' volume=\'+0%\'>' + escapeXml(text) + '</prosody></voice></speak>');

    const audio = await new Promise((resolve, reject) => {
      const chunks = [];
      timeout = setTimeout(() => reject(new Error('délai de synthèse dépassé')), 15000);
      const cleanup = () => { clearTimeout(timeout); try { ws.close(); } catch (e) {} };
      ws.addEventListener('message', (ev) => {
        if (typeof ev.data === 'string') {
          if (ev.data.indexOf('Path:turn.end') !== -1) {
            cleanup();
            resolve(chunks);
          }
          return;
        }
        const dv = new DataView(ev.data);
        const headLen = dv.getUint16(0);
        const part = ev.data.slice(2 + headLen);
        if (part.byteLength) chunks.push(new Uint8Array(part));
      });
      ws.addEventListener('close', () => {
        clearTimeout(timeout);
        reject(new Error('connexion fermée avant la fin de la synthèse'));
      });
    });

    if (!audio.length) return json({ ok: false, error: 'aucun audio reçu' }, 502);
    const total = audio.reduce((n, c) => n + c.length, 0);
    const mp3 = new Uint8Array(total);
    let off = 0;
    for (const c of audio) { mp3.set(c, off); off += c.length; }
    return new Response(mp3.buffer, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store', ...CORS },
    });
  } catch (err) {
    if (timeout) clearTimeout(timeout);
    try { if (ws) ws.close(); } catch (e) {}
    return json({ ok: false, error: String((err && err.message) || err) }, 502);
  }
}
