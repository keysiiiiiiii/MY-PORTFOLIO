/* ============================================================
   resume-config.js
   ─────────────────────────────────────────────────────────────
   SINGLE SOURCE OF TRUTH for resume file management.

   TO SWAP YOUR RESUME:
     1. Replace the file at the path below (or drop a new file
        into assets/resume/ with a different name).
     2. Update `file` and optionally `version` / `updatedAt`.
     That's it — the resume page updates automatically.

   TO SHOW A "NO RESUME" PLACEHOLDER:
     Set `file` to null or an empty string.

   FUTURE ADMIN USE:
     This object is exported on window.RESUME_CONFIG so any
     future admin panel can read and patch it at runtime.
   ─────────────────────────────────────────────────────────────

   TYPE REFERENCE
   ─────────────────────────────────────────────────────────────

   @typedef {Object} ResumeConfig
   @property {string|null} file
     Path to the PDF relative to the site root.
     Set to null to show the "no resume" placeholder.

   @property {string} displayName
     The filename used as the download name when the user clicks
     "Download PDF". Should end in .pdf.

   @property {string|null} version
     Optional version label shown in the UI.
     E.g. "June 2025", "v2.1", null to hide.

   @property {string|null} updatedAt
     ISO date string for the "Last updated" badge.
     E.g. "2025-06-15". null to hide.

   @property {boolean} showToolbar
     Whether to show the browser's built-in PDF toolbar
     (print, zoom, page nav) inside the embed.

   @property {Object} placeholder
     Content rendered when `file` is null / missing.

   @property {string} placeholder.heading
   @property {string} placeholder.body
   @property {string} placeholder.hint
     Developer hint shown below the message (italic, muted).
 */

/** @type {ResumeConfig} */
const RESUME_CONFIG = {
  /* ── File ────────────────────────────────────────────────── */
  file:        "assets/resume/resume.pdf",
  displayName: "King-Cedrick-Plupenio-Resume.pdf",

  /* ── Metadata ────────────────────────────────────────────── */
  version:   "June 2026",
  updatedAt: "2026-06-21",

  /* ── Viewer options ──────────────────────────────────────── */
  showToolbar: true,

  /* ── Placeholder (shown when file is null or unreachable) ── */
  placeholder: {
    heading: "Resume is being updated.",
    body: "A fresh copy will be available here shortly. In the meantime, feel free to reach out directly.",
    hint: "Developer: add a PDF at the path set in js/resume-config.js to enable the preview.",
  },
};

// Expose globally for the renderer and any future admin UI.
window.RESUME_CONFIG = RESUME_CONFIG;
