/**
 * projects.js — Project Card & Modal Renderer
 * ─────────────────────────────────────────────────────────────
 * Pure rendering layer. All project data lives in
 * js/data/projects-data.js. This file contains zero hardcoded
 * project content — only UI logic.
 *
 * Public API (attached to window for cross-page use):
 *   Projects.renderList(container, items?)
 *   Projects.renderFeatured(container)
 *   Projects.openModal(id)
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  /* ── Constants ─────────────────────────────────────────── */

  /** @type {Record<ProjectStatus, {label: string, colorVar: string}>} */
  const STATUS_META = {
    "completed":   { label: "Completed",   color: "var(--accent-success)" },
    "in-progress": { label: "In Progress", color: "var(--accent-warning)" },
    "archived":    { label: "Archived",    color: "var(--ink-500)" },
    "concept":     { label: "Concept",     color: "var(--secondary-400)" },
  };

  /** @type {Record<string, string>} */
  const LINK_LABELS = {
    github: "GitHub",
    demo:   "Live Demo",
    docs:   "Docs",
    video:  "Video",
    other:  "View",
  };

  /** @type {Record<string, string>} link-type → icon key from window.ICONS */
  const LINK_ICONS = {
    github: "github",
    demo:   "external",
    docs:   "doc",
    video:  "external",
    other:  "external",
  };

  /* ── Helpers ───────────────────────────────────────────── */

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDateRange(start, end) {
    if (!start) return "";
    const fmt = (d) => {
      const [y, m] = d.split("-");
      if (!m) return y;
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[+m - 1]} ${y}`;
    };
    return end ? `${fmt(start)} – ${fmt(end)}` : `${fmt(start)} – Present`;
  }

  function statusBadgeHTML(status) {
    const meta = STATUS_META[status] || STATUS_META["concept"];
    return `<span class="proj-status-badge" data-status="${escHtml(status)}" style="--status-color:${meta.color};">${escHtml(meta.label)}</span>`;
  }

  function techTagsHTML(technologies) {
    return technologies
      .map(t => `<span class="tech-tag">${escHtml(t)}</span>`)
      .join("");
  }

  function linksHTML(links, size) {
    if (!links || !links.length) return "";
    return links.map(link => {
      const label = link.label || LINK_LABELS[link.type] || "View";
      const iconKey = LINK_ICONS[link.type] || "external";
      const icon = window.ICONS?.[iconKey] || "";
      const cls = size === "sm" ? "btn btn-ghost btn-sm" : "btn btn-ghost";
      return `<a class="${cls}" href="${escHtml(link.url)}" target="_blank" rel="noopener noreferrer">${icon}${escHtml(label)}</a>`;
    }).join("");
  }

  function listBlockHTML(title, items) {
    if (!items || !items.length) return "";
    return `
      <div class="modal-section">
        <h4>${escHtml(title)}</h4>
        <ul class="detail-list" role="list">
          ${items.map(i => `<li>${escHtml(i)}</li>`).join("")}
        </ul>
      </div>`;
  }

  /* ── Thumbnail ─────────────────────────────────────────── */

  function thumbHTML(project) {
    const img = project.images?.[0];
    if (img) {
      return `
        <img
          src="${escHtml(img.src)}"
          alt="${escHtml(img.alt)}"
          loading="lazy"
          class="proj-thumb-img"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
        <span class="thumb-fallback" style="display:none;" aria-hidden="true">${escHtml(project.title)}</span>`;
    }
    return `<span class="thumb-fallback" aria-hidden="true">${escHtml(project.title)}</span>`;
  }

  /* ── Project Card ──────────────────────────────────────── */

  function cardHTML(project) {
    const dateRange = formatDateRange(project.startDate, project.endDate);
    const hasLinks = project.links?.length > 0;

    return `
      <article
        class="project-card fade-in"
        data-project-id="${escHtml(project.id)}"
        data-tags="${escHtml((project.tags || []).join(","))}"
        role="article">

        <div class="project-thumb">
          ${thumbHTML(project)}
          ${statusBadgeHTML(project.status)}
        </div>

        <div class="project-body">
          <div class="project-meta-row">
            <span class="project-tag">${escHtml(project.subtitle)}</span>
            ${dateRange ? `<span class="project-date">${escHtml(dateRange)}</span>` : ""}
          </div>

          <h3 class="project-title">${escHtml(project.title)}</h3>

          <div class="role-badge">
            ${window.ICONS?.award || ""}
            ${escHtml(project.role)}
            ${project.roleNote ? `<span class="role-note">· ${escHtml(project.roleNote)}</span>` : ""}
          </div>

          <p class="project-desc">${escHtml(project.description)}</p>

          <div class="project-tech" aria-label="Technologies used">
            ${techTagsHTML(project.technologies)}
          </div>

          ${project.achievements?.length ? `
          <div class="project-achievement">
            <span class="achievement-label">Key win:</span>
            ${escHtml(project.achievements[0])}
          </div>` : ""}

          <div class="project-actions">
            <button
              class="btn btn-primary"
              data-open-project="${escHtml(project.id)}"
              aria-label="View case study for ${escHtml(project.title)}">
              ${window.ICONS?.external || ""}View Case Study
            </button>
            ${hasLinks ? linksHTML(project.links, "sm") : ""}
          </div>
        </div>
      </article>`;
  }

  /* ── Gallery in Modal ──────────────────────────────────── */

  function galleryHTML(project) {
    const images = project.images;
    if (!images?.length) return "";

    const thumbs = images.map((img, i) => `
      <button
        class="gallery-thumb ${i === 0 ? "active" : ""}"
        data-gallery-idx="${i}"
        data-project-gallery="${escHtml(project.id)}"
        aria-label="${escHtml(img.caption || img.alt)}"
        title="${escHtml(img.caption || img.alt)}">
        <img
          src="${escHtml(img.src)}"
          alt="${escHtml(img.alt)}"
          loading="lazy"
          onerror="this.parentElement.style.display='none';">
      </button>`).join("");

    return `
      <div class="modal-gallery" aria-label="Project screenshots">
        <div class="gallery-main">
          <img
            id="galleryMainImg_${escHtml(project.id)}"
            src="${escHtml(images[0].src)}"
            alt="${escHtml(images[0].alt)}"
            class="gallery-main-img">
          <p
            id="galleryMainCaption_${escHtml(project.id)}"
            class="gallery-caption">
            ${escHtml(images[0].caption || "")}
          </p>
        </div>
        ${images.length > 1 ? `
        <div class="gallery-thumbs" role="tablist" aria-label="Screenshot thumbnails">
          ${thumbs}
        </div>` : ""}
      </div>`;
  }

  /* ── Modal Content ─────────────────────────────────────── */

  function modalHTML(project) {
    const dateRange = formatDateRange(project.startDate, project.endDate);

    return `
      <div class="proj-modal-wrap">
        ${galleryHTML(project)}

        <div class="modal-body">
          <div class="modal-header-row">
            <div>
              <span class="project-tag">${escHtml(project.subtitle)}</span>
              <h2 class="modal-title">${escHtml(project.title)}</h2>
            </div>
            ${statusBadgeHTML(project.status)}
          </div>

          <div class="modal-meta-row">
            <div class="role-badge">
              ${window.ICONS?.award || ""}
              ${escHtml(project.role)}
              ${project.roleNote ? `<span class="role-note">· ${escHtml(project.roleNote)}</span>` : ""}
            </div>
            ${dateRange ? `<span class="modal-date">${escHtml(dateRange)}</span>` : ""}
          </div>

          <p class="modal-description">${escHtml(project.description)}</p>

          ${project.links?.length ? `
          <div class="modal-links" aria-label="Project links">
            ${linksHTML(project.links, "default")}
          </div>` : ""}

          <div class="modal-section">
            <h4>Technologies Used</h4>
            <div class="project-tech">${techTagsHTML(project.technologies)}</div>
          </div>

          ${listBlockHTML("Achievements", project.achievements)}
          ${listBlockHTML("Challenges", project.challenges)}
          ${listBlockHTML("Solutions", project.solutions)}
          ${listBlockHTML("Key Learnings", project.learnings)}
        </div>
      </div>`;
  }

  /* ── Gallery interaction (delegated) ───────────────────── */

  function setupGalleryDelegation() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-gallery-idx]");
      if (!btn) return;

      const projectId = btn.getAttribute("data-project-gallery");
      const idx = +btn.getAttribute("data-gallery-idx");
      const project = (window.PROJECT_DATA || []).find(p => p.id === projectId);
      if (!project) return;

      const img = project.images[idx];
      if (!img) return;

      const mainImg = document.getElementById(`galleryMainImg_${projectId}`);
      const caption = document.getElementById(`galleryMainCaption_${projectId}`);
      if (mainImg) { mainImg.src = img.src; mainImg.alt = img.alt; }
      if (caption) caption.textContent = img.caption || "";

      btn.closest(".gallery-thumbs")
        ?.querySelectorAll(".gallery-thumb")
        .forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
    });
  }

  /* ── Search & Filter state ─────────────────────────────── */

  let _filterTag = "all";
  let _searchQuery = "";

  function applyFilters(container) {
    const cards = container.querySelectorAll(".project-card");
    let shown = 0;
    cards.forEach(card => {
      const tags = card.getAttribute("data-tags") || "";
      const title = card.querySelector(".project-title")?.textContent.toLowerCase() || "";
      const desc = card.querySelector(".project-desc")?.textContent.toLowerCase() || "";
      const tech = card.querySelector(".project-tech")?.textContent.toLowerCase() || "";

      const tagMatch = _filterTag === "all" || tags.toLowerCase().includes(_filterTag.toLowerCase());
      const q = _searchQuery.toLowerCase();
      const searchMatch = !q || title.includes(q) || desc.includes(q) || tech.includes(q);

      const visible = tagMatch && searchMatch;
      card.style.display = visible ? "" : "none";
      if (visible) shown++;
    });

    const empty = container.parentElement?.querySelector(".projects-empty");
    if (empty) empty.style.display = shown === 0 ? "flex" : "none";
  }

  /* ── Render helpers ────────────────────────────────────── */

  function renderInto(container, items) {
    container.innerHTML = items.map(cardHTML).join("");
    // trigger fade-in for newly inserted cards
    requestAnimationFrame(() => {
      container.querySelectorAll(".fade-in").forEach(el => {
        setTimeout(() => el.classList.add("visible"), 30);
      });
    });
  }

  /* ── Public API ────────────────────────────────────────── */

  const Projects = {
    /**
     * Render all (or a provided subset) of projects into container.
     * @param {HTMLElement} container
     * @param {Project[]} [items] - defaults to window.PROJECT_DATA
     */
    renderList(container, items) {
      renderInto(container, items || window.PROJECT_DATA || []);
    },

    /**
     * Render only featured projects.
     * @param {HTMLElement} container
     */
    renderFeatured(container) {
      const data = (window.PROJECT_DATA || []).filter(p => p.featured);
      renderInto(container, data);
    },

    /**
     * Open the detail modal for a project by id.
     * @param {string} id
     */
    openModal(id) {
      const project = (window.PROJECT_DATA || []).find(p => p.id === id);
      if (!project) return;
      window.openModal(modalHTML(project));
    },

    /**
     * Wire the search input for a projects container.
     * @param {HTMLInputElement} input
     * @param {HTMLElement} container
     */
    bindSearch(input, container) {
      input.addEventListener("input", () => {
        _searchQuery = input.value.trim();
        applyFilters(container);
      });
    },

    /**
     * Wire filter tag buttons for a projects container.
     * @param {NodeList|HTMLElement[]} buttons
     * @param {HTMLElement} container
     */
    bindFilters(buttons, container) {
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          _filterTag = btn.getAttribute("data-filter") || "all";
          buttons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          applyFilters(container);
        });
      });
    },

    /** Collect every unique tag from project data. @returns {string[]} */
    allTags() {
      const set = new Set();
      (window.PROJECT_DATA || []).forEach(p => (p.tags || []).forEach(t => set.add(t)));
      return Array.from(set).sort();
    },
  };

  window.Projects = Projects;

  /* ── Auto-init on DOMContentLoaded ────────────────────── */

  document.addEventListener("DOMContentLoaded", function () {
    setupGalleryDelegation();

    // Full list on Projects page
    const listEl = document.querySelector("[data-projects-list]");
    if (listEl) Projects.renderList(listEl);

    // Featured on Home
    const featuredEl = document.querySelector("[data-projects-featured]");
    if (featuredEl) Projects.renderFeatured(featuredEl);

    // Search input
    const searchEl = document.getElementById("projectSearch");
    if (searchEl && listEl) Projects.bindSearch(searchEl, listEl);

    // Filter buttons
    const filterBtns = document.querySelectorAll("[data-filter]");
    if (filterBtns.length && listEl) Projects.bindFilters(filterBtns, listEl);

    // Case-study modal click (delegated)
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-open-project]");
      if (!btn) return;
      Projects.openModal(btn.getAttribute("data-open-project"));
    });
  });
})();
