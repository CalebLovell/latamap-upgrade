import { describe, expect, it } from "vitest";
import { formatDateParam, parseDateParam } from "~/utils/date";

describe("formatDateParam", () => {
	it("formats a date as YYYY-MM-DD", () => {
		expect(formatDateParam(new Date(2024, 0, 15))).toBe("2024-01-15");
	});

	it("pads single-digit month and day", () => {
		expect(formatDateParam(new Date(2000, 2, 5))).toBe("2000-03-05");
	});

	it("handles December 31st", () => {
		expect(formatDateParam(new Date(1999, 11, 31))).toBe("1999-12-31");
	});
});

describe("parseDateParam", () => {
	it("parses a valid YYYY-MM-DD string", () => {
		const result = parseDateParam("2024-01-15");
		expect(result.getFullYear()).toBe(2024);
		expect(result.getMonth()).toBe(0);
		expect(result.getDate()).toBe(15);
	});

	it("clamps dates before 1789 to Jan 1 1789", () => {
		const result = parseDateParam("1700-06-15");
		expect(result.getFullYear()).toBe(1789);
		expect(result.getMonth()).toBe(0);
		expect(result.getDate()).toBe(1);
	});

	it("clamps future dates to today", () => {
		const result = parseDateParam("2099-01-01");
		const now = new Date();
		expect(result.getTime()).toBeLessThanOrEqual(now.getTime());
	});

	it("returns current date for invalid input", () => {
		const before = new Date();
		const result = parseDateParam("not-a-date");
		const after = new Date();
		expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
		expect(result.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
	});

	it("roundtrips with formatDateParam", () => {
		const original = new Date(2020, 5, 15);
		const formatted = formatDateParam(original);
		const parsed = parseDateParam(formatted);
		expect(parsed.getFullYear()).toBe(2020);
		expect(parsed.getMonth()).toBe(5);
		expect(parsed.getDate()).toBe(15);
	});
});
