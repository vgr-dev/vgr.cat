#!/usr/bin/env node
// Fails while any TODO(copy) placeholder remains under src/. See D9 in the active plan.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SENTINEL = /TODO\(copy\)/g;
const SRC = new URL('../src/', import.meta.url).pathname;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

let total = 0;
const perFile = [];

for (const file of walk(SRC)) {
  const hits = readFileSync(file, 'utf8').match(SENTINEL);
  if (hits) {
    total += hits.length;
    perFile.push([relative(process.cwd(), file), hits.length]);
  }
}

if (total === 0) {
  console.log('check:placeholders — 0 TODO(copy) sentinels remain.');
  process.exit(0);
}

console.error(
  `check:placeholders — ${total} TODO(copy) sentinel(s) across ${perFile.length} file(s):`,
);
for (const [file, count] of perFile.sort()) {
  console.error(`  ${String(count).padStart(3)}  ${file}`);
}
console.error('\nReplace with final copy before deploying (D9).');
process.exit(1);
