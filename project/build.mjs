// Static build script — copies the vanilla HTML/CSS/JS site to dist/.
// No bundling. The project is already production-ready static HTML/CSS/JS.
import { cpSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Copy only the static site directories + root HTML pages.
const targets = ["index.html", "about.html", "projects.html", "experience.html",
                 "certifications.html", "blog.html", "resume.html", "contact.html",
                 "css", "js", "assets", "public"];

for (const t of targets) {
  if (existsSync(resolve(root, t))) {
    cpSync(resolve(root, t), resolve(dist, t), { recursive: true });
  }
}

console.log("Static site built into ./dist");
