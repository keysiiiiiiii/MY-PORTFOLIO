/* ============================================================
   script.js — shared site behavior
   Sidebar rendering, mobile menu, profile injection,
   fade-in on scroll, contact form, generic modal.
   ============================================================ */

/* ---------- SVG icon set (inline so no external deps) ---------- */
const ICONS = {
  home: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  about: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>',
  projects: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  experience: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  certifications: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/></svg>',
  blog: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  resume: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>',
  contact: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><polyline points="22 6 12 13 2 6"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 008.3 22.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.9.8 2.4 1.2.4-.2 2.3-.3 2.5-1.5-2.2.4-4-.3-4-2.8 0-1.2.6-1.7 1.2-1.7-.5 0-1.4.5-1.4 1.8 0 1.5 1 2 1 2s-1 .7-1.6.4C5 16.4 4.2 14 4.2 14s.2-1.1.8-1.5c-.7 0-1.7.3-1.7.3s-1-.4-.3-1.2c.5-.5 1.7-1 2.5-.4 1-1 2-1 2-1s1.5-.7 3 .4c1.5-1.1 3-.4 3-.4s1 .6 1.5 1.6c.5.8-.3 1.2-.3 1.2s.6.4.2 1.5c0 0-.5 1.2-1.5 1.4 0 0 1 .6.6 1.6 0 0-.6 1.2-1.6.8 0 0 .4 1-.4 1.3 0 0 1 .4 1 1.6v2c0 .3.2.6.8.5A11.5 11.5 0 0012 .5z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0114 6h2.5v3H15a1 1 0 00-1 1v2h2.5l-.4 3H14v7A10 10 0 0022 12z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
};

/* ---------- Navigation definition ---------- */
const NAV = [
  { id: "home",           label: "Home",           href: "index.html",          icon: "home" },
  { id: "about",          label: "About",          href: "about.html",          icon: "about" },
  { id: "projects",       label: "Projects",       href: "projects.html",       icon: "projects" },
  { id: "experience",     label: "Experience",     href: "experience.html",     icon: "experience" },
  { id: "certifications", label: "Certifications", href: "certifications.html", icon: "certifications" },
  { id: "blog",           label: "Blog",           href: "blog.html",           icon: "blog" },
  { id: "resume",         label: "Resume",         href: "resume.html",         icon: "resume" },
  { id: "contact",        label: "Contact",        href: "contact.html",        icon: "contact" },
];

/* ---------- Determine active page ---------- */
function activePageId() {
  const path = location.pathname.split("/").pop() || "index.html";
  const match = NAV.find(n => n.href === path);
  return match ? match.id : "home";
}

/* ---------- Build sidebar ---------- */
function buildSidebar() {
  const cfg = window.profileConfig;
  const active = activePageId();

  const social = cfg.social || {};
  const socialLinks = [
    { key: "linkedin", url: social.linkedin },
    { key: "github",   url: social.github },
    { key: "facebook", url: social.facebook },
  ].filter(s => s.url);

  const navHtml = NAV.map(n => `
    <a class="nav-link ${n.id === active ? "active" : ""}" href="${n.href}" aria-current="${n.id === active ? "page" : "false"}">
      ${ICONS[n.icon]}<span>${n.label}</span>
    </a>`).join("");

  const socialHtml = socialLinks.map(s => `
    <a class="social-link" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.key}">
      ${ICONS[s.key]}
    </a>`).join("");

  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = `
    <div class="profile-block">
      <div class="profile-photo placeholder" id="profilePhoto" aria-label="Profile photo">
        <span class="initials">${cfg.initials}</span>
      </div>
      <div class="profile-name">${cfg.name}</div>
      <div class="profile-tagline">${cfg.tagline}</div>
      <span class="status-badge" id="statusBadge">${cfg.availability}</span>
    </div>
    <nav class="nav" aria-label="Primary">${navHtml}</nav>
    <div class="social-row" aria-label="Social links">${socialHtml}</div>
  `;

  // Try to load the profile image; fall back to initials if it fails.
  loadProfileImage(cfg.image, cfg.initials);

  // Mobile header brand
  const brand = document.querySelector(".mobile-header .brand-name");
  if (brand) brand.textContent = cfg.name;
}

