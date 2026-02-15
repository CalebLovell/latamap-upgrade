import fs from 'fs';
import path from 'path';

const seedDir = path.join(process.cwd(), 'prisma', 'seed');
const files = fs.readdirSync(seedDir).filter(f => f.endsWith('.ts'));

function parseDate(str) {
	if (!str || str === 'null') return null;
	str = str.trim();
	if (/^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(str)) return new Date(str);
	const parts = str.split(' ');
	if (parts.length === 3) return new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
	return new Date(str);
}

function fmt(d) {
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

let totalOverlaps = 0;

for (const fileName of files) {
	const filePath = path.join(seedDir, fileName);
	const content = fs.readFileSync(filePath, 'utf-8');

	const leaders = [];
	const regex = /\{[^}]*?id\s*:\s*(\d+)[^}]*?name\s*:\s*`([^`]*)`[^}]*?tookOffice\s*:\s*`([^`]*)`[^}]*?leftOffice\s*:\s*(?:`([^`]*)`|null)/gs;
	let match;
	while ((match = regex.exec(content)) !== null) {
		const id = parseInt(match[1]);
		const name = match[2];
		const tookOfficeStr = match[3];
		const leftOfficeStr = match[4];
		const tookOffice = parseDate(tookOfficeStr);
		const leftOffice = leftOfficeStr ? parseDate(leftOfficeStr) : null;
		if (tookOffice && !isNaN(tookOffice.getTime())) {
			leaders.push({ id, name, tookOffice, leftOffice, tookOfficeStr, leftOfficeStr });
		}
	}

	// Sort by tookOffice, then by leftOffice descending (longest first)
	leaders.sort((a, b) => {
		const d = a.tookOffice - b.tookOffice;
		if (d !== 0) return d;
		if (!a.leftOffice || !b.leftOffice) return 0;
		return b.leftOffice - a.leftOffice;
	});

	// Find all overlapping pairs (not just consecutive) using a sweep approach.
	// For each leader, check if their tookOffice falls within any previously-seen
	// leader's range. We track the "latest leftOffice seen so far" and the leader
	// responsible for it.
	const fileOverlaps = [];
	let maxLeft = null;
	let maxLeftLeader = null;

	for (let i = 0; i < leaders.length; i++) {
		const curr = leaders[i];
		if (maxLeft && curr.tookOffice < maxLeft) {
			const overlapEnd = curr.leftOffice && curr.leftOffice < maxLeft ? curr.leftOffice : maxLeft;
			const overlapMs = overlapEnd - curr.tookOffice;
			const overlapDays = Math.ceil(overlapMs / (1000 * 60 * 60 * 24));
			fileOverlaps.push({
				a: maxLeftLeader,
				b: curr,
				overlapDays,
				overlapStart: curr.tookOffice,
				overlapEnd,
			});
		}
		if (curr.leftOffice && (!maxLeft || curr.leftOffice > maxLeft)) {
			maxLeft = curr.leftOffice;
			maxLeftLeader = curr;
		}
	}

	if (fileOverlaps.length > 0) {
		console.log(`======================================================================`);
		console.log(`FILE: ${fileName} (${fileOverlaps.length} overlap(s))`);
		console.log(`======================================================================`);

		for (const { a, b, overlapDays, overlapStart, overlapEnd } of fileOverlaps) {
			totalOverlaps++;
			console.log(`\n  #${totalOverlaps}: ${overlapDays} day(s) overlap (${fmt(overlapStart)} – ${fmt(overlapEnd)})`);
			console.log(`    A: id ${a.id}  ${a.name}`);
			console.log(`       ${a.tookOfficeStr}  →  ${a.leftOfficeStr}`);
			console.log(`    B: id ${b.id}  ${b.name}`);
			console.log(`       ${b.tookOfficeStr}  →  ${b.leftOfficeStr}`);
		}
		console.log('');
	}
}

console.log(`======================================================================`);
console.log(`TOTAL OVERLAPS: ${totalOverlaps}`);
console.log(`======================================================================`);
