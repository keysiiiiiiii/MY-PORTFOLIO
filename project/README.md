# King Cedrick Plupenio — Portfolio

A multi-page personal portfolio built with **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build step required for the runtime. Deploys as a static site to GitHub Pages, Netlify, or Vercel.

## Quick start

```bash
npm install
npm run dev       # local dev server (Vite serves the static root)
npm run build     # copies the static site into ./dist
npm run preview   # previews the built ./dist
```

To deploy, upload either the project root or the `dist/` folder to your static host.

## Pages

| Page            | File                  |
|-----------------|-----------------------|
| Home            | `index.html`          |
| About           | `about.html`          |
| Projects         | `projects.html`       |
| Experience       | `experience.html`     |
| Certifications   | `certifications.html` |
| Blog             | `blog.html`           |
| Resume           | `resume.html`         |
| Contact          | `contact.html`        |

## Structure

```
index.html, about.html, … contact.html   # pages
css/    style.css · responsive.css · darkmode.css
js/     profile-config.js · theme.js · script.js · projects.js
assets/ images/ · projects/{bio-alms,bubbl}/ · resume/resume.pdf
```

## Easy to edit

- **Your details** live in `js/profile-config.js` — name, tagline, availability badge, social links, stats, and skills. Everything updates site-wide.
- **Projects** live in `js/projects.js` — add an object to the `PROJECTS` array and it appears on Projects and (if `featured: true`) on Home, with a case-study modal.
- **Blog posts** live inline in `blog.html` — add an object to the `POSTS` array.
- **Certificates** live inline in `certifications.html` — edit the `CERTS` array.
- **Resume** — drop your PDF at `assets/resume/resume.pdf`.
- **Profile photo** — replace `assets/images/profile.svg` (or `profile.jpg` and update `profile-config.js`). If the file is missing, an initials avatar is shown automatically.

## Theme

Dark mode is the default. A toggle in the sidebar / mobile header switches to light; the choice is saved in `localStorage` and respects the OS preference on first visit.
