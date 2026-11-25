// ═══════════════════════════════════════════════════════════════════
// tts-ar.js — Izran AI · TTS arabe (prononciation des mots arabes)
// ═══════════════════════════════════════════════════════════════════
// Prononciation arabe des définitions affichées en mode arabe :
//   • i18n-ar.js (defHTML) insère un petit bouton haut-parleur
//     « .tts-ar-btn » à côté de chaque définition arabe ;
//   • ce module installe UN écouteur délégué global (phase de capture)
//     qui lit le texte du bouton (attribut data-say) avec une voix
//     arabe de l'appareil — y compris le contenu ajouté dynamiquement
//     (suggestions, favoris, lexique, OCR, réponses du bot).
//
// Technologie : Web Speech API (speechSynthesis) intégrée au navigateur.
// Aucune clé API, aucun envoi réseau : fonctionne hors-ligne dès qu'une
// voix arabe est installée sur l'appareil (Android, Windows, macOS et
// iOS en proposent). Sans voix arabe : simple message d'aide (toast),
// aucune modification du contenu affiché.
//
// Choix de la voix si plusieurs : ar-MA (Maroc) > ar-DZ > ar-SA >
// ar-EG > ar-XA > ar-TN > ar-LY > voix locale > première voix arabe.
//
// API publique : window.TTSAr
//   TTSAr.speak(texte)     lit un texte (annule la lecture en cours)
//   TTSAr.stop()            arrête la lecture
//   TTSAr.pickVoice(voices) meilleure voix arabe d'une liste (ou null)
//   TTSAr.available()       au moins une voix arabe présente ?
//   TTSAr.btn(texte)        HTML du bouton haut-parleur (avec data-say)
//   TTSAr.warnNoVoice()     toast « aucune voix arabe » (anti-spam)
//
// Le bouton « Écouter » du chat et de l'OCR (fonction speakText du
// HTML, v25.7) réutilise aussi TTSAr.pickVoice pour lire les segments
// arabes avec la voix arabe (le tifinagh garde sa voix hindi).
// ═══════════════════════════════════════════════════════════════════
(function (global) {
'use strict';

// ─────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────
var AR_CHARS = '\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF';
var AR_RUN_RE = new RegExp('[' + AR_CHARS + ']+(?:[\\s\u00A0]+[' + AR_CHARS + ']+)*', 'g');
var PREF = ['ar-ma', 'ar-dz', 'ar-sa', 'ar-eg', 'ar-xa', 'ar-tn', 'ar-ly', 'ar'];
var SVG = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3z"/>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
    'd="M15.5 8.6a5 5 0 0 1 0 6.8M17.9 6.2a8 8 0 0 1 0 11.6"/></svg>';

var cachedVoice = null;   // voix arabe choisie (mise en cache)
var installed = false;    // écouteur délégué posé ?
var activeBtn = null;     // bouton en cours de lecture
var watchTimer = null;    // minuteur de surveillance
var keepAlive = [];       // références des utterances (bug GC iOS/Chrome)
var lastWarn = 0;         // anti-spam du toast

// ─────────────────────────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────────────────────────
function getSynth() {
    try { return global.speechSynthesis || null; } catch (e) { return null; }
}

function esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Langue d'interface courante de l'app (fr / ar) — même logique que i18n-ar.js
function appLang() {
    try {
        if (typeof global.currentLang !== 'undefined' && global.currentLang) return String(global.currentLang);
        if (typeof localStorage !== 'undefined' && localStorage.getItem('izran-lang') === 'ar') return 'ar';
    } catch (e) {}
    return 'fr';
}

// Meilleure voix arabe d'une liste (fonction pure, réutilisable par la page)
function pickVoice(voices) {
    if (!voices || !voices.length) return null;
    var ar = [], i, j;
    for (i = 0; i < voices.length; i++) {
        if (voices[i] && voices[i].lang &&
            String(voices[i].lang).toLowerCase().indexOf('ar') === 0) ar.push(voices[i]);
    }
    if (!ar.length) return null;
    // 1) préférences régionales (public amazigh : Maroc, puis Algérie…)
    for (i = 0; i < PREF.length; i++) {
        for (j = 0; j < ar.length; j++) {
            if (String(ar[j].lang || '').toLowerCase().replace('_', '-') === PREF[i]) return ar[j];
        }
    }
    // 2) voix locale (fonctionne hors-ligne) en priorité
    for (j = 0; j < ar.length; j++) if (ar[j].localService) return ar[j];
    // 3) première voix arabe disponible
    return ar[0];
}

function refreshVoice() {
    var synth = getSynth();
    if (!synth || !synth.getVoices) { cachedVoice = null; return null; }
    try { cachedVoice = pickVoice(synth.getVoices()); } catch (e) { cachedVoice = null; }
    return cachedVoice;
}

// Nettoyage : espaces multiples + ponctuation/ornements des extrémités
function cleanText(text) {
    return String(text == null ? '' : text)
        .replace(/\s+/g, ' ')
        .replace(/^[«»"'“”‘’()\[\]{}.,;:!?…•·▪*_\-–—\s]+/, '')
        .replace(/[«»"'“”‘’()\[\]{}.,;:!?…•·▪*_\-–—\s]+$/, '')
        .trim();
}

// Découpage arabe / reste (latin, tifinagh…) — l'arabe garde la voix arabe
function splitByScript(text) {
    var segs = [], last = 0, m;
    AR_RUN_RE.lastIndex = 0;
    while ((m = AR_RUN_RE.exec(text)) !== null) {
        if (m.index > last) segs.push({ t: text.slice(last, m.index), ar: false });
        segs.push({ t: m[0], ar: true });
        last = m.index + m[0].length;
    }
    if (last < text.length) segs.push({ t: text.slice(last), ar: false });
    return segs;
}

// Découpe en morceaux courts (certains moteurs coupent les textes longs)
function chunkText(t, max) {
    max = max || 175;
    t = String(t == null ? '' : t).trim();
    if (t.length <= max) return [t];
    var out = [], words = t.split(/\s+/), cur = '';
    for (var i = 0; i < words.length; i++) {
        var w = words[i];
        if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; }
        else cur = cur ? cur + ' ' + w : w;
    }
    if (cur) out.push(cur);
    return out;
}

// ─────────────────────────────────────────────────────────────────
// État visuel du bouton en cours de lecture
// ─────────────────────────────────────────────────────────────────
function setActive(btn) { activeBtn = btn; try { btn.classList.add('speaking'); } catch (e) {} }
function clearActive() {
    if (watchTimer) { clearInterval(watchTimer); watchTimer = null; }
    if (activeBtn) { try { activeBtn.classList.remove('speaking'); } catch (e) {} activeBtn = null; }
    keepAlive = [];
}
function maybeDone() {
    var s = getSynth();
    if (!s) { clearActive(); return; }
    setTimeout(function () {
        if (!s.speaking && !s.pending) clearActive();
    }, 150);
}
function watch() {
    if (watchTimer) { clearInterval(watchTimer); watchTimer = null; }
    var start = Date.now();
    watchTimer = setInterval(function () {
        var s = getSynth();
        if (!s || Date.now() - start > 180000 ||
            (Date.now() - start > 900 && !s.speaking && !s.pending)) clearActive();
    }, 400);
}

// ─────────────────────────────────────────────────────────────────
// Lecture
// ─────────────────────────────────────────────────────────────────
function speak(text, btn) {
    var synth = getSynth();
    if (!synth || typeof global.SpeechSynthesisUtterance !== 'function') {
        warnNoVoice('unsupported');
        return false;
    }
    var t = cleanText(text);
    if (!t) return false;
    var v = cachedVoice || refreshVoice();
    if (!v) { warnNoVoice(); return false; }
    try { stop(); } catch (e) {}
    // voix française de repli pour les segments non arabes (mots latins…)
    var voices = [];
    try { voices = synth.getVoices() || []; } catch (e) {}
    var frVoice = null;
    for (var i = 0; i < voices.length; i++) {
        if (voices[i] && voices[i].lang &&
            String(voices[i].lang).toLowerCase().indexOf('fr') === 0) { frVoice = voices[i]; break; }
    }
    var spoken = 0;
    splitByScript(t).forEach(function (seg) {
        if (!seg.t.trim()) return;
        chunkText(seg.t).forEach(function (part) {
            try {
                var u = new global.SpeechSynthesisUtterance(part);
                if (seg.ar) { u.voice = v; u.lang = v.lang || 'ar'; }
                else if (frVoice) { u.voice = frVoice; u.lang = frVoice.lang || 'fr-FR'; }
                u.rate = 0.9;
                u.onend = maybeDone;
                u.onerror = maybeDone;
                keepAlive.push(u);
                synth.speak(u);
                spoken++;
            } catch (e) {}
        });
    });
    if (spoken > 0 && btn) setActive(btn);
    if (spoken > 0) watch();
    return spoken > 0;
}

function stop() {
    var synth = getSynth();
    try { if (synth && synth.cancel) synth.cancel(); } catch (e) {}
    clearActive();
}

// ─────────────────────────────────────────────────────────────────
// Toast « aucune voix arabe » (bilingue, anti-spam 15 s)
// ─────────────────────────────────────────────────────────────────
function fallbackToast(msg, rtl) {
    try {
        var d = document.createElement('div');
        d.textContent = msg;
        d.setAttribute('dir', rtl ? 'rtl' : 'ltr');
        d.style.cssText = 'position:fixed;bottom:96px;left:50%;transform:translateX(-50%);' +
            'background:rgba(0,0,0,0.82);color:#fff;padding:11px 20px;border-radius:22px;' +
            'font-family:Inter,sans-serif;font-size:0.88rem;font-weight:600;z-index:999999;' +
            'opacity:0;transition:opacity .3s;pointer-events:none;max-width:88vw;text-align:center;';
        document.body.appendChild(d);
        requestAnimationFrame(function () { d.style.opacity = '1'; });
        setTimeout(function () {
            d.style.opacity = '0';
            setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 400);
        }, 4200);
    } catch (e) {}
}

function warnNoVoice(kind) {
    var now = Date.now();
    if (now - lastWarn < 15000) return;
    lastWarn = now;
    var isAr = appLang() === 'ar';
    var msg;
    if (kind === 'unsupported' || !getSynth()) {
        msg = isAr
            ? 'التحويل الصوتي غير متوفر في هذا المتصفح.'
            : "La synthèse vocale n'est pas disponible dans ce navigateur.";
    } else {
        msg = isAr
            ? 'لا توجد أصوات عربية على هذا الجهاز — أضف صوتًا عربيًا من إعدادات النظام (اللغة والنطق) ثم أعد تحميل الصفحة.'
            : "Aucune voix arabe installée sur cet appareil — ajoutez-en une dans les réglages système (Langue / Synthèse vocale), puis rechargez la page.";
    }
    if (typeof global.showToast === 'function') { try { global.showToast(msg, 4200); } catch (e) { fallbackToast(msg, isAr); } }
    else fallbackToast(msg, isAr);
}

// ─────────────────────────────────────────────────────────────────
// Bouton haut-parleur (HTML) — inséré par i18n-ar.js dans defHTML()
// ─────────────────────────────────────────────────────────────────
function btn(text) {
    var isAr = appLang() === 'ar';
    var title = isAr ? 'استمع إلى النطق' : 'Écouter la prononciation arabe';
    return '<button type="button" class="tts-ar-btn" data-say="' + esc(text) + '"' +
        ' title="' + esc(title) + '" aria-label="' + esc(title) + '" dir="ltr">' + SVG + '</button>';
}

// ─────────────────────────────────────────────────────────────────
// Écouteur délégué global (phase de CAPTURE pour devancer les onclick
// des lignes parents, ex. sélection d'une suggestion)
// ─────────────────────────────────────────────────────────────────
function onCapturedClick(e) {
    var el = null;
    try { el = e.target && e.target.closest ? e.target.closest('.tts-ar-btn') : null; } catch (err) {}
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    // re-clic sur le même bouton pendant la lecture → arrêt
    if (activeBtn === el) { stop(); return; }
    var text = el.getAttribute('data-say') || '';
    speak(text, el);
}

function install() {
    if (installed || typeof document === 'undefined') return;
    installed = true;
    document.addEventListener('click', onCapturedClick, true);
}

// ─────────────────────────────────────────────────────────────────
// API publique
// ─────────────────────────────────────────────────────────────────
var TTSAr = {
    speak: speak,
    stop: stop,
    pickVoice: pickVoice,
    available: function () { return !!(cachedVoice || refreshVoice()); },
    btn: btn,
    warnNoVoice: warnNoVoice,
    install: install,
    version: '1.0.0',
    _internal: { splitByScript: splitByScript, chunkText: chunkText, cleanText: cleanText }
};

global.TTSAr = TTSAr;
if (typeof module !== 'undefined' && module.exports) module.exports = TTSAr; // tests Node

// ─────────────────────────────────────────────────────────────────
// Initialisation : cache de voix + rechargement quand la liste arrive
// (Chrome remplit getVoices() de façon asynchrone via voiceschanged)
// ─────────────────────────────────────────────────────────────────
try {
    var s = getSynth();
    if (s) {
        refreshVoice();
        if (s.addEventListener) s.addEventListener('voiceschanged', function () { cachedVoice = null; refreshVoice(); });
        else if (typeof s.onvoiceschanged !== 'undefined') s.onvoiceschanged = function () { cachedVoice = null; refreshVoice(); };
    }
} catch (e) {}
install();

})(typeof window !== 'undefined' ? window : this);
