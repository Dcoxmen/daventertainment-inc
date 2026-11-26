// Joins system-prompt.md and knowledge.md into one prompt for the LemonSlice
// avatar's personality box (LemonSlice avatars have no separate knowledge base).
// Run: node scripts/avatar/make-prompt.mjs  → writes scripts/avatar/lemonslice-prompt.txt

import { readFileSync, writeFileSync } from "node:fs";

const dir = new URL(".", import.meta.url);
const prompt = readFileSync(new URL("system-prompt.md", dir), "utf8")
  .replaceAll("Your knowledge base is", "The KNOWLEDGE section at the end is")
  .replaceAll("your knowledge base file", "the KNOWLEDGE section")
  .replaceAll("your knowledge base", "the KNOWLEDGE section");
const knowledge = readFileSync(new URL("knowledge.md", dir), "utf8")
  .replace(/^# .*\n+[\s\S]*?\n\n/, ""); // drop the file's own title and editor note

const out = `${prompt.trim()}\n\n# KNOWLEDGE\n\n${knowledge.trim()}\n`;
writeFileSync(new URL("lemonslice-prompt.txt", dir), out);
console.log(`lemonslice-prompt.txt: ${out.length} characters`);
