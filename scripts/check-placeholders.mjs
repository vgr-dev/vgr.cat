#!/usr/bin/env node
// Fails while any TODO(copy) placeholder remains under src/. See D9 in the active plan.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Copy placeholders, plus config placeholders that would ship a broken setting.
const PATTERNS = [/TODO\(copy\)/g, /REPLACE_ME/g];
const TREE = new URL('../src/', import.meta.url).pathname;
const EXTRA_FILES = [new URL('../wrangler.jsonc', import.meta.url).pathname];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

let total = 0;
const perFile = [];

for (const file of [...walk(TREE), ...EXTRA_FILES]) {
  const source = readFileSync(file, 'utf8');
  const count = PATTERNS.reduce(
    (sum, pattern) => sum + (source.match(pattern)?.length ?? 0),
    0,
  );
  if (count > 0) {
    total += count;
    perFile.push([relative(process.cwd(), file), count]);
  }
}

if (total === 0) {
  console.log('check:placeholders — 0 placeholders remain.');
  process.exit(0);
}

console.error(
  `check:placeholders — ${total} placeholder(s) across ${perFile.length} file(s):`,
);
for (const [file, count] of perFile.sort()) {
  console.error(`  ${String(count).padStart(3)}  ${file}`);
}
console.error('\nReplace with final copy before deploying (D9).');
process.exit(1);
