/* ============================================================
   profile-config.js
   Central, easy-to-edit configuration for the portfolio.
   Recruiters / owners: change values here, the whole site updates.
   ============================================================ */

const profileConfig = {
  // Personal information
  name: "King Cedrick Plupenio",
  tagline: "Driven by Learning. Focused on Solutions.",
  subtitle: "Aspiring IT Consultant | Data Science Graduate | Full Stack Developer",

  // Profile image — if file missing, initials avatar shows automatically
  image: "assets/images/Ced_profile.png",
  initials: "KP",

  // Availability badge — easy to switch later
  availability: "Open to Opportunities",

  // Contact details
  email: "kcplupenio@gmail.com",
  phone: "",
  location: "Philippines",

  // Social links
  social: {
    linkedin: "https://www.linkedin.com/in/kingcedrickplupenio/",
    github: "https://github.com/keysiiiiiiii",
    facebook: "https://web.facebook.com/cedieee.me",
  },

  // Resume file — also used by the hero download button on the home page.
  // The dedicated resume page reads js/resume-config.js for richer metadata.
  resume: "assets/resume/resume.pdf",

  // Hero statistics
  stats: [
    { value: "2025", label: "IT Graduate, Data Science" },
    { value: "2+", label: "Years Professional Experience" },
    { value: "5+", label: "Projects & Systems Built" },
    { value: "85%", label: "Lead Contribution on Bio-ALMS" },
  ],

  // Technical skills (used on Home + About + could be reused)
  skills: {
    "Web Development": ["HTML5", "CSS3", "JavaScript"],
    "Backend": ["Node.js"],
    "Database": ["MySQL", "PostgreSQL"],
    "Programming": ["Python"],
    "Data": ["Forecasting Logic", "Data Analytics"],
    "Tools": ["Git", "AnyDesk", "Excel", "Google Sheets", "MS Office"],
    "Business Systems": ["Payroll Processing", "Attendance Management", "HR Administration"],
  },
};

// Expose for non-module scripts
window.profileConfig = profileConfig;
