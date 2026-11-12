/* ════════════════════════════════════════════════════════════════
   ChatMBR — i18n.js
   Interface trilingue FR / EN / AR — couche AJOUTÉE, rien supprimé.
   • Le français reste la langue d'origine (texte du HTML = secours).
   • AR : bascule automatique en RTL (classe body.rtl — CSS déjà prêt).
   • Préférence mémorisée dans localStorage (clé 'chatmbr_lang').
   • Utilisation : bouton 🌐 (cycleLang) ou setLang('fr'|'en'|'ar').
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // 'auto' = détecte la langue du navigateur (fr par défaut).
  // Mettre 'fr', 'en' ou 'ar' pour forcer une langue fixe.
  var DEFAULT_LANG = 'auto';

  var ORDER = ['fr', 'en', 'ar'];

  var DICT = {

    /* ═══════════ FRANÇAIS (langue d'origine) ═══════════ */
    fr: {
      sidebar_web:          '🔍 Web Search',
      sidebar_office:       '🖨️ Office',
      sidebar_mail:         '📧 é-Mail',
      sidebar_emoji:        '💖 emoji',
      sidebar_coran:        '🕌 coran',
      sidebar_adhkar:       '📅 Adhkar',
      sidebar_allah:        '🧭 Allah',
      sidebar_jeux:         '🎮 jeux',
      sidebar_tchat:        '💬 Tchat',
      sidebar_favoris:      '⭐ Favoris',
      sidebar_lexique:      '📜 Lexique Amazigh',
      sidebar_clavier:      '📠 Clavier ⵜⵉⴼⵉⵏⴰⵖ',
      sidebar_reset:        '🗑️ Réinitialiser',
      home_title:           'page d\'accueil',
      send_btn:             '➤ Envoyer',
      user_ph:              'Tapez ou 🎤 parlez... (ex: abeille, ⵜⵉⵣⵉⵣⵡⵉⵜ, tif: gher, chawi: izmer, moz: acca)',
      stt_title:            'Langue du micro. Tamazight : transcrit phonétiquement via 🇫🇷 FR ; Arabe : translittéré en latin',
      mic_title:            '🎤 Recherche vocale',
      install_h4:           '📲 Installer ChatMBR',
      install_p:            'Installez l\'app sur votre appareil pour l\'utiliser <b>hors-ligne</b> !',
      install_btn:          '⬇️ Installer maintenant',
      install_close:        'Plus tard',
      modal_web:            '🔍 Web',
      modal_office:         '🖨️ My Office',
      modal_mazika:         '🎵 Mazika Rifaine',
      modal_izran:          '🎬 Izran NaRif Music',
      modal_emoji:          '💖 emoji',
      modal_coran:          '🕌 Quran Kareem',
      modal_social:         '🌍 ⴰⵎⴰⵣⵉⵖ Social',
      modal_jeux:           '🎮 jeux',
      modal_link:           '🔗 short link',
      modal_map:            '🗺️ Map Karta',
      modal_chat:           '💬 Tchat',
      modal_mail:           '📧 é-Mail envoyer',
      modal_add:            '🧭 Allah Names',
      modal_lexique:        '📜 Lexique Amazigh — ⴰⵎⴰⵡⴰⵍ ⴰⵎⴰⵣⵉⵖ',
      close:                'Fermer',
      lex_ph:               '🔍 Filtrer : français, latin ou ⵜⵉⴼⵉⵏⴰⵖ…',
      lex_dialect_title:    'Filtrer par dialecte',
      lex_all:              '🌐 Tous',
      lex_rif:              '🔵 Rif',
      lex_chawi:            '🟠 Chawi',
      lex_moz:              '🟢 Mozabite',
      lex_nafusa:           '🟣 Nefoussa',
      lex_more:             '⬇️ Afficher plus',
      tif_header:           '⌨️ <b>Clavier Tifinagh</b> — tapez directement en ⵉⴼⵉⵏⴰⵖ',
      tif_close:            'Fermer le clavier',
      latin_ph:             '✍️ Latin → Tifinagh : tizizwit, gher, a3zri…',
      insert_btn:           '⬇️ Insérer dans le champ de recherche',
      dico_all:             '🌐 Tous (Rif + Chawi + Mozabite)',
      dico_rif:             '🔵 Rif / Tarifit',
      dico_chawi:           '🟠 Chawi / Chaoui',
      dico_moz:             '🟢 Mozabite / Tumzabt',
      dico_nafusa:          '🟣 Nefoussa / ⵜⴰⵏⴰⴼⵓⵙⵉⵜ',
      icon_web:             '🔍 Web Search',
      icon_izran:           '🎬 Izran NaRif Music',
      icon_mazika:          '🎵 Mazika Rifaine',
      icon_emoji:           '💖 emoji',
      icon_add:             '🧭 Allah 99 Names',
      icon_office:          '🖨️ My Office',
      icon_jeux:            '🎮 jeux',
      btn_lex:              '📜 Lexique des mots amazighs',
      btn_kbd:              'Ouvrir/fermer le clavier Tifinagh',
      btn_fav:              '⭐ Afficher les Favois',
      btn_reset:            '🗑️ Réinitialiser',
      space_key:            '␣ Espace',
      transcribe_fail:      'Impossible de transcrire',
      no_result:            'Aucun résultat',
      no_result_for:        'pour «',
      no_result_hint:       'Changez de Variante (🌐) ou reformulez.',
      results:              'résultat(s)',
      voir_plus:            '⬇️ Voir plus ({n})',
      autres_sg:            'autre',
      autres_pl:            'autres',
      voir_moins:           '⬆️ Voir moins',
      entries:              'entrées',
      root:                 'racine',
      bot:                  'Bot',
      you:                  'Vous',
      stt_unsupported:      '🎤 Non supporté.',
      stt_listening:        '🎙️ Je vous écoute…',
      stt_error:            '🎤 Erreur : ',
      stt_hint:             'Tapez ou 🎤 parlez...',
      stt_start_fail:       '🎤 Impossible de démarrer.',
      tif_hindi:            '🎤 Tifinagh → Hindi 🇮🇳',
      tif_fr:               '🎤 Tifinagh → Français 🇫🇷',
      auto_tts:             '🔊 Auto TTS: {s}',
      offline_msg:          '📴 Vous êtes hors-ligne.',
      gemini_offline_note:  '📴 Fallback Gemini indisponible hors-ligne.',
      gemini_thinking:      '✨ Gemini réfléchit…',
      err_timeout:          'délai dépassé ({n} s)',
      not_understood:       '🤔 Je n\'ai pas compris. Pouvez-vous reformuler ?',
      gemini_unavailable:   '⚠️ Fallback Gemini indisponible ({why}). Vérifiez la fonction Netlify et la variable GEMINI_API_KEY.',
      fav_title:            'Messages Favoris',
      no_favorites:         'Aucun favoris',
      online:               '🌐 En ligne',
      offline_short:        '📴 Hors-ligne',
    },

    /* ═══════════ ENGLISH ═══════════ */
    en: {
      // — Barre latérale —
      sidebar_web: '🔍 Web Search',
      sidebar_office: '🖨️ Office',
      sidebar_mail: '📧 e-Mail',
      sidebar_emoji: '💖 Emoji',
      sidebar_coran: '🕌 Quran',
      sidebar_adhkar: '📅 Adhkar',
      sidebar_allah: '🧭 Allah',
      sidebar_jeux: '🎮 Games',
      sidebar_tchat: '💬 Chat',
      sidebar_favoris: '⭐ Favorites',
      sidebar_lexique: '📜 Amazigh Lexicon',
      sidebar_clavier: '📠 Tifinagh Keyboard',
      sidebar_reset: '🗑️ Reset',
      home_title: 'Home page',
      // — Contrôles principaux —
      send_btn: '➤ Send',
      user_ph: 'Type or 🎤 speak... (e.g.: bee, ⵜⵉⵣⵉⵣⵡⵉⵜ, tif: gher, chawi: izmer, moz: acca)',
      stt_title: 'Microphone language. Tamazight: phonetic transcription via 🇫🇷 FR; Arabic: transliterated to Latin script',
      mic_title: '🎤 Voice search',
      // — Bandeau d'installation —
      install_h4: '📲 Install ChatMBR',
      install_p: 'Install the app on your device to use it <b>offline</b>!',
      install_btn: '⬇️ Install now',
      install_close: 'Later',
      // — Titres des fenêtres (modals) —
      modal_web: '🔍 Web',
      modal_office: '🖨️ My Office',
      modal_mazika: '🎵 Rif Music',
      modal_izran: '🎬 Izran Rif Music',
      modal_emoji: '💖 Emoji',
      modal_coran: '🕌 Quran Kareem',
      modal_social: '🌍 Amazigh Social',
      modal_jeux: '🎮 Games',
      modal_link: '🔗 Short link',
      modal_map: '🗺️ Map',
      modal_chat: '💬 Chat',
      modal_mail: '📧 Send e-Mail',
      modal_add: '🧭 Allah Names',
      modal_lexique: '📜 Amazigh Lexicon — ⴰⵎⴰⵡⴰⵍ ⴰⵎⴰⵣⵉⵖ',
      close: 'Close',
      // — Fenêtre Lexique —
      lex_ph: '🔍 Filter: French, Latin or ⵜⵉⴼⵉⵏⴰⵖ…',
      lex_dialect_title: 'Filter by dialect',
      lex_all: '🌐 All',
      lex_rif: '🔵 Rif',
      lex_chawi: '🟠 Chawi',
      lex_moz: '🟢 Mozabite',
      lex_nafusa: '🟣 Nefoussa',
      lex_more: '⬇️ Show more',
      // — Clavier Tifinagh —
      tif_header: '⌨️ <b>Tifinagh Keyboard</b> — type directly in ⵜⵉⴼⵉⵏⴰⵖ',
      tif_close: 'Close the keyboard',
      latin_ph: '✍️ Latin → Tifinagh: tizizwit, gher, a3zri…',
      insert_btn: '⬇️ Insert into the search field',
      // — Filtre dialectal —
      dico_all: '🌐 All (Rif + Chawi + Mozabite)',
      dico_rif: '🔵 Rif / Tarifit',
      dico_chawi: '🟠 Chawi / Chaoui',
      dico_moz: '🟢 Mozabite / Tumzabt',
      dico_nafusa: '🟣 Nefoussa / ⵜⴰⵏⴰⴼⵓⵙⵉⵜ',
      // — Infobulles des boutons —
      icon_web: '🔍 Web Search',
      icon_izran: '🎬 Izran Rif Music',
      icon_mazika: '🎵 Rif Music',
      icon_emoji: '💖 Emoji',
      icon_add: '🧭 Allah 99 Names',
      icon_office: '🖨️ My Office',
      icon_jeux: '🎮 Games',
      btn_lex: '📜 Lexicon of Amazigh words',
      btn_kbd: 'Open/close the Tifinagh keyboard',
      btn_fav: '⭐ Show favorites',
      btn_reset: '🗑️ Reset',
      // — Textes dynamiques (JS) —
      space_key: '␣ Space',
      transcribe_fail: 'Cannot transcribe',
      no_result: 'No result',
      no_result_for: 'for «',
      no_result_hint: 'Try another variant (🌐) or rephrase.',
      results: 'result(s)',
      voir_plus: '⬇️ See more ({n})',
      autres_sg: 'more',
      autres_pl: 'more',
      voir_moins: '⬆️ See less',
      entries: 'entries',
      root: 'root',
      bot: 'Bot',
      you: 'You',
      stt_unsupported: '🎤 Not supported.',
      stt_listening: '🎙️ I am listening…',
      stt_error: '🎤 Error: ',
      stt_hint: 'Type or 🎤 speak...',
      stt_start_fail: '🎤 Could not start.',
      tif_hindi: '🎤 Tifinagh → Hindi 🇮🇳',
      tif_fr: '🎤 Tifinagh → French 🇫🇷',
      auto_tts: '🔊 Auto TTS: {s}',
      offline_msg: '📴 You are offline.',
      gemini_offline_note: '📴 Gemini fallback unavailable offline.',
      gemini_thinking: '✨ Gemini is thinking…',
      err_timeout: 'timeout ({n} s)',
      not_understood: '🤔 I didn\'t understand. Could you rephrase?',
      gemini_unavailable: '⚠️ Gemini fallback unavailable ({why}). Check the Netlify function and the GEMINI_API_KEY variable.',
      fav_title: 'Favorite messages',
      no_favorites: 'No favorites',
      online: '🌐 Online',
      offline_short: '📴 Offline'
    },

    /* ═══════════ العربية ═══════════ */
    ar: {
      // — الشريط الجانبي —
      sidebar_web: '🔍 البحث في الويب',
      sidebar_office: '🖨️ المكتب',
      sidebar_mail: '📧 بريد إلكتروني',
      sidebar_emoji: '💖 رموز تعبيرية',
      sidebar_coran: '🕌 القرآن',
      sidebar_adhkar: '📅 الأذكار',
      sidebar_allah: '🧭 أسماء الله',
      sidebar_jeux: '🎮 ألعاب',
      sidebar_tchat: '💬 محادثة',
      sidebar_favoris: '⭐ المفضلة',
      sidebar_lexique: '📜 المعجم الأمازيغي',
      sidebar_clavier: '📠 لوحة مفاتيح ⵜⵉⴼⵉⵏⴰⵖ',
      sidebar_reset: '🗑️ إعادة تعيين',
      home_title: 'الصفحة الرئيسية',
      // — الأزرار الرئيسية —
      send_btn: '➤ إرسال',
      user_ph: 'اكتب أو 🎤 تحدث... (مثال: نحلة، ⵜⵉⵣⵉⵣⵡⵉⵜ، tif: gher، chawi: izmer، moz: acca)',
      stt_title: 'لغة الميكروفون. الأمازيغية: تُكتب صوتيًا عبر 🇫🇷 FR؛ العربية: تُنقل إلى الحروف اللاتينية',
      mic_title: '🎤 البحث الصوتي',
      // — بانر التثبيت —
      install_h4: '📲 تثبيت ChatMBR',
      install_p: 'ثبّت التطبيق على جهازك لاستخدامه <b>دون اتصال</b>!',
      install_btn: '⬇️ ثبّت الآن',
      install_close: 'لاحقًا',
      // — عناوين النوافذ —
      modal_web: '🔍 الويب',
      modal_office: '🖨️ مكتبي',
      modal_mazika: '🎵 موسيقى ريفية',
      modal_izran: '🎬 إزران موسيقى الريف',
      modal_emoji: '💖 رموز تعبيرية',
      modal_coran: '🕌 القرآن الكريم',
      modal_social: '🌍 التواصل الأمازيغي',
      modal_jeux: '🎮 ألعاب',
      modal_link: '🔗 رابط مختصر',
      modal_map: '🗺️ الخريطة',
      modal_chat: '💬 محادثة',
      modal_mail: '📧 إرسال بريد إلكتروني',
      modal_add: '🧭 أسماء الله',
      modal_lexique: '📜 المعجم الأمازيغي — ⴰⵎⴰⵡⴰⵍ ⴰⵎⴰⵣⵉⵖ',
      close: 'إغلاق',
      // — نافذة المعجم —
      lex_ph: '🔍 تصفية: فرنسية، لاتينية أو ⵜⵉⴼⵉⵏⴰⵖ…',
      lex_dialect_title: 'تصفية حسب اللهجة',
      lex_all: '🌐 الكل',
      lex_rif: '🔵 الريف',
      lex_chawi: '🟠 الشاوي',
      lex_moz: '🟢 المزابي',
      lex_nafusa: '🟣 النفوسة',
      lex_more: '⬇️ عرض المزيد',
      // — لوحة المفاتيح تيفيناغ —
      tif_header: '⌨️ <b>لوحة مفاتيح تيفيناغ</b> — اكتب مباشرة بالأمازيغية ⵜⵉⴼⵉⵏⴰⵖ',
      tif_close: 'إغلاق لوحة المفاتيح',
      latin_ph: '✍️ لاتيني ← تيفيناغ: tizizwit، gher، a3zri…',
      insert_btn: '⬇️ إدراج في حقل البحث',
      // — مرشح اللهجات —
      dico_all: '🌐 الكل (ريف + شاوي + مزاب)',
      dico_rif: '🔵 الريف / تاريفيت',
      dico_chawi: '🟠 الشاوي / الشاوية',
      dico_moz: '🟢 المزابي / تومزابت',
      dico_nafusa: '🟣 النفوسة / ⵜⴰⵏⴰⴼⵓⵙⵉⵜ',
      // — تلميحات الأزرار —
      icon_web: '🔍 البحث في الويب',
      icon_izran: '🎬 إزران موسيقى الريف',
      icon_mazika: '🎵 موسيقى ريفية',
      icon_emoji: '💖 رموز تعبيرية',
      icon_add: '🧭 أسماء الله الـ99',
      icon_office: '🖨️ مكتبي',
      icon_jeux: '🎮 ألعاب',
      btn_lex: '📜 معجم الكلمات الأمازيغية',
      btn_kbd: 'فتح/إغلاق لوحة مفاتيح تيفيناغ',
      btn_fav: '⭐ عرض المفضلة',
      btn_reset: '🗑️ إعادة تعيين',
      // — نصوص ديناميكية (JS) —
      space_key: '␣ مسافة',
      transcribe_fail: 'تعذّر التحويل',
      no_result: 'لا توجد نتائج',
      no_result_for: 'لـ «',
      no_result_hint: 'غيّر المتغير (🌐) أو أعد صياغة الطلب.',
      results: 'نتيجة/نتائج',
      voir_plus: '⬇️ عرض المزيد ({n})',
      autres_sg: 'أخرى',
      autres_pl: 'أخرى',
      voir_moins: '⬆️ عرض أقل',
      entries: 'مدخلات',
      root: 'الجذر',
      bot: 'البوت',
      you: 'أنت',
      stt_unsupported: '🎤 غير مدعوم.',
      stt_listening: '🎙️ أنا أسمعك…',
      stt_error: '🎤 خطأ: ',
      stt_hint: 'اكتب أو 🎤 تحدث...',
      stt_start_fail: '🎤 تعذّر البدء.',
      tif_hindi: '🎤 تيفيناغ إلى الهندية 🇮🇳',
      tif_fr: '🎤 تيفيناغ إلى الفرنسية 🇫🇷',
      auto_tts: '🔊 القراءة التلقائية: {s}',
      offline_msg: '📴 أنت غير متصل.',
      gemini_offline_note: '📴 بديل Gemini غير متاح دون اتصال.',
      gemini_thinking: '✨ جيميناي يفكّر…',
      err_timeout: 'انتهاء المهلة ({n} ث)',
      not_understood: '🤔 لم أفهم. هل يمكنك إعادة الصياغة؟',
      gemini_unavailable: '⚠️ بديل Gemini غير متاح ({why}). تحقق من وظيفة Netlify ومتغير GEMINI_API_KEY.',
      fav_title: 'الرسائل المفضلة',
      no_favorites: 'لا توجد مفضلات',
      online: '🌐 متصل',
      offline_short: '📴 غير متصل'
    }
  };

  window.I18N_DICT = DICT;   // accessible pour débogage/extension

  // ── t(key, fallback) : traduction avec secours français ──
  function t(key, fallback) {
    var L = DICT[window.__lang] || {};
    var v = Object.prototype.hasOwnProperty.call(L, key) ? L[key] : undefined;
    if (v === undefined || v === null) v = (fallback !== undefined) ? fallback : key;
    return String(v);
  }
  window.t = window.t || t;

  // ── Langue de démarrage : préférence sauvegardée > détection > fr ──
  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem('chatmbr_lang'); } catch (e) {}
    if (saved && ORDER.indexOf(saved) !== -1) return saved;
    if (DEFAULT_LANG !== 'auto' && ORDER.indexOf(DEFAULT_LANG) !== -1) return DEFAULT_LANG;
    var nav = String(navigator.language || 'fr').toLowerCase();
    if (nav.indexOf('ar') === 0) return 'ar';
    if (nav.indexOf('en') === 0) return 'en';
    return 'fr';
  }

  // ── Applique la langue à toute l'interface ──
  window.applyI18n = function (lang) {
    if (ORDER.indexOf(lang) === -1) lang = 'fr';
    window.__lang = lang;
    try { localStorage.setItem('chatmbr_lang', lang); } catch (e) {}

    document.documentElement.lang = lang;
    document.documentElement.dir  = (lang === 'ar') ? 'rtl' : 'ltr';
    if (document.body) document.body.classList.toggle('rtl', lang === 'ar');

    var i, el, k, nodes;
    nodes = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i]; k = el.getAttribute('data-i18n');
      el.textContent = t(k, el.textContent);
    }
    nodes = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i]; k = el.getAttribute('data-i18n-html');
      el.innerHTML = t(k, el.innerHTML);
    }
    nodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i]; k = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(k, el.getAttribute('placeholder') || ''));
    }
    nodes = document.querySelectorAll('[data-i18n-title]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i]; k = el.getAttribute('data-i18n-title');
      el.setAttribute('title', t(k, el.getAttribute('title') || ''));
    }

    var lt = document.getElementById('langToggle');
    if (lt) lt.textContent = '🌐 ' + lang.toUpperCase();

    // Ré-affiche les libellés dynamiques déjà rendus par les autres scripts
    try { if (typeof window.updateTifTTSModeBtn === 'function') window.updateTifTTSModeBtn(); } catch (e) {}
    try { if (typeof window.updateSidebarTTSButton === 'function') window.updateSidebarTTSButton(); } catch (e) {}
    try { if (typeof window.updateOnlineStatus === 'function') window.updateOnlineStatus(); } catch (e) {}
  };

  // ── Bouton 🌐 : cycle FR → EN → AR ──
  window.cycleLang = function () {
    var cur = ORDER.indexOf(window.__lang || 'fr');
    if (cur === -1) cur = 0;
    window.applyI18n(ORDER[(cur + 1) % ORDER.length]);
  };

  // ── API directe : setLang('en') … ──
  window.setLang = function (lang) {
    if (ORDER.indexOf(lang) !== -1) window.applyI18n(lang);
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.applyI18n(detectLang());
  });
})();
