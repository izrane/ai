/* ============================================================
   🌙 theme.js — Gestion du thème clair/sombre (partagé)
   À inclure dans le <head> de TOUTES les pages
   ============================================================ */

// Applique le thème AVANT l'affichage (évite le flash blanc)
(function () {
  const saved = localStorage.getItem('theme');
  const dark = saved ? saved === 'dark'
                    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) document.documentElement.setAttribute('data-theme', 'dark');
})();

// Configuration du bouton une fois la page chargée
document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
  }

  // Icône correcte au chargement
  applyTheme(htmlEl.getAttribute('data-theme') || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }
});
