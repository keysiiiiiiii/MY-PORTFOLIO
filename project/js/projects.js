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

  // Merge static projects with localStorage projects
  (function mergeLocalProjects() {
    let localProjects = [];
    try {
      const saved = localStorage.getItem("portfolio_projects");
      if (saved) {
        localProjects = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load local storage projects", e);
    }

    if (localProjects.length) {
      const staticProjects = window.PROJECT_DATA || [];
      const mergedProjects = [...staticProjects];

      localProjects.forEach(localProj => {
        const idx = mergedProjects.findIndex(p => p.id === localProj.id);
        if (idx !== -1) {
          mergedProjects[idx] = localProj;
        } else {
          mergedProjects.push(localProj);
        }
      });

      window.PROJECT_DATA = mergedProjects;
    }
  })();

  /* ── Constants ─────────────────────────────────────────── */

  /** @type {Record<ProjectStatus, {label: string, colorVar: string}>} */
  const STATUS_META = {
    "completed": { label: "Completed", color: "var(--accent-success)" },
    "in-progress": { label: "In Progress", color: "var(--accent-warning)" },
    "archived": { label: "Archived", color: "var(--ink-500)" },
    "concept": { label: "Concept", color: "var(--secondary-400)" },
  };

  /** @type {Record<string, string>} */
  const LINK_LABELS = {
    github: "GitHub",
    demo: "Live Demo",
    docs: "Docs",
    video: "Video",
    other: "View",
  };

  /** @type {Record<string, string>} link-type → icon key from window.ICONS */
  const LINK_ICONS = {
    github: "github",
    demo: "external",
    docs: "doc",
    video: "external",
    other: "external",
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
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
      const isVideo = img.type === "video" || img.src.startsWith("data:video/") || img.src.endsWith(".mp4") || img.src.endsWith(".webm") || img.src.endsWith(".mov") || img.src.endsWith(".ogg");
      if (isVideo) {
        return `
          <video
            src="${escHtml(img.src)}"
            class="proj-thumb-img"
            autoplay
            muted
            loop
            playsinline
            style="object-fit: cover;"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"></video>
          <span class="thumb-fallback" style="display:none;" aria-hidden="true">${escHtml(project.title)}</span>`;
      }
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

  function mainMediaHTML(img, projectId) {
    const isVideo = img.type === "video" || img.src.startsWith("data:video/") || img.src.endsWith(".mp4") || img.src.endsWith(".webm") || img.src.endsWith(".mov") || img.src.endsWith(".ogg");
    if (isVideo) {
      return `<video
        id="galleryMainImg_${escHtml(projectId)}"
        src="${escHtml(img.src)}"
        class="gallery-main-img"
        controls
        autoplay
        muted
        playsinline></video>`;
    } else {
      return `<img
        id="galleryMainImg_${escHtml(projectId)}"
        src="${escHtml(img.src)}"
        alt="${escHtml(img.alt)}"
        class="gallery-main-img">`;
    }
  }

  function galleryHTML(project) {
    const images = project.images;
    if (!images?.length) return "";

    const thumbs = images.map((img, i) => {
      const isVideo = img.type === "video" || img.src.startsWith("data:video/") || img.src.endsWith(".mp4") || img.src.endsWith(".webm") || img.src.endsWith(".mov") || img.src.endsWith(".ogg");
      const thumbContent = isVideo
        ? `<div style="position:relative;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;">
             <span style="position:absolute;z-index:2;color:white;font-size:1.2rem;text-shadow:0px 0px 4px rgba(0,0,0,0.8);pointer-events:none;">▶</span>
             <video src="${escHtml(img.src)}" style="width:100%;height:100%;object-fit:cover;opacity:0.6;pointer-events:none;"></video>
           </div>`
        : `<img src="${escHtml(img.src)}" alt="${escHtml(img.alt)}" loading="lazy" onerror="this.parentElement.style.display='none';">`;

      return `
        <button
          class="gallery-thumb ${i === 0 ? "active" : ""}"
          data-gallery-idx="${i}"
          data-project-gallery="${escHtml(project.id)}"
          aria-label="${escHtml(img.caption || img.alt)}"
          title="${escHtml(img.caption || img.alt)}">
          ${thumbContent}
        </button>`;
    }).join("");

    return `
      <div class="modal-gallery" aria-label="Project screenshots">
        <div class="gallery-main" id="galleryMainWrap_${escHtml(project.id)}">
          ${mainMediaHTML(images[0], project.id)}
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

      const wrap = document.getElementById(`galleryMainWrap_${projectId}`);
      if (wrap) {
        wrap.innerHTML = `
          ${mainMediaHTML(img, projectId)}
          <p id="galleryMainCaption_${projectId}" class="gallery-caption">${escHtml(img.caption || "")}</p>
        `;
      }

      btn.closest(".gallery-thumbs")
        ?.querySelectorAll(".gallery-thumb")
        .forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
    });
  }

  /* ── Injected CSS & Admin Panel ─────────────────────────── */

  function injectAdminStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
      #adminPanelBtn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        background: var(--primary-600);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 30px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        transition: transform 0.2s, background 0.2s;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #adminPanelBtn:hover {
        transform: translateY(-2px) scale(1.03);
        background: var(--primary-500);
      }
      .admin-modal-wrap {
        padding: 10px;
        color: var(--text-body);
        max-height: 80vh;
        overflow-y: auto;
      }
      .admin-modal-wrap h3 {
        margin-top: 0;
        margin-bottom: 20px;
        color: var(--text-heading);
      }
      .admin-proj-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
      }
      .admin-proj-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--border);
        background: var(--surface-2);
        border-radius: var(--radius);
        gap: 15px;
      }
      .admin-proj-title-wrap {
        display: flex;
        flex-direction: column;
      }
      .admin-proj-title {
        font-weight: bold;
        color: var(--text-heading);
      }
      .admin-proj-subtitle {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
      .admin-proj-actions {
        display: flex;
        gap: 8px;
      }
      .admin-btn {
        padding: 6px 12px;
        border-radius: var(--radius-sm, 4px);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: opacity 0.2s;
      }
      .admin-btn:hover {
        opacity: 0.9;
      }
      .admin-btn-primary {
        background: var(--primary-600);
        color: white;
      }
      .admin-btn-danger {
        background: #ef4444;
        color: white;
      }
      .admin-btn-ghost {
        background: transparent;
        color: var(--text-body);
        border: 1px solid var(--border);
      }
      .admin-form-group {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .admin-form-group label {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-heading);
      }
      .admin-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      @media (max-width: 600px) {
        .admin-form-row {
          grid-template-columns: 1fr;
        }
      }
      .admin-input, .admin-textarea, .admin-select {
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text-heading);
        padding: 8px 12px;
        border-radius: var(--radius);
        font-family: inherit;
        font-size: 0.9rem;
        width: 100%;
      }
      .admin-textarea {
        resize: vertical;
        min-height: 80px;
      }
      .admin-media-preview-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
      }
      .admin-media-preview-card {
        position: relative;
        width: 80px;
        height: 80px;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
      }
      .admin-media-preview-card img, .admin-media-preview-card video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .admin-media-preview-card .remove-btn {
        position: absolute;
        top: 2px;
        right: 2px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        z-index: 10;
      }
    `;
    document.head.appendChild(style);
  }

  function getLocalProjects() {
    try {
      const saved = localStorage.getItem("portfolio_projects");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  function saveLocalProjects(projects) {
    try {
      localStorage.setItem("portfolio_projects", JSON.stringify(projects));
      return true;
    } catch (e) {
      alert("Error saving: localStorage size limit exceeded! Try using smaller/fewer image and video files.");
      return false;
    }
  }

  function openAdminMenu() {
    const staticProjects = window.PROJECT_DATA || [];
    const localProjects = getLocalProjects();

    const combined = [];
    staticProjects.forEach(sp => {
      const lp = localProjects.find(p => p.id === sp.id);
      combined.push({
        ...sp,
        ...(lp || {}),
        isStatic: true,
        isEdited: !!lp
      });
    });

    localProjects.forEach(lp => {
      if (!combined.some(sp => sp.id === lp.id)) {
        combined.push({
          ...lp,
          isStatic: false,
          isEdited: false
        });
      }
    });

    const itemsHtml = combined.map(p => `
      <div class="admin-proj-item">
        <div class="admin-proj-title-wrap">
          <span class="admin-proj-title">${escHtml(p.title)} ${p.isEdited ? '<span style="color:var(--accent-warning);font-size:0.75rem;">(Edited Locally)</span>' : ''}</span>
          <span class="admin-proj-subtitle">${escHtml(p.subtitle)}</span>
        </div>
        <div class="admin-proj-actions">
          <button class="admin-btn admin-btn-ghost" onclick="window.AdminPanel.editProject('${escHtml(p.id)}')">Edit</button>
          ${(!p.isStatic || p.isEdited)
        ? `<button class="admin-btn admin-btn-danger" onclick="window.AdminPanel.deleteProject('${escHtml(p.id)}', ${p.isStatic})">
                 ${p.isStatic ? 'Revert' : 'Delete'}
               </button>`
        : ''
      }
        </div>
      </div>
    `).join("");

    const html = `
      <div class="admin-modal-wrap">
        <h3>⚙️ Project Manager (Local Dev Only)</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
          Add or edit projects. Uploaded pictures/videos are converted to base64 and saved in localStorage. 
          Use **Export Code** to save changes permanently to <code>projects-data.js</code>.
        </p>
        <div class="admin-proj-list">
          ${itemsHtml.length ? itemsHtml : '<p style="text-align:center;color:var(--text-muted);">No projects found.</p>'}
        </div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div>
            <button class="admin-btn admin-btn-primary" onclick="window.AdminPanel.newProject()">+ Add New Project</button>
            <button class="admin-btn admin-btn-ghost" onclick="window.AdminPanel.exportCode()">Export Code for Vercel</button>
          </div>
          <button class="admin-btn admin-btn-ghost" onclick="location.reload()">Reload & Apply</button>
        </div>
      </div>
    `;

    window.openModal(html);
  }

  function editProject(id) {
    const staticProjects = window.PROJECT_DATA || [];
    const localProjects = getLocalProjects();

    let project = localProjects.find(p => p.id === id);
    if (!project) {
      project = staticProjects.find(p => p.id === id);
    }
    if (!project) return;

    openProjectForm(project);
  }

  function deleteProject(id, isStatic) {
    const confirmMsg = isStatic
      ? "Are you sure you want to revert this project to its original static version? Local edits will be lost."
      : "Are you sure you want to delete this project permanently?";
    if (!confirm(confirmMsg)) return;

    let localProjects = getLocalProjects();
    localProjects = localProjects.filter(p => p.id !== id);

    if (saveLocalProjects(localProjects)) {
      openAdminMenu();
    }
  }

  let currentFormMedia = [];

  function openProjectForm(project = null) {
    const isEdit = !!project;
    const p = project || {
      id: "",
      title: "",
      subtitle: "",
      role: "",
      roleNote: "",
      featured: false,
      status: "completed",
      startDate: "",
      endDate: "",
      description: "",
      technologies: [],
      achievements: [],
      challenges: [],
      solutions: [],
      learnings: [],
      images: [],
      links: [],
      tags: []
    };

    currentFormMedia = [...(p.images || [])];

    const techStr = (p.technologies || []).join(", ");
    const tagsStr = (p.tags || []).join(", ");
    const achStr = (p.achievements || []).join("\n");
    const chalStr = (p.challenges || []).join("\n");
    const solStr = (p.solutions || []).join("\n");
    const learnStr = (p.learnings || []).join("\n");

    const githubLink = (p.links || []).find(l => l.type === "github")?.url || "";
    const demoLink = (p.links || []).find(l => l.type === "demo")?.url || "";

    const mediaListHTML = () => {
      return currentFormMedia.map((m, i) => {
        const isVideo = m.type === "video" || m.src.startsWith("data:video/") || m.src.endsWith(".mp4") || m.src.endsWith(".webm") || m.src.endsWith(".mov") || m.src.endsWith(".ogg");
        const element = isVideo
          ? `<video src="${escHtml(m.src)}" muted autoplay loop playsinline></video>`
          : `<img src="${escHtml(m.src)}" alt="preview">`;
        return `
          <div class="admin-media-preview-card">
            <button type="button" class="remove-btn" onclick="window.AdminPanel.removeMedia(${i})">X</button>
            ${element}
          </div>
        `;
      }).join("");
    };

    const html = `
      <div class="admin-modal-wrap" id="adminFormContainer">
        <h3>${isEdit ? `Edit Project: ${escHtml(p.title)}` : 'Add New Project'}</h3>
        <form id="adminProjectForm" onsubmit="window.AdminPanel.saveProjectForm(event, ${isEdit}, '${escHtml(p.id)}')">
          
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="frm_title">Project Title *</label>
              <input class="admin-input" type="text" id="frm_title" value="${escHtml(p.title)}" required placeholder="e.g. Bio-ALMS">
            </div>
            <div class="admin-form-group">
              <label for="frm_id">Project Slug ID (Unique key) *</label>
              <input class="admin-input" type="text" id="frm_id" value="${escHtml(p.id)}" required placeholder="e.g. bio-alms" ${isEdit ? 'disabled' : ''}>
            </div>
          </div>

          <div class="admin-form-group">
            <label for="frm_subtitle">Tagline / Subtitle *</label>
            <input class="admin-input" type="text" id="frm_subtitle" value="${escHtml(p.subtitle)}" required placeholder="e.g. Biometric Attendance System">
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="frm_role">Your Role *</label>
              <input class="admin-input" type="text" id="frm_role" value="${escHtml(p.role)}" required placeholder="e.g. Lead Developer">
            </div>
            <div class="admin-form-group">
              <label for="frm_roleNote">Role Note / Context</label>
              <input class="admin-input" type="text" id="frm_roleNote" value="${escHtml(p.roleNote || '')}" placeholder="e.g. 85% contribution">
            </div>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="frm_status">Lifecycle Status</label>
              <select class="admin-select" id="frm_status">
                <option value="completed" ${p.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="in-progress" ${p.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="archived" ${p.status === 'archived' ? 'selected' : ''}>Archived</option>
                <option value="concept" ${p.status === 'concept' ? 'selected' : ''}>Concept</option>
              </select>
            </div>
            <div class="admin-form-group" style="display:flex;flex-direction:row;align-items:center;gap:10px;margin-top:25px;">
              <input type="checkbox" id="frm_featured" ${p.featured ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer;">
              <label for="frm_featured" style="cursor:pointer;">Feature on Homepage</label>
            </div>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="frm_startDate">Start Date (YYYY-MM) *</label>
              <input class="admin-input" type="month" id="frm_startDate" value="${escHtml(p.startDate)}" required>
            </div>
            <div class="admin-form-group">
              <label for="frm_endDate">End Date (YYYY-MM, leave empty if ongoing)</label>
              <input class="admin-input" type="month" id="frm_endDate" value="${escHtml(p.endDate || '')}">
            </div>
          </div>

          <div class="admin-form-group">
            <label for="frm_description">Description *</label>
            <textarea class="admin-textarea" id="frm_description" required placeholder="Describe the system and its business impact...">${escHtml(p.description)}</textarea>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="frm_technologies">Technologies (comma-separated)</label>
              <input class="admin-input" type="text" id="frm_technologies" value="${escHtml(techStr)}" placeholder="e.g. Node.js, JavaScript, PostgreSQL">
            </div>
            <div class="admin-form-group">
              <label for="frm_tags">Category Tags (comma-separated)</label>
              <input class="admin-input" type="text" id="frm_tags" value="${escHtml(tagsStr)}" placeholder="e.g. Full Stack, FinTech, Mobile">
            </div>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label for="frm_github">GitHub Link URL</label>
              <input class="admin-input" type="url" id="frm_github" value="${escHtml(githubLink)}" placeholder="https://github.com/...">
            </div>
            <div class="admin-form-group">
              <label for="frm_demo">Live Demo URL</label>
              <input class="admin-input" type="url" id="frm_demo" value="${escHtml(demoLink)}" placeholder="https://...">
            </div>
          </div>

          <div class="admin-form-group">
            <label>Project Achievements / Key Wins (one per line)</label>
            <textarea class="admin-textarea" id="frm_achievements" placeholder="e.g. Shipped expense logging flow that takes <5 seconds">${escHtml(achStr)}</textarea>
          </div>

          <div class="admin-form-group">
            <label>Challenges Encountered (one per line)</label>
            <textarea class="admin-textarea" id="frm_challenges" placeholder="e.g. Inconsistent SDK responses">${escHtml(chalStr)}</textarea>
          </div>

          <div class="admin-form-group">
            <label>Solutions Devised (one per line)</label>
            <textarea class="admin-textarea" id="frm_solutions" placeholder="e.g. Implemented normalisation layer">${escHtml(solStr)}</textarea>
          </div>

          <div class="admin-form-group">
            <label>Key Takeaways & Learnings (one per line)</label>
            <textarea class="admin-textarea" id="frm_learnings" placeholder="e.g. Owning the roadmap teaches product management">${escHtml(learnStr)}</textarea>
          </div>

          <div class="admin-form-group">
            <label>Upload Media (Images & Videos)</label>
            <input class="admin-input" type="file" id="frm_media_files" multiple accept="image/*,video/*" onchange="window.AdminPanel.uploadMediaFiles(this)">
            <div class="admin-media-preview-list" id="frm_media_list">
              ${mediaListHTML()}
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:25px;">
            <button type="button" class="admin-btn admin-btn-ghost" onclick="window.AdminPanel.showMenu()">Cancel</button>
            <button type="submit" class="admin-btn admin-btn-primary">Save Project</button>
          </div>
        </form>
      </div>
    `;

    window.openModal(html);
  }

  function removeMedia(idx) {
    if (idx !== -1) {
      currentFormMedia.splice(idx, 1);
    }
    const container = document.getElementById("frm_media_list");
    if (container) {
      container.innerHTML = currentFormMedia.map((m, i) => {
        const isVideo = m.type === "video" || m.src.startsWith("data:video/") || m.src.endsWith(".mp4") || m.src.endsWith(".webm") || m.src.endsWith(".mov") || m.src.endsWith(".ogg");
        const element = isVideo
          ? `<video src="${escHtml(m.src)}" muted autoplay loop playsinline></video>`
          : `<img src="${escHtml(m.src)}" alt="preview">`;
        return `
          <div class="admin-media-preview-card">
            <button type="button" class="remove-btn" onclick="window.AdminPanel.removeMedia(${i})">X</button>
            ${element}
          </div>
        `;
      }).join("");
    }
  }

  function uploadMediaFiles(input) {
    const files = input.files;
    if (!files.length) return;

    let loaded = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = function (e) {
        const isVideo = file.type.startsWith("video/");
        currentFormMedia.push({
          src: e.target.result,
          alt: file.name,
          caption: file.name.split('.').slice(0, -1).join('.'),
          type: isVideo ? "video" : "image"
        });
        loaded++;
        if (loaded === files.length) {
          removeMedia(-1);
          input.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function saveProjectForm(event, isEdit, editId) {
    event.preventDefault();

    const id = isEdit ? editId : document.getElementById("frm_id").value.trim().toLowerCase().replace(/[^\w-]/g, "");
    const title = document.getElementById("frm_title").value.trim();
    const subtitle = document.getElementById("frm_subtitle").value.trim();
    const role = document.getElementById("frm_role").value.trim();
    const roleNote = document.getElementById("frm_roleNote").value.trim();
    const status = document.getElementById("frm_status").value;
    const featured = document.getElementById("frm_featured").checked;
    const startDate = document.getElementById("frm_startDate").value;
    const endDate = document.getElementById("frm_endDate").value || null;
    const description = document.getElementById("frm_description").value.trim();

    const parseCSV = (val) => val.split(",").map(t => t.trim()).filter(Boolean);
    const parseLines = (val) => val.split("\n").map(t => t.trim()).filter(Boolean);

    const technologies = parseCSV(document.getElementById("frm_technologies").value);
    const tags = parseCSV(document.getElementById("frm_tags").value);

    const achievements = parseLines(document.getElementById("frm_achievements").value);
    const challenges = parseLines(document.getElementById("frm_challenges").value);
    const solutions = parseLines(document.getElementById("frm_solutions").value);
    const learnings = parseLines(document.getElementById("frm_learnings").value);

    const github = document.getElementById("frm_github").value.trim();
    const demo = document.getElementById("frm_demo").value.trim();
    const links = [];
    if (github) links.push({ type: "github", url: github });
    if (demo) links.push({ type: "demo", url: demo });

    if (!id) {
      alert("Please enter a valid Project Slug ID.");
      return;
    }

    const localProjects = getLocalProjects();

    if (!isEdit) {
      const exists = (window.PROJECT_DATA || []).some(p => p.id === id);
      if (exists) {
        alert(`A project with ID "${id}" already exists. Please choose a unique Slug ID.`);
        return;
      }
    }

    const projectData = {
      id,
      title,
      subtitle,
      role,
      roleNote,
      status,
      featured,
      startDate,
      endDate,
      description,
      technologies,
      tags,
      achievements,
      challenges,
      solutions,
      learnings,
      links,
      images: currentFormMedia
    };

    const index = localProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      localProjects[index] = projectData;
    } else {
      localProjects.push(projectData);
    }

    if (saveLocalProjects(localProjects)) {
      openAdminMenu();
    }
  }

  function exportCode() {
    const staticProjects = window.PROJECT_DATA || [];
    const localProjects = getLocalProjects();

    const combined = [];
    staticProjects.forEach(sp => {
      const lp = localProjects.find(p => p.id === sp.id);
      const copy = { ...sp, ...(lp || {}) };
      delete copy.isStatic;
      delete copy.isEdited;
      combined.push(copy);
    });

    localProjects.forEach(lp => {
      if (!combined.some(sp => sp.id === lp.id)) {
        const copy = { ...lp };
        delete copy.isStatic;
        delete copy.isEdited;
        combined.push(copy);
      }
    });

    const exportStr = `/**
 * projects-data.js
 * ─────────────────────────────────────────────────────────────
 * THE SINGLE SOURCE OF TRUTH for every project in the portfolio.
 * Generated dynamically by the Admin Project Manager.
 * ─────────────────────────────────────────────────────────────
 */

const PROJECT_DATA = ${JSON.stringify(combined, null, 2)};

// Make accessible to renderer script
window.PROJECT_DATA = PROJECT_DATA;
`;

    const html = `
      <div class="admin-modal-wrap">
        <h3>📋 Export Configuration for Vercel</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
          Copy all code from the box below, open the file <code>project/js/data/projects-data.js</code>, 
          replace everything in that file with this code, and save it.
        </p>
        <textarea class="admin-textarea" id="frm_export_area" style="height: 250px; font-family: monospace; font-size: 0.8rem; background: var(--surface); color: var(--text-heading); border: 1px solid var(--border);" readonly>${escHtml(exportStr)}</textarea>
        <div style="display:flex;justify-content:space-between;margin-top:15px;">
          <button class="admin-btn admin-btn-primary" onclick="window.AdminPanel.copyExportCode()">Copy to Clipboard</button>
          <button class="admin-btn admin-btn-ghost" onclick="window.AdminPanel.showMenu()">Back to Menu</button>
        </div>
      </div>
    `;

    window.openModal(html);
  }

  function copyExportCode() {
    const area = document.getElementById("frm_export_area");
    if (area) {
      area.select();
      document.execCommand("copy");
      alert("Code copied to clipboard! Paste it into project/js/data/projects-data.js");
    }
  }

  function injectAdminButton() {
    const isLocal = window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.search.includes("admin=true");

    if (!isLocal || !document.getElementById("projectsGrid")) return;

    const btn = document.createElement("button");
    btn.id = "adminPanelBtn";
    btn.innerHTML = `⚙️ Manage Projects`;
    btn.addEventListener("click", openAdminMenu);
    document.body.appendChild(btn);
  }

  window.AdminPanel = {
    showMenu: openAdminMenu,
    editProject: editProject,
    deleteProject: deleteProject,
    newProject: () => openProjectForm(null),
    removeMedia: removeMedia,
    uploadMediaFiles: uploadMediaFiles,
    saveProjectForm: saveProjectForm,
    exportCode: exportCode,
    copyExportCode: copyExportCode
  };

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
    injectAdminStyles();
    injectAdminButton();

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
