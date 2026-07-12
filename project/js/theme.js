/* ============================================================
   theme.js — Dark/Light toggle with persistence
   ============================================================ */

(function () {
  const STORAGE_KEY = "kp-theme";
  const root = document.documentElement;

  function apply(theme) {
    root.setAttribute("data-theme", theme);
  }

  // Determine initial theme: saved > system preference > dark (default)
  function init() {
    let theme;
    try { theme = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!theme) {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      theme = prefersLight ? "light" : "dark";
    }
    apply(theme);
  }

  init();

  // Wait for DOM so the toggle button exists
  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      toggle.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  });

  // React to system theme changes if user hasn't set a preference
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
    let saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) {}
    if (!saved) apply(e.matches ? "light" : "dark");
  });
})();
