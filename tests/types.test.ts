import { describe, expect, it } from "vitest";
import { createMockLeader } from "./factories";
import {
	getLeadersByDate,
	getLeaningColors,
	leaningLabels,
	leanings,
} from "~/data/types";

describe("getLeadersByDate", () => {
	it("returns leaders in office on the given date", () => {
		const leader = createMockLeader({
			tookOffice: new Date(2000, 0, 1),
			leftOffice: new Date(2004, 0, 1),
		});
		const result = getLeadersByDate([leader], new Date(2002, 5, 15));
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe(leader.name);
	});

	it("excludes leaders who left office before the date", () => {
		const leader = createMockLeader({
			tookOffice: new Date(2000, 0, 1),
			leftOffice: new Date(2004, 0, 1),
		});
		const result = getLeadersByDate([leader], new Date(2005, 0, 1));
		expect(result).toHaveLength(0);
	});

	it("excludes leaders who took office after the date", () => {
		const leader = createMockLeader({
			tookOffice: new Date(2010, 0, 1),
			leftOffice: new Date(2014, 0, 1),
		});
		const result = getLeadersByDate([leader], new Date(2005, 0, 1));
		expect(result).toHaveLength(0);
	});

	it("includes leaders with null leftOffice (still in office)", () => {
		const leader = createMockLeader({
			tookOffice: new Date(2020, 0, 1),
			leftOffice: null,
		});
		const result = getLeadersByDate([leader], new Date());
		expect(result).toHaveLength(1);
	});

	it("includes leader on exact tookOffice date", () => {
		const leader = createMockLeader({
			tookOffice: new Date(2000, 0, 1),
			leftOffice: new Date(2004, 0, 1),
		});
		const result = getLeadersByDate([leader], new Date(2000, 0, 1));
		expect(result).toHaveLength(1);
	});

	it("includes leader on exact leftOffice date", () => {
		const leader = createMockLeader({
			tookOffice: new Date(2000, 0, 1),
			leftOffice: new Date(2004, 0, 1),
		});
		const result = getLeadersByDate([leader], new Date(2004, 0, 1));
		expect(result).toHaveLength(1);
	});

	it("returns empty array when no leaders match", () => {
		const result = getLeadersByDate([], new Date(2000, 0, 1));
		expect(result).toEqual([]);
	});
});

describe("getLeaningColors", () => {
	it("returns global colors for default scheme", () => {
		const colors = getLeaningColors("default");
		expect(colors[1]).toBe("rgb(157,0,0)"); // FAR_LEFT
		expect(colors[6]).toBe("rgb(28,133,196)"); // RIGHT
	});

	it("returns inverted colors for inverted scheme", () => {
		const colors = getLeaningColors("inverted");
		expect(colors[7]).toBe("rgb(157,0,0)"); // FAR_RIGHT gets far-left color
		expect(colors[1]).toBe("rgb(0,96,147)"); // FAR_LEFT gets far-right color
	});

	it("both schemes have entries for all 10 leanings", () => {
		const defaultColors = getLeaningColors("default");
		const invertedColors = getLeaningColors("inverted");
		for (let i = 0; i <= 9; i++) {
			expect(defaultColors[i as keyof typeof defaultColors]).toBeDefined();
			expect(invertedColors[i as keyof typeof invertedColors]).toBeDefined();
		}
	});
});

describe("constants", () => {
	it("leanings has expected keys", () => {
		expect(leanings.NONE).toBe(0);
		expect(leanings.FAR_LEFT).toBe(1);
		expect(leanings.FAR_RIGHT).toBe(7);
		expect(leanings.MILITARY).toBe(8);
		expect(leanings.MONARCHY).toBe(9);
	});

	it("leaningLabels has a label for every leaning value", () => {
		for (const value of Object.values(leanings)) {
			expect(
				leaningLabels[value as keyof typeof leaningLabels],
			).toBeDefined();
		}
	});
});