/* ---------- Profile image with graceful fallback ---------- */
function loadProfileImage(src, initials) {
  const el = document.getElementById("profilePhoto");
  if (!el) return;
  const img = new Image();
  img.onload = function () {
    el.classList.remove("placeholder");
    el.innerHTML = "";
    const im = document.createElement("img");
    im.src = src;
    im.alt = `${initials} profile photo`;
    im.style.width = "100%";
    im.style.height = "100%";
    im.style.borderRadius = "50%";
    im.style.objectFit = "cover";
    el.appendChild(im);
  };
  img.onerror = function () { /* keep initials avatar */ };
  img.src = src;
}

/* ---------- Mobile menu ---------- */
function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");
  if (!toggle || !sidebar) return;

  function close() {
    sidebar.classList.remove("open");
    if (backdrop) backdrop.style.display = "none";
    document.body.style.overflow = "";
  }
  function open() {
    sidebar.classList.add("open");
    if (backdrop) backdrop.style.display = "block";
    document.body.style.overflow = "hidden";
  }
  toggle.addEventListener("click", function () {
    sidebar.classList.contains("open") ? close() : open();
  });
  if (backdrop) backdrop.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
}

/* ---------- Inject status badge anywhere with [data-status] ---------- */
function injectStatusBadges() {
  const cfg = window.profileConfig;
  document.querySelectorAll("[data-status]").forEach(el => {
    el.textContent = cfg.availability;
    el.classList.add("status-badge");
  });
}

/* ---------- Fade-in on scroll ---------- */
function setupFadeIn() {
  const els = document.querySelectorAll(".fade-in");
  if (!("IntersectionObserver" in window)) {
    els.forEach(e => e.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

/* ---------- Stats rendering (for any [data-stats] container) ---------- */
function renderStats() {
  const cfg = window.profileConfig;
  document.querySelectorAll("[data-stats]").forEach(container => {
    container.innerHTML = cfg.stats.map(s => `
      <div class="stat-card fade-in">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>`).join("");
  });
}

/* ---------- Skills rendering (for any [data-skills] container) ---------- */
function renderSkills() {
  const cfg = window.profileConfig;
  document.querySelectorAll("[data-skills]").forEach(container => {
    container.innerHTML = Object.entries(cfg.skills).map(([group, items]) => `
      <div class="card skill-group fade-in">
        <h3><span class="dot"></span>${group}</h3>
        <div class="chips">
          ${items.map(i => `<span class="chip">${i}</span>`).join("")}
        </div>
      </div>`).join("");
  });
}

/* ---------- Contact form (UI only, no backend) ---------- */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const success = document.getElementById("formSuccess");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (success) {
      success.classList.add("show");
      success.setAttribute("role", "status");
    }
    form.reset();
    setTimeout(() => { if (success) success.classList.remove("show"); }, 6000);
  });
}

/* ---------- Year ---------- */
function injectYear() {
  document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
}

/* ---------- Generic modal helper (used by cert/blog/projects) ---------- */
window.openModal = function (html) {
  let overlay = document.getElementById("modalOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "modalOverlay";
    overlay.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="modal-close" aria-label="Close">${ICONS.close}</button><div class="modal-content"></div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.closest(".modal-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }
  overlay.querySelector(".modal-content").innerHTML = html;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
};
function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  buildSidebar();
  setupMobileMenu();
  injectStatusBadges();
  renderStats();
  renderSkills();
  setupFadeIn();
  setupContactForm();
  injectYear();
});

// Expose for projects.js
window.ICONS = ICONS;
