// ════════════════════════════════════════════════════════════════
//  clock-aero.js — Horloge Windows 7 Aero + Nuage date/heure
//  ───────────────────────────────────────────────────────────────
//  PATCH 9  : Horloge analogique (aiguilles + jour du mois)
//  PATCH 9b : Nuage blanc avec date complète + heure numérique
//  
//  Utilisation : <script src="clock-aero.js"></script>
//  (à placer APRÈS les éléments HTML de l'horloge)
// ════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ── Vérification que les éléments existent ──
  const clockEl = document.getElementById('aeroClock');
  if (!clockEl) {
    console.warn('⚠️ clock-aero.js : #aeroClock introuvable — script ignoré');
    return;
  }

  // ══════════════════════════════════════════════════════════════
  //  MISE À JOUR DE L'HORLOGE (toutes les 100ms = fluide)
  // ══════════════════════════════════════════════════════════════
  function updateAeroClock() {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    // ── Aiguilles analogiques (mouvement fluide) ──
    const hourAngle   = (h + m / 60) * 30;
    const minuteAngle = (m + s / 60) * 6;
    const secondAngle = (s + ms / 1000) * 6;

    const hEl = document.getElementById('clockHour');
    const mEl = document.getElementById('clockMinute');
    const sEl = document.getElementById('clockSecond');
    const dEl = document.getElementById('clockDate');

    if (hEl) hEl.style.transform = `rotate(${hourAngle}deg)`;
    if (mEl) mEl.style.transform = `rotate(${minuteAngle}deg)`;
    if (sEl) sEl.style.transform = `rotate(${secondAngle}deg)`;
    if (dEl) dEl.textContent = now.getDate();

    // ── PATCH 9b : date complète + heure numérique ──
    const dateFull = document.getElementById('clockDateFull');
    const timeDigital = document.getElementById('clockTimeDigital');

    if (dateFull) {
      let dateStr = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      // Première lettre en majuscule
      dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
      dateFull.textContent = dateStr;
    }

    if (timeDigital) {
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      timeDigital.textContent = `${hh}:${mm}:${ss}`;
    }
  }

  // ══════════════════════════════════════════════════════════════
  //  AFFICHER / MASQUER (horloge + nuage ensemble, mémorisé)
  // ══════════════════════════════════════════════════════════════
  function toggleAeroClock() {
    const clock = document.getElementById('aeroClock');
    const info = document.getElementById('clockInfo');
    if (!clock) return;
    const visible = clock.style.display !== 'none';
    clock.style.display = visible ? 'none' : 'block';
    if (info) info.style.display = visible ? 'none' : 'block';
    localStorage.setItem('aeroClock', visible ? 'hidden' : 'visible');
  }

  // Expose la fonction pour le onclick inline
  window.toggleAeroClock = toggleAeroClock;

  // ── Restaure la préférence au chargement ──
  function initAeroClock() {
    const pref = localStorage.getItem('aeroClock');
    if (pref === 'hidden') {
      const clock = document.getElementById('aeroClock');
      const info = document.getElementById('clockInfo');
      if (clock) clock.style.display = 'none';
      if (info) info.style.display = 'none';
    }
  }

  // ── Démarrage ──
  updateAeroClock();
  setInterval(updateAeroClock, 100);
  initAeroClock();

})();