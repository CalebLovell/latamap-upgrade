import fs from 'fs';
import path from 'path';

const seedDir = path.join(process.cwd(), 'prisma', 'seed');

// ── CLOSE_GAP: adjust leftOffice of leader to match tookOffice of next leader ──
// These are confirmed transitions where the gap is just a source date discrepancy
const closeGaps = [
	// Bolivia
	{ file: 'bolivia.ts', id: 3007, newLeftOffice: '26 December 1828' },
	{ file: 'bolivia.ts', id: 3010, newLeftOffice: '22 February 1839' },
	{ file: 'bolivia.ts', id: 3013, newLeftOffice: '27 September 1841' },
	{ file: 'bolivia.ts', id: 3015, newLeftOffice: '18 January 1848' },
	{ file: 'bolivia.ts', id: 3026, newLeftOffice: '19 January 1880' },
	// Chile
	{ file: 'chile.ts', id: 6019, newLeftOffice: '16 February 1817' },
	{ file: 'chile.ts', id: 6025, newLeftOffice: '8 May 1827' }, // Wikipedia confirms Freire served until May
	{ file: 'chile.ts', id: 6031, newLeftOffice: '24 December 1829' },
	// Colombia - same person, constitutional transition
	{ file: 'colombia.ts', id: 7019, newLeftOffice: '14 May 1863' },
	// Costa Rica
	{ file: 'costa-rica.ts', id: 8028, newLeftOffice: '10 August 1870' },
	// Cuba - Treaty of Paris → US occupation
	{ file: 'cuba.ts', id: 9000, newLeftOffice: '1 January 1899' },
	// Dominican Republic - civil war transitions
	{ file: 'dominican-republic.ts', id: 10087, newLeftOffice: '7 May 1965' },
	{ file: 'dominican-republic.ts', id: 10088, newLeftOffice: '3 September 1965' },
	// Ecuador
	{ file: 'ecuador.ts', id: 11010, newLeftOffice: '4 September 1859' },
	{ file: 'ecuador.ts', id: 11011, newLeftOffice: '17 January 1861' },
	{ file: 'ecuador.ts', id: 11023, newLeftOffice: '14 January 1883' },
	{ file: 'ecuador.ts', id: 11045, newLeftOffice: '10 January 1926' },
	{ file: 'ecuador.ts', id: 11046, newLeftOffice: '3 April 1926' },
	// El Salvador
	{ file: 'el-salvador.ts', id: 12089, newLeftOffice: '4 December 1931' },
	// Haiti - all revolutionary transitions, no recognized interim leader
	{ file: 'haiti.ts', id: 15006, newLeftOffice: '18 October 1820' },
	{ file: 'haiti.ts', id: 15011, newLeftOffice: '2 March 1847' },
	{ file: 'haiti.ts', id: 15014, newLeftOffice: '20 March 1867' },
	{ file: 'haiti.ts', id: 15015, newLeftOffice: '4 May 1867' },
	{ file: 'haiti.ts', id: 15019, newLeftOffice: '23 April 1876' },
	{ file: 'haiti.ts', id: 15020, newLeftOffice: '26 July 1879' },
	{ file: 'haiti.ts', id: 15026, newLeftOffice: '31 March 1896' },
	{ file: 'haiti.ts', id: 15028, newLeftOffice: '21 December 1902' },
	{ file: 'haiti.ts', id: 15029, newLeftOffice: '6 December 1908' },
	{ file: 'haiti.ts', id: 15030, newLeftOffice: '15 August 1911' },
	{ file: 'haiti.ts', id: 15032, newLeftOffice: '12 May 1913' },
	{ file: 'haiti.ts', id: 15033, newLeftOffice: '8 February 1914' },
	{ file: 'haiti.ts', id: 15034, newLeftOffice: '7 November 1914' },
	{ file: 'haiti.ts', id: 15035, newLeftOffice: '25 February 1915' },
	{ file: 'haiti.ts', id: 15036, newLeftOffice: '12 August 1915' },
	{ file: 'haiti.ts', id: 15046, newLeftOffice: '7 February 1957' },
	// Nicaragua
	{ file: 'nicaragua.ts', id: 19038, newLeftOffice: '11 November 1851' },
	{ file: 'nicaragua.ts', id: 19057, newLeftOffice: '5 August 1889' },
	{ file: 'nicaragua.ts', id: 19060, newLeftOffice: '25 July 1893' },
	{ file: 'nicaragua.ts', id: 19072, newLeftOffice: '14 November 1926' },
	{ file: 'nicaragua.ts', id: 19080, newLeftOffice: '21 May 1950' },
	// Panama - same person, constitutional transition (mirrors Colombia)
	{ file: 'panama.ts', id: 20019, newLeftOffice: '14 May 1863' },
	{ file: 'panama.ts', id: 20042, newLeftOffice: '29 December 1907' },
	// Paraguay
	{ file: 'paraguay.ts', id: 21048, newLeftOffice: '15 August 1937' },
	// Peru
	{ file: 'peru.ts', id: 22006, newLeftOffice: '21 December 1833' },
	{ file: 'peru.ts', id: 22012, newLeftOffice: '27 March 1843' },
	{ file: 'peru.ts', id: 22080, newLeftOffice: '17 November 2020' },
	// Suriname
	{ file: 'suriname.ts', id: 23001, newLeftOffice: '15 August 1980' },
	{ file: 'suriname.ts', id: 23002, newLeftOffice: '8 February 1982' },
	{ file: 'suriname.ts', id: 23004, newLeftOffice: '29 December 1990' },
	// Venezuela
	{ file: 'venezuela.ts', id: 27007, newLeftOffice: '27 July 1835' },
	{ file: 'venezuela.ts', id: 27010, newLeftOffice: '27 January 1837' },
	{ file: 'venezuela.ts', id: 27055, newLeftOffice: '27 November 1950' },
];

