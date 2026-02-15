import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const seedDir = join(import.meta.dirname, 'prisma', 'seed');

/**
 * Parse a natural English date string like "25 May 1810" into a Date object.
 */
function parseDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return null;
  }
  return d;
}

/**
 * Calculate the difference in days between two dates.
 */
function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

/**
 * Extract all leader entries from a TypeScript source file using regex.
 */
function extractLeaders(source) {
  const leaders = [];

  // Match each object block in the array
  const blockRegex = /\{[^}]*?id\s*:\s*(\d+)[^}]*?name\s*:\s*`([^`]*)`[^}]*?tookOffice\s*:\s*`([^`]*)`[^}]*?leftOffice\s*:\s*(?:`([^`]*)`|null)[^}]*?\}/gs;

  let match;
  while ((match = blockRegex.exec(source)) !== null) {
    const id = parseInt(match[1], 10);
    const name = match[2];
    const tookOfficeStr = match[3];
    const leftOfficeStr = match[4] || null;

    const tookOffice = parseDate(tookOfficeStr);
    const leftOffice = leftOfficeStr ? parseDate(leftOfficeStr) : null;

    leaders.push({
      id,
      name,
      tookOfficeStr,
      leftOfficeStr,
      tookOffice,
      leftOffice,
    });
  }

  return leaders;
}

// Main
const files = readdirSync(seedDir).filter((f) => f.endsWith('.ts')).sort();

let totalGaps = 0;

for (const file of files) {
  const filePath = join(seedDir, file);
  const source = readFileSync(filePath, 'utf-8');
  const leaders = extractLeaders(source);

  if (leaders.length === 0) continue;

  // Sort by tookOffice date
  leaders.sort((a, b) => {
    if (!a.tookOffice || !b.tookOffice) return 0;
    return a.tookOffice.getTime() - b.tookOffice.getTime();
  });

  const gaps = [];

  for (let i = 0; i < leaders.length - 1; i++) {
    const current = leaders[i];
    const next = leaders[i + 1];

    // Skip if current leader has no leftOffice (null = incumbent)
    if (!current.leftOffice) continue;

    // Skip if next leader has no tookOffice (shouldn't happen but just in case)
    if (!next.tookOffice) continue;

    // Check if there's a gap: current.leftOffice < next.tookOffice
    if (current.leftOffice.getTime() < next.tookOffice.getTime()) {
      const gapDays = daysBetween(current.leftOffice, next.tookOffice);
      gaps.push({
        left: current,
        started: next,
        gapDays,
      });
    }
  }

  if (gaps.length > 0) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`FILE: ${file}`);
    console.log(`${'='.repeat(70)}`);

    for (const gap of gaps) {
      totalGaps++;
      console.log(`\n  Gap #${totalGaps}:`);
      console.log(`    Left office:  ${gap.left.name} (id: ${gap.left.id})`);
      console.log(`                  leftOffice: ${gap.left.leftOfficeStr}`);
      console.log(`    Took office:  ${gap.started.name} (id: ${gap.started.id})`);
      console.log(`                  tookOffice: ${gap.started.tookOfficeStr}`);
      console.log(`    Gap size:     ${gap.gapDays} day(s)`);
    }
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`TOTAL GAPS FOUND: ${totalGaps}`);
console.log(`${'='.repeat(70)}\n`);
