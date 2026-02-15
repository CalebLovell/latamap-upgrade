import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const seedDir = join(import.meta.dirname, 'prisma', 'seed');
const files = readdirSync(seedDir).filter(f => f.endsWith('.ts')).sort();

for (const file of files) {
	const filePath = join(seedDir, file);
	let content = readFileSync(filePath, 'utf-8');

	// Find all id: NNNNN occurrences and determine the base
	const idMatches = [...content.matchAll(/\bid:\s*(\d+)/g)];
	if (idMatches.length === 0) continue;

	const firstId = parseInt(idMatches[0][1]);
	const base = Math.floor(firstId / 1000) * 1000;

	// Renumber sequentially from base
	let counter = 0;
	const newContent = content.replace(/\bid:\s*(\d+)/g, (match, oldId) => {
		const newId = base + counter;
		counter++;
		return `id: ${newId}`;
	});

	if (content !== newContent) {
		writeFileSync(filePath, newContent, 'utf-8');
		console.log(`${file}: renumbered ${counter} entries (${base} – ${base + counter - 1})`);
	} else {
		console.log(`${file}: no changes needed`);
	}
}
