import fs from 'fs';
import path from 'path';

const SEED_DIR = path.join(process.cwd(), 'prisma', 'seed');
const BT = String.fromCharCode(96);

function parseDate(str) {
	if (!str) return null;

	const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})T/);
	if (isoMatch) {
		return new Date(Date.UTC(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3]));
	}

	const mdyMatch = str.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
	if (mdyMatch) {
		const month = monthToNum(mdyMatch[1]);
		if (month === -1) return null;
		return new Date(Date.UTC(+mdyMatch[3], month, +mdyMatch[2]));
	}

	const dmyMatch = str.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
	if (dmyMatch) {
		const month = monthToNum(dmyMatch[2]);
		if (month === -1) return null;
		return new Date(Date.UTC(+dmyMatch[3], month, +dmyMatch[1]));
	}

	return null;
}

function monthToNum(name) {
	const months = {
		january: 0, february: 1, march: 2, april: 3,
		may: 4, june: 5, july: 6, august: 7,
		september: 8, october: 9, november: 10, december: 11,
	};
	return months[name.toLowerCase()] ?? -1;
}

function daysDiff(a, b) {
	const MS_PER_DAY = 86400000;
	return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

function parseLeaders(content) {
	const leaders = [];
	const reStr = '\\{[^{}]*?\\bid\\s*:\\s*(\\d+)\\b[^{}]*?\\bname\\s*:\\s*' + BT + '([^' + BT + ']*)' + BT + '[^{}]*?\\btookOffice\\s*:\\s*' + BT + '([^' + BT + ']*)' + BT + '[^{}]*?\\bleftOffice\\s*:\\s*(?:' + BT + '([^' + BT + ']*)' + BT + '|null)[^{}]*?\\}';
	const blockRegex = new RegExp(reStr, 'gs');

	let match;
	while ((match = blockRegex.exec(content)) !== null) {
		const id = parseInt(match[1], 10);
		const name = match[2];
		const tookOfficeStr = match[3];
		const leftOfficeStr = match[4] || null;

		const tookOfficeDate = parseDate(tookOfficeStr);
		const leftOfficeDate = leftOfficeStr ? parseDate(leftOfficeStr) : null;

		leaders.push({
			id, name,
			tookOffice: tookOfficeStr,
			leftOffice: leftOfficeStr,
			tookOfficeDate,
			leftOfficeDate,
		});
	}

	return leaders;
}

function processFile(filePath) {
	const country = path.basename(filePath, '.ts');
	let content = fs.readFileSync(filePath, 'utf-8');
	const leaders = parseLeaders(content);

	if (leaders.length === 0) return [];

	const sorted = leaders
		.filter(l => l.tookOfficeDate !== null)
		.sort((a, b) => a.tookOfficeDate.getTime() - b.tookOfficeDate.getTime());

	const changes = [];

	for (let i = 0; i < sorted.length - 1; i++) {
		const current = sorted[i];
		const next = sorted[i + 1];

		if (!current.leftOfficeDate || !current.leftOffice) continue;
		if (!next.tookOfficeDate || !next.tookOffice) continue;

		const gap = daysDiff(current.leftOfficeDate, next.tookOfficeDate);

		if (gap === 1) {
			const oldLeftOffice = current.leftOffice;
			const newLeftOffice = next.tookOffice;

			const idStr = String(current.id);
			const escapedOld = oldLeftOffice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

			const patternStr = '(\\bid\\s*:\\s*' + idStr + '\\b[^}]*?leftOffice\\s*:\\s*)' + BT + escapedOld + BT;
			const pattern = new RegExp(patternStr);

			const replacement = '$1' + BT + newLeftOffice + BT;
			const replaced = content.replace(pattern, replacement);

			if (replaced !== content) {
				content = replaced;
				changes.push({
					country,
					id: current.id,
					name: current.name,
					oldLeftOffice,
					newLeftOffice,
				});
			}
		}
	}

	if (changes.length > 0) {
		fs.writeFileSync(filePath, content, 'utf-8');
	}

	return changes;
}

// Main
const files = fs.readdirSync(SEED_DIR)
	.filter(f => f.endsWith('.ts'))
	.map(f => path.join(SEED_DIR, f));

let totalFixes = 0;
const allChanges = [];

for (const file of files) {
	const changes = processFile(file);
	allChanges.push(...changes);
	totalFixes += changes.length;
}

if (allChanges.length === 0) {
	console.log('No 1-day gaps found.');
} else {
	console.log('=== 1-Day Gap Fixes ===\n');
	for (const c of allChanges) {
		console.log('[' + c.country + '] id=' + c.id + ' (' + c.name + ')');
		console.log('  leftOffice: ' + BT + c.oldLeftOffice + BT + ' -> ' + BT + c.newLeftOffice + BT + '\n');
	}
}

console.log('\nTotal fixes applied: ' + totalFixes);