// ── FIX DATA ERRORS ──
// These are typos in the existing data (wrong year or month)
const dataFixes = [
	// Bolivia id 3084: years should be 1982, not 1981
	{ file: 'bolivia.ts', id: 3084, field: 'tookOffice', oldValue: '19 July 1981', newValue: '19 July 1982' },
	{ file: 'bolivia.ts', id: 3084, field: 'leftOffice', oldValue: '21 July 1981', newValue: '21 July 1982' },
	// Paraguay id 21036: tookOffice year should be 1912, not 1911
	{ file: 'paraguay.ts', id: 21036, field: 'tookOffice', oldValue: '28 February 1911', newValue: '28 February 1912' },
	// Uruguay id 25045: leftOffice month wrong (Feb should be Mar)
	{ file: 'uruguay.ts', id: 25045, field: 'leftOffice', oldValue: '1 February 1882', newValue: '1 March 1882' },
];

let totalCloseGaps = 0;
let totalDataFixes = 0;

// Group close gaps by file
const closeGapsByFile = {};
for (const gap of closeGaps) {
	if (!closeGapsByFile[gap.file]) closeGapsByFile[gap.file] = [];
	closeGapsByFile[gap.file].push(gap);
}

// Group data fixes by file
const dataFixesByFile = {};
for (const fix of dataFixes) {
	if (!dataFixesByFile[fix.file]) dataFixesByFile[fix.file] = [];
	dataFixesByFile[fix.file].push(fix);
}

// Get all unique files
const allFiles = new Set([...Object.keys(closeGapsByFile), ...Object.keys(dataFixesByFile)]);

for (const fileName of allFiles) {
	const filePath = path.join(seedDir, fileName);
	let content = fs.readFileSync(filePath, 'utf-8');

	// Apply CLOSE_GAP fixes
	const gaps = closeGapsByFile[fileName] || [];
	for (const gap of gaps) {
		// Find the block for this id and replace leftOffice
		const idPattern = new RegExp(
			`(id:\\s*${gap.id},[\\s\\S]*?leftOffice:\\s*\`)([^\`]*?)(\`)`,
		);
		const match = content.match(idPattern);
		if (match) {
			const oldDate = match[2];
			content = content.replace(
				match[0],
				match[1] + gap.newLeftOffice + match[3],
			);
			console.log(`CLOSE_GAP [${fileName}] id ${gap.id}: leftOffice "${oldDate}" → "${gap.newLeftOffice}"`);
			totalCloseGaps++;
		} else {
			console.log(`WARNING: Could not find id ${gap.id} in ${fileName}`);
		}
	}

	// Apply DATA FIX fixes
	const fixes = dataFixesByFile[fileName] || [];
	for (const fix of fixes) {
		const fieldPattern = new RegExp(
			`(id:\\s*${fix.id},[\\s\\S]*?${fix.field}:\\s*\`)${fix.oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\`)`,
		);
		const match = content.match(fieldPattern);
		if (match) {
			content = content.replace(
				match[0],
				match[1] + fix.newValue + match[2],
			);
			console.log(`FIX_DATA [${fileName}] id ${fix.id}: ${fix.field} "${fix.oldValue}" → "${fix.newValue}"`);
			totalDataFixes++;
		} else {
			console.log(`WARNING: Could not find id ${fix.id} ${fix.field} "${fix.oldValue}" in ${fileName}`);
		}
	}

	fs.writeFileSync(filePath, content, 'utf-8');
}

console.log(`\n=== SUMMARY ===`);
console.log(`CLOSE_GAP fixes: ${totalCloseGaps}`);
console.log(`FIX_DATA fixes: ${totalDataFixes}`);
console.log(`Total: ${totalCloseGaps + totalDataFixes}`);
