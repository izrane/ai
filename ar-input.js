// ═══════════════════════════════════════════════════════════════════
// ar-input.js — Izran AI · Saisie de recherche ARABE → Tamazight
// ═══════════════════════════════════════════════════════════════════
// Recherche BIDIRECTIONNELLE :
//   • l'utilisateur tape en ARABE (ex. « شمس ») → le mot est converti
//     en français (« soleil ») → le moteur existant trouve le mot
//     rif en latin + tifinagh (« tfuët ⵜⴼⵓëⵜ ») ;
//   • l'utilisateur tape en rif / tifinagh → sens inverse, déjà géré
//     par la page (définition affichée en arabe en mode AR).
//
// Conversion AR → FR :
//   1. carte inverse du glossaire de i18n-ar.js (I18nAR.WORDS / PHRASES)
//      — 100 % hors-ligne, instantanée (isArabic / toFrenchLocal) ;
//   2. si la couverture locale est trop faible ET l'appareil connecté,
//     repli sur l'API MyMemory (ar|fr), résultat mis en cache dans
//     localStorage (izran-ar-fr-cache-v1) — Promise (toFrench).
//
// Normalisation arabe : tashkeel (voyelles diacritiques) et tatweel
// ignorés, variantes d'alef (أ إ آ ٱ) unifiées, préfixes d'article et
// de conjonction (ال، و، وال، بال، كال، فال، لل) retirés si le mot
// n'est pas trouvé tel quel. L'utilisateur peut donc taper شمس,
// الشمس ou والشمس : les trois mènent à « soleil ».
//
// API publique : window.ArSearch
//   ArSearch.isArabic(texte)         le texte contient-il de l'arabe ?
//   ArSearch.toFrenchLocal(texte)     { fr, hits, total, coverage }
//   ArSearch.toFrench(texte)          Promise → texte français
//   ArSearch.setSearch(fn)            résolveur de désambiguïsation
//                                     (cherche un mot dans le dico pour
//                                     choisir le meilleur candidat FR)
// ═══════════════════════════════════════════════════════════════════
(function (global) {
'use strict';

// ─────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────
var AR_CHARS = '\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF';
var AR_RE = new RegExp('[' + AR_CHARS + ']');
var AR_RUN_RE = new RegExp('[' + AR_CHARS + ']+(?:[\\s\u00A0]+[' + AR_CHARS + ']+)*', 'g');
// préfixes à retirer (du plus long au plus court) si le mot est inconnu tel quel
var PREFIXES = ['\u0648\u0627\u0644', '\u0641\u0627\u0644', '\u0628\u0627\u0644', '\u0643\u0627\u0644', '\u0627\u0644', '\u0644\u0644', '\u0648'];
var API_URL = 'https://api.mymemory.translated.net/get';
var CACHE_KEY = 'izran-ar-fr-cache-v1';

// ─────────────────────────────────────────────────────────────────
// État interne
// ─────────────────────────────────────────────────────────────────
var revWords = null;      // arabe normalisé → [candidats français]
var revPhrases = null;    // expression arabe normalisée → français
var searchResolver = null;// fn(mot) → résultat de recherche dictionnaire
var apiCache = null;      // cache localStorage des traductions API

// ─────────────────────────────────────────────────────────────────
// Normalisation arabe (les deux côtés de la carte sont normalisés)
// ─────────────────────────────────────────────────────────────────
function normalizeAr(s) {
    return String(s == null ? '' : s)
        .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, '')   // tashkeel
        .replace(/\u0640/g, '')                                 // tatweel
        .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')       // آأإٱ → ا
        .replace(/\s+/g, ' ')
        .trim();
}

// ─────────────────────────────────────────────────────────────────
// Construction paresseuse de la carte inverse depuis I18nAR
// ─────────────────────────────────────────────────────────────────
function buildReverse() {
    if (revWords) return;
    revWords = {};
    revPhrases = {};
    var i18n = (typeof global.I18nAR !== 'undefined') ? global.I18nAR : null;
    var W = (i18n && i18n.WORDS) ? i18n.WORDS : {};
    var P = (i18n && i18n.PHRASES) ? i18n.PHRASES : {};
    var k, v, nv;
    // mots simples : arabe → liste de candidats français
    for (k in W) {
        if (!Object.prototype.hasOwnProperty.call(W, k)) continue;
        v = W[k];
        if (!v) continue;
        nv = normalizeAr(v);
        if (!nv) continue;
        if (/\s/.test(nv)) {
            // valeur arabe multi-mots → carte des expressions
            if (!revPhrases[nv]) revPhrases[nv] = k;
        } else {
            if (!revWords[nv]) revWords[nv] = [];
            if (revWords[nv].indexOf(k) === -1) revWords[nv].push(k);
        }
    }
    // expressions : arabe (multi-mots) → français
    for (k in P) {
        if (!Object.prototype.hasOwnProperty.call(P, k)) continue;
        v = P[k];
        if (!v) continue;
        nv = normalizeAr(v);
        if (nv && !revPhrases[nv]) revPhrases[nv] = k;
    }
}

// ─────────────────────────────────────────────────────────────────
// Recherche d'un mot arabe dans la carte inverse (avec préfixes)
// ─────────────────────────────────────────────────────────────────
function lookupWord(arWord) {
    buildReverse();
    var w = normalizeAr(arWord);
    if (!w) return [];
    if (revWords[w]) return revWords[w].slice();
    // inconnu tel quel → essayer sans article / conjonction
    for (var i = 0; i < PREFIXES.length; i++) {
        var p = PREFIXES[i];
        if (w.indexOf(p) === 0 && w.length - p.length >= 2) {
            var stem = w.slice(p.length);
            if (revWords[stem]) return revWords[stem].slice();
            // et sans le إ préfixé des formes َأَفعال (rare) : on garde simple
        }
    }
    return [];
}

// Meilleur candidat français : si plusieurs mots français partagent
// la même forme arabe, on préfère celui qui EXISTE dans le dictionnaire
// (le résolveur est fourni par la page : izranWorker.search).
function bestCandidate(cands) {
    if (!cands || !cands.length) return '';
    if (cands.length === 1 || typeof searchResolver !== 'function') return cands[0];
    for (var i = 0; i < cands.length; i++) {
        try {
            var r = searchResolver(cands[i]);
            if (r && r.success && r.results && r.results.length) return cands[i];
        } catch (e) {}
    }
    return cands[0];
}

// ─────────────────────────────────────────────────────────────────
// Détection
// ─────────────────────────────────────────────────────────────────
function isArabic(text) {
    return AR_RE.test(String(text == null ? '' : text));
}

// ─────────────────────────────────────────────────────────────────
// Conversion locale (synchrone) : arabe → français
// Les mots arabes inconnus sont simplement omis (couverture le dira).
// ─────────────────────────────────────────────────────────────────
function toFrenchLocal(text) {
    buildReverse();
    var t = String(text == null ? '' : text);
    if (!isArabic(t)) return { fr: t, hits: 0, total: 0, coverage: 1 };
    var tokens = t.match(new RegExp('[' + AR_CHARS + ']+|[^' + AR_CHARS + ']+', 'g')) || [];
    var out = [], hits = 0, total = 0, i;
    for (i = 0; i < tokens.length; i++) {
        var tok = tokens[i];
        if (AR_RE.test(tok)) {
            total++;
            var norm = normalizeAr(tok);
            var fr = '';
            if (revPhrases[norm]) {
                fr = revPhrases[norm];                     // expression connue
                hits++;
            } else {
                var cands = lookupWord(tok);
                fr = bestCandidate(cands);
                if (fr) hits++;
            }
            if (fr) out.push(fr);
        } else {
            // texte non arabe (français, tifinagh, chiffres…) conservé
            var keep = tok.replace(/\s+/g, ' ');
            out.push(keep);
        }
    }
    var fr = out.join(' ').replace(/\s+/g, ' ').trim();
    return { fr: fr, hits: hits, total: total, coverage: total ? hits / total : 1 };
}

// ─────────────────────────────────────────────────────────────────
// Repli API MyMemory (ar|fr) + cache localStorage
// ─────────────────────────────────────────────────────────────────
function loadCache() {
    if (apiCache !== null) return;
    try { apiCache = JSON.parse(global.localStorage.getItem(CACHE_KEY) || '{}'); }
    catch (e) { apiCache = {}; }
    if (typeof apiCache !== 'object' || !apiCache) apiCache = {};
}
function saveCache() {
    try { global.localStorage.setItem(CACHE_KEY, JSON.stringify(apiCache)); }
    catch (e) { /* quota : on ignore */ }
}

function apiTranslate(text) {
    loadCache();
    var src = String(text == null ? '' : text).trim();
    if (!src) return Promise.resolve('');
    if (apiCache[src]) return Promise.resolve(apiCache[src]);
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return Promise.reject(new Error('hors-ligne'));
    }
    var q = src.length > 480 ? src.slice(0, 480) : src;
    var url = API_URL + '?q=' + encodeURIComponent(q) + '&langpair=ar|fr';
    return global.fetch(url).then(function (r) { return r.json(); }).then(function (d) {
        var t = d && d.responseData && d.responseData.translatedText;
        if (!t || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(t)) {
            throw new Error('réponse inutilisable');
        }
        apiCache[src] = t;
        saveCache();
        return t;
    });
}

