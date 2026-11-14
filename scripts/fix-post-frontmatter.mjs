import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.resolve("src/content/posts");

function titleFromSlug(slug) {
  return slug
    .replace(/\.mdx?$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function hasField(fm, key) {
  return new RegExp(`^${key}\\s*:`, "m").test(fm);
}

function appendField(fm, key, value) {
  return `${fm.trimEnd()}\n${key}: ${value}`;
}

const entries = fs
  .readdirSync(POSTS_DIR)
  .filter(f => /\.mdx?$/i.test(f));

let fixed = 0;
let renamed = 0;

for (const file of entries) {
  const full = path.join(POSTS_DIR, file);
  let workingFile = file;
  let fullPath = full;

  // Fix double extensions like foo.md.md -> foo.md
  if (/\.(md|mdx)\.(md|mdx)$/i.test(file)) {
    const m = file.match(/^(.*)\.(md|mdx)\.(md|mdx)$/i);
    const newName = `${m[1]}.${m[2]}`;
    const newPath = path.join(POSTS_DIR, newName);
    fs.renameSync(full, newPath);
    workingFile = newName;
    fullPath = newPath;
    renamed++;
    console.log(`renamed ${file} -> ${newName}`);
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const slug = workingFile.replace(/\.mdx?$/i, "");
  const fallbackTitle = titleFromSlug(slug);
  const fallbackDesc = `A guide for Singapore primary school parents: ${fallbackTitle}.`;

  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  let fm = m ? m[1] : "";
  const body = m ? raw.slice(m[0].length) : raw;

  let changed = false;

  if (!hasField(fm, "title")) {
    fm = appendField(fm, "title", JSON.stringify(fallbackTitle));
    changed = true;
  }
  if (!hasField(fm, "description")) {
    fm = appendField(fm, "description", JSON.stringify(fallbackDesc));
    changed = true;
  }
  if (!hasField(fm, "pubDatetime")) {
    fm = appendField(fm, "pubDatetime", "2026-01-01T00:00:00Z");
    changed = true;
  }

  if (changed) {
    const out = `---\n${fm.replace(/^\n+/, "").trimEnd()}\n---\n\n${body.replace(/^\n+/, "")}`;
    fs.writeFileSync(fullPath, out);
    fixed++;
    console.log(`fixed ${workingFile}`);
  }
}

console.log(`\nDone. fixed ${fixed} file(s), renamed ${renamed} file(s).`);
