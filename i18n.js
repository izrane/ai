/* ============================================================= */
/*  IZRAN AI - SYSTÈME i18n FR/AR                                */
/*  Ajoute une interface arabe sans supprimer le code initial    */
/*  (le français reste la langue par défaut)                     */
/* ============================================================= */
(function () {
    'use strict';

    // ===== TABLE DES TRADUCTIONS FR → AR =====
    const AR = {
        // Bouton de langue
        lang_btn_title_to_ar: 'التبديل إلى العربية',
        lang_btn_title_to_fr: 'العودة إلى الفرنسية',

        // Header du chat
        header_title: 'ChatMBR آي',
        header_status: 'تمازيغت',
        header_home: 'الرئيسية',
        header_mic: 'إملاء صوتي (FR/تمازيغت)',

        // Sidebar gauche
        sb_open_title: 'القائمة والنوافذ',
        sb_menu: '☰ القائمة',
        sb_close: 'إغلاق',
        sb_section_tools: 'أدوات ونوافذ',
        sb_section_info: 'معلومات',

        sb_web_title: 'بحث في الويب',
        sb_web_sub: 'البحث على الإنترنت',
        sb_tsawer_title: 'تساور-آي 4K',
        sb_tsawer_sub: 'توليد الصور',
        sb_radio_title: 'راديو',
        sb_radio_sub: 'موسيقى عبر الإنترنت',
        sb_melody_title: 'ميلودي إينو',
        sb_melody_sub: 'مكتبة الفيديو والوسائط',
        sb_code_title: 'كود و embedding',
        sb_code_sub: 'ابدأ البرمجة',
        sb_jeux_title: 'ألعاب',
        sb_jeux_sub: 'ألعاب وأكثر',
        sb_about_title: 'حول التطبيق',
        sb_about_sub: 'معلومات عن ChatMBR آي',
        sb_footer_title: 'تذييل الصفحة',
        sb_footer_sub: 'حقوق النسخ 2027 cc0',
        sb_fav_lex_title: 'المفضلة والمعجم',
        sb_fav_lex_sub: 'تصفح المسرد والمفضلة',

        // Modale "À propos"
        about_title: 'ℹ️ حول إزران آي',
        about_close: 'إغلاق',
        about_body_html: '<strong>إزران آي</strong> هو وكيل ذكي لتمازيغت (الريف، الشاوي، المزاب، نفوسة) يعمل دون اتصال بالإنترنت.',

        // Slider (panneau coulissant)
        sl_open_title: 'المفضلة والمعجم',
        sl_header: '📚 المعجم والمفضلة',
        sl_tab_fav: '⭐ المفضلة',
        sl_tab_lex: '📖 المعجم',

        // Champ de saisie du chat
        chat_input_ph: 'اكتب كلمة (لاتيني أو تيفيناغ)...',

        // Modale iframe
        iframe_default_title: 'أداة',

        // === Titres spécifiques des modales iframe (data-title des boutons) ===
        // Sidebar gauche
        iframe_title_web_search: '🔍 بحث في الويب',
        iframe_title_tsawer: '🎨 تساور-آي 4K',
        iframe_title_radio: '🎵 راديو',
        iframe_title_melody: '🎬 ميلودي إينو',
        iframe_title_code: '🛠️ كود الذكاء الاصطناعي',
        iframe_title_jeux: '🎮 ألعاب عبر الإنترنت',
        // Barre d'icônes du header (table)
        iframe_title_quran: '🕌 القرآن الكريم',
        iframe_title_allah: '💖 أسماء الله الحسنى 99',
        iframe_title_adhkar: '📅 أذكار الصباح والمساء',
        iframe_title_map: '🗺️ خريطة',
        iframe_title_office: '🖨️ مكتبتي',
        iframe_title_hinbox: '🦉 بريد فيديو - مؤتمر',
        iframe_title_email: '📧 بريد إلكتروني',
        iframe_title_social: '🌍 ⴰⵎⴰⵣⵉⵖ اجتماعي',
        iframe_title_emoji: '🤡 رموز تعبيرية',
        iframe_title_tchat: '💬 دردشة',

        // Footer popup
        footer_btn_title: 'إظهار تذييل الصفحة',

        // === Contenus dynamiques (messages du bot, états vides, etc.) ===
        bot_loading: '⏳ تحميل القاموس... (وضع غير متصل)',
        bot_loading_worker_offline: 'تحميل القاموس... (عامل غير متصل)',

        bot_welcome_1: 'أزول! 👋 أنا إزران آي، المترجم المحلي لتمازيغت.',
        bot_welcome_worker_active: '✅ العامل غير المتصل نشط',
        bot_welcome_loaded: 'كلمة محملة',
        bot_welcome_offline: '⚡ وضع عدم الاتصال',
        bot_welcome_pwa: '📱 PWA جاهز للتثبيت',
        bot_welcome_fav: '⭐ أضف كلمات للمفضلة من الاقتراحات',
        bot_welcome_mic: '🎤 انقر على الميكروفون للإملاء بالفرنسية',
        bot_welcome_start: 'ابدأ بالكتابة لرؤية الاقتراحات أو اسأل: *كيف نقول شمس؟*',
        bot_welcome_tifinagh: '✍️ يمكنك أيضاً الكتابة بالتيفيناغ (ⵜⴰⵎⴰⵣⵉⵖⵜ)!',
        bot_welcome_id_prefix: '(ID:',

        bot_greeting: 'أزول! 👋 أنا إزران آي، المترجم المحلي لتمازيغت.\n\n🔍 اكتب كلمة أو جملة بالفرنسية أو اللاتينية أو التيفيناغ.\n⭐ استخدم اللوحة للمفضلة.\n🎤 انقر على الميكروفون للإملاء.',

        bot_translate_label: '🔁 الترجبة:',
        bot_suggestions_label: '💡 اقتراحات:',
        bot_cannot_translate: '🤔 لم أستطع ترجمة كل شيء.',
        bot_understood: '📝 هذا ما فهمته:',
        bot_simplify: '💡 حاول تبسيط الجملة أو راجع المعجم 📚.',
        bot_tip_fav: '💡 نصيحة: اكتب "favoris" لرؤية كلماتك المفضلة.',

        bot_fav_title: '⭐ المفضلة',
        bot_fav_empty: 'لا توجد مفضلات بعد.',
        bot_fav_add_tip: '💡 أضف كلمات للمفضلة بالنقر على النجمة ⭐ في الاقتراحات أو المعجم.',
        bot_fav_count_label: 'كلماتك المفضلة',
        bot_fav_other: 'أخرى',

        bot_lexique_title: '📖 معجم إزران آي',
        bot_lexique_count: 'كلمة متوفرة في القاموس.',
        bot_lexique_tip: '💡 افتح اللوحة 📚 لتصفح كل المعجم وإضافة كلمات للمفضلة.',

        bot_pwa_title: '📱 إزران آي - تطبيق ويب تقدمي',
        bot_pwa_ready: '✅ التطبيق جاهز للتثبيت على جهازك.',
        bot_pwa_install_title: '📌 كيفية التثبيت؟',
        bot_pwa_install_mobile: '• على الهاتف (أندرويد/Chrome): انقر على "إضافة إلى الشاشة الرئيسية"',
        bot_pwa_install_iphone: '• على iPhone (Safari): استخدم "إضافة إلى الشاشة الرئيسية"',
        bot_pwa_install_desktop: '• على الحاسوب: انقر على أيقونة التثبيت',
        bot_pwa_after: '⭐ بعد التثبيت، يمكنك استخدام التطبيق دون اتصال وإدارة مفضلاتك!',

        bot_stats_title: '📊 إحصائيات إزران آي',
        bot_stats_wid: '🤖 معرّف العامل:',
        bot_stats_loaded: '📚 الكلمات المحملة:',
        bot_stats_fav: '⭐ المفضلة:',
        bot_stats_mode: '⚡ الوضع:',
        bot_stats_state: '✅ الحالة:',
        bot_stats_ready: 'جاهز ✅',
        bot_stats_loading: 'في التحمل ⏳',
        bot_stats_tip: '💡 اكتب "favoris" أو "lexique" لمزيد من المعلومات.',

        // Boutons d'action sous les messages
        action_listen: 'استمع',
        action_share: 'مشاركة',

        // États vides
        empty_fav_title: 'لا توجد مفضلات بعد.',
        empty_fav_sub: 'أضف كلمات من الاقتراحات أو نتائج البحث.',
        empty_lex_title: 'لا توجد كلمات.',

        // Lexique
        lex_filter_ph: 'تصفية المعجم...',
        lex_count_suffix: ' كلمة',
        lex_more_format: '+',

        // Footer popup labels
        footer_brand: 'ⵥ إزران آي',
        footer_brand_sub: 'أدوات تمازيغت الرقمية',
        footer_brand_tag: 'استكشف الذكاء الاصطناعي والفن وتمازيغت',
        footer_quick_links: 'روابط سريعة',
        footer_our_code: 'كودنا',
        footer_home: '🏠 الرئيسية',
        footer_web: '🔍 ويب',
        footer_art: '🎨 فن',
        footer_radio: '🎵 راديو',
        footer_app: '⬇️ التطبيق',
        footer_melo: '🎬 ميلو',
        footer_social: '📤 اجتماعي',
        footer_copyright: '© ChatMBR آي — بُني بـ ❤️ لتمازيغت',
        footer_version: 'v20.0 · مفتوح المصدر',

        // Alertes
        stt_alert_browser: 'التعرف الصوتي غير مدعوم في متصفحك. يرجى استخدام Chrome أو Edge.',
        stt_alert_mic: 'يرجى السماح بالوصول إلى الميكروفون لاستخدام الإملاء الصوتي.',
        share_copied: 'تم نسخ الترجبة!',
        share_unsupported: 'المشاركة غير مدعومة.',
        share_title: 'إزران آي - ترجمة'
    };

    // ===== MAP RUNTIME FR → AR POUR LES TITRES IFRAME =====
    // Utilisée par translateIframeTitle() pour traduire les titres passés
    // dynamiquement à openIframeModal(url, title) au moment du clic.
    // Les clés doivent correspondre EXACTEMENT aux chaînes passées en paramètre
    // (qu'elles proviennent de onclick=..., de data-title, etc.)
    const IFRAME_TITLES_AR = {
        // Sidebar gauche (onclick direct)
        '🔍 Web Search': '🔍 بحث في الويب',
        'Web Search': '🔍 بحث في الويب',
        '🎨 Tsawer-Ai 4K': '🎨 تساور-آي 4K',
        'Tsawer-Ai 4K': '🎨 تساور-آي 4K',
        '🎵 Radio': '🎵 راديو',
        'Radio': '🎵 راديو',
        '🎬 Melody ino': '🎬 ميلودي إينو',
        'Melody ino': '🎬 ميلودي إينو',
        '🛠️ Ai code Fabor': '🛠️ كود الذكاء الاصطناعي',
        'Ai code Fabor': '🛠️ كود الذكاء الاصطناعي',
        '🎮 Jeux en ligne': '🎮 ألعاب عبر الإنترنت',
        'Jeux en ligne': '🎮 ألعاب عبر الإنترنت',

        // Barre d'icônes du header (data-title)
        '🕌 Quran Kareem': '🕌 القرآن الكريم',
        'Quran Kareem': '🕌 القرآن الكريم',
        'Quran': '🕌 القرآن الكريم',
        '🕌 Quran': '🕌 القرآن الكريم',
        '💖 99 Allah Names': '💖 أسماء الله الحسنى 99',
        '99 Allah Names': '💖 أسماء الله الحسنى 99',
        '💖 Allah': '💖 أسماء الله الحسنى 99',
        'Allah': '💖 أسماء الله الحسنى 99',
        '📅  أذكار الصباح والمسا': '📅 أذكار الصباح والمساء',
        'أذكار الصباح والمسا': '📅 أذكار الصباح والمساء',
        '📅  أذكار': '📅 أذكار الصباح والمساء',
        'أذكار': '📅 أذكار الصباح والمساء',
        '🗺️ Map': '🗺️ خريطة',
        'Map': '🗺️ خريطة',
        '🖨️ My Office': '🖨️ مكتبتي',
        'My Office': '🖨️ مكتبتي',
        '🖨️ Office': '🖨️ مكتبتي',
        'Office': '🖨️ مكتبتي',
        '🦉 H-inbox Vidéo conférance': '🦉 بريد فيديو - مؤتمر',
        'H-inbox Vidéo conférance': '🦉 بريد فيديو - مؤتمر',
        '🦉 H-inbox Vidéo Join Metting': '🦉 بريد فيديو - اجتماع',
        'H-inbox Vidéo Join Metting': '🦉 بريد فيديو - اجتماع',
        '🦉 H-inbox': '🦉 بريد فيديو - مؤتمر',
        'H-inbox': '🦉 بريد فيديو - مؤتمر',
        '📧 é-Mai': '📧 بريد إلكتروني',
        'é-Mai': '📧 بريد إلكتروني',
        '📧 é-Mail': '📧 بريد إلكتروني',
        'é-Mail': '📧 بريد إلكتروني',
        '🌍 ⴰⵎⴰⵣⵉⵖ Social': '🌍 ⴰⵎⴰⵣⵉⵖ اجتماعي',
        '🌍Social': '🌍 ⴰⵎⴰⵣⵉⵖ اجتماعي',
        'ⴰⵎⴰⵣⵉⵖ Social': '🌍 ⴰⵎⴰⵣⵉⵖ اجتماعي',
        'Social': '🌍 ⴰⵎⴰⵣⵉⵖ اجتماعي',
        '🤡 emoji': '🤡 رموز تعبيرية',
        'emoji': '🤡 رموز تعبيرية',
        '💬 Tchat': '💬 دردشة',
        'Tchat': '💬 دردشة',

        // Titre par défaut
        'Outil': 'أداة'
    };

    // ===== Traduit un titre de modale iframe FR → AR =====
    // 1. Cherche une correspondance exacte
    // 2. Cherche après trim
    // 3. Cherche par inclusion (si le titre contient un motif connu)
    function translateIframeTitle(title) {
        if (!title) return title;
        // 1. Match exact
        if (IFRAME_TITLES_AR[title]) return IFRAME_TITLES_AR[title];
        // 2. Trim
        const trimmed = title.trim();
        if (IFRAME_TITLES_AR[trimmed]) return IFRAME_TITLES_AR[trimmed];
        // 3. Inclusion (remplace la 1ère occurrence trouvée)
        let result = title;
        let changed = false;
        for (const fr in IFRAME_TITLES_AR) {
            if (Object.prototype.hasOwnProperty.call(IFRAME_TITLES_AR, fr)) {
                if (title.indexOf(fr) !== -1) {
                    result = result.replace(fr, IFRAME_TITLES_AR[fr]);
                    changed = true;
                    break; // Une seule substitution pour éviter les cascades
                }
            }
        }
        return changed ? result : title;
    }

    // ===== Wrapper de openIframeModal =====
    // Intercepte les appels pour traduire le titre quand l'arabe est actif
    function wrapOpenIframeModal() {
        if (window.__i18nIframeWrapped) return; // déjà wrappé
        if (typeof window.openIframeModal !== 'function') {
            // Réessayer plus tard (le script principal peut ne pas être encore chargé)
            setTimeout(wrapOpenIframeModal, 200);
            return;
        }
        const original = window.openIframeModal;
        window.__i18nIframeWrapped = true;
        window.openIframeModal = function (url, title) {
            try {
                const isAr = document.documentElement.getAttribute('lang') === 'ar';
                if (isAr && title) {
                    title = translateIframeTitle(title);
                }
            } catch (e) { /* ignorer */ }
            return original.call(this, url, title);
        };
    }

    // ===== MutationObserver sur #iframeTitle comme filet de sécurité =====
    // Si jamais le titre est modifié directement (innerText) sans passer
    // par openIframeModal, on le traduit quand même.
    let iframeTitleObserver = null;
    let iframeTitleGuard = false; // évite les boucles
    function startIframeTitleObserver() {
        if (iframeTitleObserver) return;
        const titleEl = document.getElementById('iframeTitle');
        if (!titleEl) {
            setTimeout(startIframeTitleObserver, 300);
            return;
        }
        iframeTitleObserver = new MutationObserver(function () {
            if (iframeTitleGuard) return;
            if (document.documentElement.getAttribute('lang') !== 'ar') return;
            const current = titleEl.textContent || '';
            const translated = translateIframeTitle(current);
            if (translated !== current) {
                iframeTitleGuard = true;
                try { titleEl.textContent = translated; }
                catch (e) { /* ignorer */ }
                finally { iframeTitleGuard = false; }
            }
        });
        iframeTitleObserver.observe(titleEl, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    // ===== Applique les traductions sur les éléments statiques =====
    function applyStaticTranslations() {
        // Text content (innerHTML) pour [data-i18n]
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (AR[key] === undefined) return;
            // Sauvegarder l'original (FR) pour restauration ultérieure
            if (!el.hasAttribute('data-i18n-original')) {
                el.setAttribute('data-i18n-original', el.innerHTML);
            }
            el.innerHTML = AR[key];
        });
        // Attributs title pour [data-i18n-title]
        document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-title');
            if (AR[key] === undefined) return;
            if (!el.hasAttribute('data-i18n-title-original')) {
                el.setAttribute('data-i18n-title-original', el.getAttribute('title') || '');
            }
            el.setAttribute('title', AR[key]);
        });
        // Attributs placeholder pour [data-i18n-ph]
        document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-ph');
            if (AR[key] === undefined) return;
            if (!el.hasAttribute('data-i18n-ph-original')) {
                el.setAttribute('data-i18n-ph-original', el.getAttribute('placeholder') || '');
            }
            el.setAttribute('placeholder', AR[key]);
        });
    }

    // ===== Restaure les textes originaux (FR) =====
    function restoreStaticTranslations() {
        document.querySelectorAll('[data-i18n-original]').forEach(function (el) {
            el.innerHTML = el.getAttribute('data-i18n-original');
        });
        document.querySelectorAll('[data-i18n-title-original]').forEach(function (el) {
            el.setAttribute('title', el.getAttribute('data-i18n-title-original'));
        });
        document.querySelectorAll('[data-i18n-ph-original]').forEach(function (el) {
            el.setAttribute('placeholder', el.getAttribute('data-i18n-ph-original'));
        });
    }

    // ===== Traduit les contenus dynamiques (messages du bot, états vides, etc.) =====
    function applyDynamicTranslation(node) {
        if (!node || node.nodeType !== 1) return;

        // Boutons "Écouter" / "Partager" sous les messages
        (node.querySelectorAll ? node.querySelectorAll('.action-btn') : []).forEach(function (btn) {
            if (btn.getAttribute('data-i18n-applied') === '1') return;
            const html = btn.innerHTML;
            if (html.indexOf('Écouter') !== -1) {
                btn.innerHTML = html.replace('Écouter', AR.action_listen);
                btn.setAttribute('data-i18n-applied', '1');
            } else if (html.indexOf('Partager') !== -1) {
                btn.innerHTML = html.replace('Partager', AR.action_share);
                btn.setAttribute('data-i18n-applied', '1');
            }
        });

        // État vide : favoris
        (node.querySelectorAll ? node.querySelectorAll('.empty-state p, .empty-state .icon') : []).forEach(function (p) {
            const t = (p.textContent || '').trim();
            if (t === "Aucun favori pour l'instant.") p.textContent = AR.empty_fav_title;
            else if (t.indexOf('Ajoutez des mots depuis les suggestions') === 0) p.textContent = AR.empty_fav_sub;
            else if (t === 'Aucun mot trouvé.') p.textContent = AR.empty_lex_title;
        });

        // Champ de filtrage du lexique
        (node.querySelectorAll ? node.querySelectorAll('#lexiqueSearch') : []).forEach(function (inp) {
            inp.setAttribute('placeholder', AR.lex_filter_ph);
        });

        // Compteur du lexique "N mots"
        (node.querySelectorAll ? node.querySelectorAll('#lexiqueCount') : []).forEach(function (span) {
            const m = span.textContent.match(/(\d+)\s*mots?/);
            if (m) span.textContent = m[1] + AR.lex_count_suffix;
        });

        // "+ N mots supplémentaires"
        (node.querySelectorAll ? node.querySelectorAll('p') : []).forEach(function (p) {
            const m = p.textContent.match(/^\+\s*(\d+)\s*mots supplémentaires/);
            if (m) p.textContent = AR.lex_more_format + m[1] + ' ' + AR.bot_fav_other;
        });

        // Messages du bot (welcome, greeting, stats, etc.)
        (node.querySelectorAll ? node.querySelectorAll('.message.bot') : []).forEach(function (msgDiv) {
            if (msgDiv.getAttribute('data-i18n-applied') === '1') return;
            let html = msgDiv.innerHTML;
            let newHtml = html;
            // Welcome message
            newHtml = newHtml.replace(
                'Azul ! 👋 Je suis Izran AI, traducteur local Tamazight.',
                AR.bot_welcome_1
            );
            newHtml = newHtml.replace('Worker offline actif', AR.bot_welcome_worker_active);
            newHtml = newHtml.replace('mots chargés', AR.bot_welcome_loaded);
            newHtml = newHtml.replace('Mode hors-ligne', AR.bot_welcome_offline);
            newHtml = newHtml.replace('PWA prêt à être installé', AR.bot_welcome_pwa);
            newHtml = newHtml.replace('Ajoutez des mots aux favoris depuis les suggestions', AR.bot_welcome_fav);
            newHtml = newHtml.replace('Cliquez sur le micro pour dicter en français', AR.bot_welcome_mic);
            newHtml = newHtml.replace(
                'Commencez à taper pour voir les suggestions ou demandez : *Comment on dit soleil ?*',
                AR.bot_welcome_start
            );
            newHtml = newHtml.replace(
                'Vous pouvez aussi taper en Tifinagh (ⵜⴰⵎⴰⵣⵉⵖⵜ) !',
                AR.bot_welcome_tifinagh
            );
            // Loading message
            newHtml = newHtml.replace(
                /Chargement du dictionnaire\.\.\.\s*\(Worker offline\)/g,
                AR.bot_loading_worker_offline
            );
            // Greeting
            newHtml = newHtml.replace(
                /Azul ! 👋 Je suis Izran AI, traducteur local Tamazight\.[\s\S]*?dicter\./,
                AR.bot_greeting
            );
            // Translate label
            newHtml = newHtml.replace('🔁 **Traduction** :', '🔁 **' + AR.bot_translate_label.replace(' 🔁', '') + '** :');
            newHtml = newHtml.replace('💡 **Suggestions** :', '💡 **اقتراحات** :');
            newHtml = newHtml.replace('🤔 Je n\'ai pas pu tout traduire.', AR.bot_cannot_translate);
            newHtml = newHtml.replace('📝 Voici ce que j\'ai compris :', AR.bot_understood);
            newHtml = newHtml.replace('💡 Essayez de simplifier la phrase ou consultez le lexique 📚.', AR.bot_simplify);
            newHtml = newHtml.replace('💡 Astuce : tapez "favoris" pour voir vos mots préférés.', AR.bot_tip_fav);
            // Favorites
            newHtml = newHtml.replace('⭐ **Favoris**', '⭐ **المفضلة**');
            newHtml = newHtml.replace("Vous n'avez pas encore de favoris.", AR.bot_fav_empty);
            newHtml = newHtml.replace('Ajoutez des mots aux favoris en cliquant sur l\'étoile ⭐ dans les suggestions ou dans le lexique.', AR.bot_fav_add_tip);
            newHtml = newHtml.replace('**Vos favoris**', '**' + AR.bot_fav_count_label + '**');
            newHtml = newHtml.replace(/(\d+)\s*mot(?:s)?\s*\)/, function (_, n) { return n + ' كلمة)'; });
            newHtml = newHtml.replace('+ ', '+ ').replace(/(\d+)\s*autr(?:e|es)/, function (_, n) { return n + ' ' + AR.bot_fav_other; });
            newHtml = newHtml.replace('📖 Ouvrez le panneau ⭐ pour voir tous vos favoris.', '📖 افتح اللوحة ⭐ لرؤية كل مفضلاتك.');
            // Lexique
            newHtml = newHtml.replace('📖 **Lexique Izran AI**', '📖 **معجم**');
            newHtml = newHtml.replace('mots disponibles dans le dictionnaire.', AR.bot_lexique_count);
            newHtml = newHtml.replace('💡 Ouvrez le panneau 📚 pour parcourir tout le lexique et ajouter des mots aux favoris.', AR.bot_lexique_tip);
            // PWA
            newHtml = newHtml.replace('📱 **Izran AI - Progressive Web App**', '📱 **إزران آي - تطبيق ويب تقدمي**');
            newHtml = newHtml.replace("L'application est prête à être installée sur votre appareil.", AR.bot_pwa_ready);
            newHtml = newHtml.replace('**Comment installer ?**', '**' + AR.bot_pwa_install_title.replace('📌 ', '') + '**');
            newHtml = newHtml.replace("• Sur mobile (Android/Chrome) : Tapez sur \"Ajouter à l'écran d'accueil\"", AR.bot_pwa_install_mobile);
            newHtml = newHtml.replace("• Sur iPhone (Safari) : Utilisez \"Ajouter à l'écran d'accueil\"", AR.bot_pwa_install_iphone);
            newHtml = newHtml.replace("• Sur ordinateur : Cliquez sur l'icône d'installation", AR.bot_pwa_install_desktop);
            newHtml = newHtml.replace('Une fois installée, vous pouvez utiliser l\'application hors-ligne et gérer vos favoris !', AR.bot_pwa_after);
            // Stats
            newHtml = newHtml.replace('📊 **Statistiques Izran AI**', '📊 **إحصائيات إزران آي**');
            newHtml = newHtml.replace('🤖 Worker ID:', AR.bot_stats_wid);
            newHtml = newHtml.replace('📚 Mots chargés:', AR.bot_stats_loaded);
            newHtml = newHtml.replace('⭐ Favoris:', AR.bot_stats_fav);
            newHtml = newHtml.replace('⚡ Mode:', AR.bot_stats_mode);
            newHtml = newHtml.replace('✅ État:', AR.bot_stats_state);
            newHtml = newHtml.replace('Prêt ✅', AR.bot_stats_ready);
            newHtml = newHtml.replace('En chargement ⏳', AR.bot_stats_loading);
            newHtml = newHtml.replace('💡 Tapez "favoris" ou "lexique" pour plus d\'infos.', AR.bot_stats_tip);

            if (newHtml !== html) {
                msgDiv.innerHTML = newHtml;
                msgDiv.setAttribute('data-i18n-applied', '1');
            }
        });

        // Footer popup brand/links
        (node.querySelectorAll ? node.querySelectorAll('#footerPopup .site-footer h3, #footerPopup .site-footer h4') : []).forEach(function (h) {
            const t = (h.textContent || '').trim();
            if (t.indexOf('ⵥ Izran AI') === 0) h.textContent = AR.footer_brand;
            else if (t === 'Quick Links') h.textContent = AR.footer_quick_links;
            else if (t === 'Our Code') h.textContent = AR.footer_our_code;
        });
        (node.querySelectorAll ? node.querySelectorAll('#footerPopup .site-footer p') : []).forEach(function (p) {
            const t = (p.textContent || '').trim();
            if (t === 'Tamazight Digital Toolkit') p.textContent = AR.footer_brand_sub;
            else if (t === 'Explore AI, Art & Thamazight') p.textContent = AR.footer_brand_tag;
        });
        (node.querySelectorAll ? node.querySelectorAll('#footerPopup .site-footer span.tagline') : []).forEach(function (s) {
            s.textContent = AR.footer_brand_tag;
        });
        (node.querySelectorAll ? node.querySelectorAll('#footerPopup .site-footer a') : []).forEach(function (a) {
            const t = (a.textContent || '').trim();
            if (t === '🏠 Accueil') a.textContent = AR.footer_home;
            else if (t === '🔍 Web') a.textContent = AR.footer_web;
            else if (t === '🎨 Art') a.textContent = AR.footer_art;
            else if (t === '🎵 Radio') a.textContent = AR.footer_radio;
            else if (t === '⬇️ App') a.textContent = AR.footer_app;
            else if (t === '🎬 Mélo') a.textContent = AR.footer_melo;
            else if (t === '📤Social') a.textContent = AR.footer_social;
        });
        // Footer bottom
        (node.querySelectorAll ? node.querySelectorAll('#footerPopup .footer-bottom p') : []).forEach(function (p) {
            const t = (p.textContent || '').trim();
            if (t.indexOf('©') === 0 && t.indexOf('ChatMBR') !== -1) {
                p.textContent = AR.footer_copyright + ' ' + new Date().getFullYear();
            } else if (t === 'v20.0 · Open Source') {
                p.textContent = AR.footer_version;
            }
        });
    }

    // ===== Observer pour les contenus dynamiques (mode AR actif) =====
    let dynamicObserver = null;
    function startDynamicObserver() {
        if (dynamicObserver) return;
        dynamicObserver = new MutationObserver(function (mutations) {
            if (document.documentElement.getAttribute('lang') !== 'ar') return;
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (n) {
                    applyDynamicTranslation(n);
                });
            });
        });
        dynamicObserver.observe(document.body, { childList: true, subtree: true });
    }

    // ===== Active la langue =====
    function setLanguage(lang) {
        const html = document.documentElement;
        if (lang === 'ar') {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            applyStaticTranslations();
            applyDynamicTranslation(document.body);
            startDynamicObserver();
        } else {
            // FR : restaurer les textes originaux
            html.setAttribute('lang', 'fr');
            html.removeAttribute('dir');
            restoreStaticTranslations();
            // Les messages dynamiques déjà traduits restent en AR
            // (l'utilisateur peut recharger la page pour les repasser en FR)
            // On marque les messages comme non-traduits pour re-traduction ultérieure
            document.querySelectorAll('.message.bot[data-i18n-applied="1"]').forEach(function (el) {
                el.removeAttribute('data-i18n-applied');
            });
            document.querySelectorAll('.action-btn[data-i18n-applied="1"]').forEach(function (el) {
                el.removeAttribute('data-i18n-applied');
            });
        }
        try { localStorage.setItem('izran-lang', lang); } catch (e) {}
        updateLangButton(lang);
    }

    function updateLangButton(lang) {
        const btn = document.getElementById('langToggleBtn');
        if (!btn) return;
        if (lang === 'ar') {
            btn.textContent = 'FR';
            btn.setAttribute('title', AR.lang_btn_title_to_fr);
        } else {
            btn.textContent = 'ع';
            btn.setAttribute('title', 'التبديل إلى العربية / Passer à l\'arabe');
        }
    }

    function toggleLanguage() {
        const current = document.documentElement.getAttribute('lang') || 'fr';
        const next = (current === 'ar') ? 'fr' : 'ar';
        setLanguage(next);
    }

    // Exposer globalement
    window.toggleLanguage = toggleLanguage;
    window.setLanguage = setLanguage;
    window.translateIframeTitle = translateIframeTitle;
    window.__izranI18n = {
        AR: AR,
        IFRAME_TITLES_AR: IFRAME_TITLES_AR,
        applyDynamicTranslation: applyDynamicTranslation,
        translateIframeTitle: translateIframeTitle
    };

    // ===== Auto-init au chargement =====
    function initI18n() {
        let saved = 'fr';
        try { saved = localStorage.getItem('izran-lang') || 'fr'; } catch (e) {}
        updateLangButton(saved);

        // Wrapper openIframeModal pour traduire dynamiquement les titres
        wrapOpenIframeModal();
        // Observer #iframeTitle comme filet de sécurité
        startIframeTitleObserver();

        if (saved === 'ar') {
            // Léger délai pour s'assurer que le DOM et les messages sont en place
            setTimeout(function () { setLanguage('ar'); }, 300);
            // Deuxième passe pour les messages du bot qui arrivent après chargement du dico
            setTimeout(function () { applyDynamicTranslation(document.body); }, 2500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();