// ─────────────────────────────────────────────────────────────────
// Conversion hybride (Promise) : locale d'abord, API si besoin
// ─────────────────────────────────────────────────────────────────
function toFrench(text) {
    var t = String(text == null ? '' : text);
    if (!isArabic(t)) return Promise.resolve(t.trim());
    var local = toFrenchLocal(t);
    if (local.total && local.coverage >= 0.55) return Promise.resolve(local.fr);
    if (typeof global.fetch !== 'function') return Promise.resolve(local.fr);

    // Repli API sur les segments arabes inconnus uniquement
    var runs = t.match(AR_RUN_RE) || [];
    var jobs = [];
    for (var i = 0; i < runs.length; i++) {
        (function (run) {
            jobs.push(apiTranslate(run).catch(function () { return ''; }));
        })(runs[i]);
    }
    return Promise.all(jobs).then(function (frs) {
        var out = t, got = 0;
        for (var j = 0; j < runs.length; j++) {
            var rep = String(frs[j] || '').trim();
            if (!rep) continue;
            got++;
            (function (run, replacement) {
                out = out.replace(run, function () { return replacement; });
            })(runs[j], rep);
        }
        if (got === 0) return local.fr;   // API muette → résultat local partiel
        return out.replace(/\s+/g, ' ').trim();
    }).catch(function () { return local.fr; });
}

// ─────────────────────────────────────────────────────────────────
// API publique
// ─────────────────────────────────────────────────────────────────
var ArSearch = {
    isArabic: isArabic,
    toFrenchLocal: toFrenchLocal,
    toFrench: toFrench,
    setSearch: function (fn) { searchResolver = fn; },
    normalizeAr: normalizeAr,
    version: '1.0.0'
};

global.ArSearch = ArSearch;
if (typeof module !== 'undefined' && module.exports) module.exports = ArSearch; // tests Node

})(typeof window !== 'undefined' ? window : this);
