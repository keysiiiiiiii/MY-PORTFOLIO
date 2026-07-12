/**
 * projects-data.js
 * ─────────────────────────────────────────────────────────────
 * THE SINGLE SOURCE OF TRUTH for every project in the portfolio.
 *
 * TO ADD A PROJECT: append a new object following the schema
 * below. The UI renders everything automatically — no template
 * files need to be touched.
 *
 * ─────────────────────────────────────────────────────────────
 * TYPE REFERENCE (JSDoc — mirrors TypeScript interfaces)
 * ─────────────────────────────────────────────────────────────
 *
 * @typedef {Object} ProjectLink
 * @property {"github"|"demo"|"docs"|"video"|"other"} type
 * @property {string} url
 * @property {string} [label]   - override the default label for this type
 *
 * @typedef {Object} ProjectImage
 * @property {string} src       - relative path from site root
 * @property {string} alt       - descriptive alt text for accessibility
 * @property {string} [caption] - optional caption shown in lightbox
 *
 * @typedef {"completed"|"in-progress"|"archived"|"concept"} ProjectStatus
 *
 * @typedef {Object} Project
 * @property {string}        id           - slug, used in data attributes & URLs
 * @property {string}        title        - project name
 * @property {string}        subtitle     - one-line description / tagline
 * @property {string}        role         - your role (e.g. "Lead Developer")
 * @property {string}        [roleNote]   - short qualifier (e.g. "85% contribution")
 * @property {boolean}       featured     - show on the Home page featured section
 * @property {ProjectStatus} status       - project lifecycle state
 * @property {string}        startDate    - ISO date string "YYYY-MM" or "YYYY-MM-DD"
 * @property {string}        [endDate]    - omit (or null) for ongoing / in-progress
 * @property {string}        description  - full paragraph description
 * @property {string[]}      technologies - tech stack labels
 * @property {string[]}      achievements - measurable outcomes and wins
 * @property {string[]}      challenges   - problems encountered
 * @property {string[]}      solutions    - how each challenge was resolved
 * @property {string[]}      learnings    - key takeaways
 * @property {ProjectImage[]} images      - gallery images (first used as card thumbnail)
 * @property {ProjectLink[]} links        - external links (GitHub, live demo, etc.)
 * @property {string[]}      [tags]       - free-form filter tags (category / domain)
 */

/** @type {Project[]} */
const PROJECT_DATA = [
  {
    id: "bio-alms",
    title: "Bio-ALMS",
    subtitle: "Biometric Attendance & Leave Management System",
    role: "Lead Developer",
    roleNote: "85% system contribution",
    featured: true,
    status: "completed",
    startDate: "2024-06",
    endDate: "2024-12",
    description:
      "An enterprise-grade attendance and leave management platform built around biometric device integration. Bio-ALMS unifies daily attendance logging, leave requests, approvals workflow, and an in-house forecasting module that predicts absenteeism patterns — giving HR teams the data to plan staffing before shortages happen.",
    technologies: ["Node.js", "JavaScript", "MySQL", "PostgreSQL", "HTML5", "CSS3"],
    achievements: [
      "Led 85% of the codebase end-to-end: schema, API, UI, and deployment.",
      "Reduced manual attendance reconciliation from hours to minutes per day.",
      "Built a forecasting engine that predicts weekly absenteeism using historical patterns.",
      "Integrated biometric device SDK into a normalised, reliable attendance record.",
    ],
    challenges: [
      "Biometric SDK outputs were inconsistent — duplicate punches, timezone drift, and missed records.",
      "Designing a forecasting engine without a dedicated data-science runtime.",
      "Ensuring attendance and leave modules stay consistent under concurrent approvals.",
    ],
    solutions: [
      "Built a normalisation layer that deduplicates and reconciles raw device punches into clean sessions.",
      "Implemented a lightweight statistical forecasting routine in Node.js using historical moving averages.",
      "Modeled leave and attendance as a single transactional domain to prevent state drift.",
    ],
    learnings: [
      "Owning a product end-to-end — schema, API, UI, and deployment — reveals hidden coupling.",
      "Business rules for HR are surprisingly complex; accurate modelling beats clever workarounds.",
      "Forecasting adds disproportionate value for operational planning teams.",
    ],
    images: [
      { src: "assets/projects/bio-alms/dashboard.svg",    alt: "Bio-ALMS attendance dashboard showing daily stats and 30-day trend chart", caption: "Dashboard overview" },
      { src: "assets/projects/bio-alms/attendance.svg",   alt: "Attendance log with per-employee status (Present, Late, On Leave)", caption: "Attendance log" },
      { src: "assets/projects/bio-alms/forecasting.svg",  alt: "Forecasting module predicting absenteeism over the next 14 days", caption: "Forecasting module" },
    ],
    links: [],
    tags: ["Full Stack", "HR Systems", "Data Analytics"],
  },
  {
    id: "bubbl",
    title: "BUBBL",
    subtitle: "Ang Tipid App Hacks Ko — Personal Finance App",
    role: "Founder & Lead Developer",
    roleNote: "Full product ownership",
    featured: true,
    status: "in-progress",
    startDate: "2024-03",
    endDate: null,
    description:
      "BUBBL is a personal finance application built for everyday Filipinos who want to track expenses, monitor salary flow, and budget smarter — without friction. The app supports shared budgeting so families and partners can plan together, and is designed mobile-first for daily use.",
    technologies: ["JavaScript", "CSS3", "HTML5", "Mobile Deployment"],
    achievements: [
      "Designed and shipped a one-tap expense logging flow that reduces friction to under 5 seconds.",
      "Built shared-budget scopes with per-member visibility controls.",
      "Modelled salary cycles as configurable, repeatable events to handle irregular income.",
      "Full product ownership: roadmap, design, development, and user feedback loop.",
    ],
    challenges: [
      "Designing a UX simple enough for non-technical users to log expenses consistently every day.",
      "Supporting shared budgets without exposing one user's private transactions to another.",
      "Keeping salary monitoring accurate across irregular income cycles and payment schedules.",
    ],
    solutions: [
      "Built a one-tap logging flow with smart category inference from description keywords.",
      "Implemented shared-budget scopes with per-member visibility and access control.",
      "Modelled salary cycles as named, repeatable events configurable per user.",
    ],
    learnings: [
      "Product ownership means owning the roadmap, not just the code.",
      "Friction is the enemy of habit — every extra tap costs active users.",
      "Shipping to real users and reading real feedback teaches more than any spec doc.",
    ],
    images: [
      { src: "assets/projects/bubbl/dashboard.svg", alt: "BUBBL expense dashboard showing available balance and recent transactions", caption: "Expense dashboard" },
      { src: "assets/projects/bubbl/budget.svg",    alt: "Budget breakdown using 50/30/20 rule with salary cycle tracker", caption: "Budget breakdown" },
      { src: "assets/projects/bubbl/shared.svg",    alt: "Shared budget feature allowing two users to co-manage a joint goal", caption: "Shared budgeting" },
    ],
    links: [],
    tags: ["Mobile", "FinTech", "Product"],
  },
];

// Make accessible to renderer script
window.PROJECT_DATA = PROJECT_DATA;
