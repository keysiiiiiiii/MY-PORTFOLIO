/**
 * resume.js — Resume Page Renderer
 * ─────────────────────────────────────────────────────────────
 * Reads window.RESUME_CONFIG (from resume-config.js) and
 * window.profileConfig (from profile-config.js) to build
 * the entire resume page UI.
 *
 * Zero hardcoded content here — all text, paths, and metadata
 * come from the config files.
 *
 * Public API: window.Resume
 *   Resume.init()        — called automatically on DOMContentLoaded
 *   Resume.reload()      — re-initialise (useful for future admin UI)
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  /* ── Helpers ───────────────────────────────────────────── */

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(isoDate) {
    if (!isoDate) return null;
    try {
      const d = new Date(isoDate + "T00:00:00");
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch { return isoDate; }
  }

  /* ── Meta bar (version + last-updated badges) ──────────── */

  function renderMetaBar(config, container) {
    if (!config.version && !config.updatedAt) return;
    const updated = formatDate(config.updatedAt);
    container.innerHTML = `
      <div class="resume-meta-bar" role="status" aria-live="polite">
        ${config.version
          ? `<span class="resume-badge resume-badge-version">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                 <polyline points="14 2 14 8 20 8"/>
               </svg>
               ${esc(config.version)}
             </span>`
          : ""}
        ${updated
          ? `<span class="resume-badge resume-badge-updated">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                 <circle cx="12" cy="12" r="10"/>
                 <polyline points="12 6 12 12 16 14"/>
               </svg>
               Last updated ${esc(updated)}
             </span>`
          : ""}
      </div>`;
  }

  /* ── Action toolbar ────────────────────────────────────── */

  function renderToolbar(config, hasFile, container) {
    const dlAttr  = hasFile ? `href="${esc(config.file)}" download="${esc(config.displayName)}"` : `href="#" aria-disabled="true" tabindex="-1"`;
    const openAttr = hasFile ? `href="${esc(config.file)}" target="_blank" rel="noopener noreferrer"` : `href="#" aria-disabled="true" tabindex="-1"`;
    const disabledClass = hasFile ? "" : " btn-disabled";

    container.innerHTML = `
      <div class="resume-toolbar" role="toolbar" aria-label="Resume actions">
        <a class="btn btn-primary${disabledClass}" ${dlAttr} id="resumeDownloadBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF
        </a>
        <a class="btn btn-ghost${disabledClass}" ${openAttr} id="resumeOpenBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Open in new tab
        </a>
      </div>`;
  }

  /* ── Placeholder ───────────────────────────────────────── */

  function renderPlaceholder(config, frame) {
    const ph = config.placeholder || {};
    const heading = ph.heading || "Resume coming soon.";
    const body    = ph.body    || "Check back soon.";
    const hint    = ph.hint    || "";

    frame.innerHTML = `
      <div class="resume-placeholder" role="status">
        <div class="resume-placeholder-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="16" y2="17"/>
          </svg>
        </div>
        <h3 class="resume-placeholder-heading">${esc(heading)}</h3>
        <p class="resume-placeholder-body">${esc(body)}</p>
        ${hint ? `<p class="resume-placeholder-hint"><code>${esc(hint)}</code></p>` : ""}
        <div class="resume-placeholder-actions">
          <a class="btn btn-ghost" href="contact.html">Get in touch instead</a>
        </div>
      </div>`;
  }

  /* ── PDF embed ─────────────────────────────────────────── */

  function renderEmbed(config, frame) {
    const src = config.showToolbar
      ? `${esc(config.file)}#toolbar=1&navpanes=0&scrollbar=1`
      : `${esc(config.file)}#toolbar=0&navpanes=0`;

    // Primary: <embed> — works in Chrome, Firefox, Safari
    // Fallback inner link for browsers that block PDF embeds
    frame.innerHTML = `
      <div class="resume-embed-wrap">
        <embed
          src="${src}"
          type="application/pdf"
          class="resume-embed"
          aria-label="Resume PDF preview"
          title="King Cedrick Plupenio — Resume">
        <div class="resume-embed-fallback" aria-hidden="false" role="alert">
          <p>Your browser doesn't support inline PDF preview.</p>
          <a class="btn btn-primary" href="${esc(config.file)}" download="${esc(config.displayName)}">Download PDF instead</a>
        </div>
      </div>`;
  }

  /* ── Probe then render ─────────────────────────────────── */

  function probe(url, onSuccess, onFail) {
    // file: protocol (local dev without a server) → always show embed
    if (window.location.protocol === "file:") { onSuccess(); return; }

    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true);
    xhr.timeout = 5000;
    xhr.onload = function () {
      (xhr.status >= 200 && xhr.status < 400) ? onSuccess() : onFail();
    };
    xhr.onerror   = onFail;
    xhr.ontimeout = onFail;
    try { xhr.send(); } catch (e) { onFail(); }
  }

  /* ── Main init ─────────────────────────────────────────── */

  function init() {
    const config = window.RESUME_CONFIG;
    if (!config) {
      console.error("resume.js: window.RESUME_CONFIG not found. Load resume-config.js first.");
      return;
    }

    const metaEl    = document.getElementById("resumeMetaBar");
    const toolbarEl = document.getElementById("resumeToolbarArea");
    const frameEl   = document.getElementById("resumeFrame");

    if (!frameEl) return; // not on the resume page

    /* Immediately render toolbar in disabled state so layout doesn't jump */
    if (toolbarEl) renderToolbar(config, false, toolbarEl);
    if (metaEl)    renderMetaBar(config, metaEl);

    /* No file configured → show placeholder straight away */
    if (!config.file) {
      if (toolbarEl) renderToolbar(config, false, toolbarEl);
      renderPlaceholder(config, frameEl);
      return;
    }

    /* Probe for the file, then render appropriately */
    probe(
      config.file,
      function onSuccess() {
        if (toolbarEl) renderToolbar(config, true, toolbarEl);
        renderEmbed(config, frameEl);
      },
      function onFail() {
        if (toolbarEl) renderToolbar(config, false, toolbarEl);
        renderPlaceholder(config, frameEl);
      }
    );
  }

  /* ── Public API ────────────────────────────────────────── */

  window.Resume = { init, reload: init };

  document.addEventListener("DOMContentLoaded", init);
})();
