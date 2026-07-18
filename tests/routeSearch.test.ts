import { describe, expect, it, vi } from "vitest";

vi.mock("~/env", () => ({ env: { RESEND_API_KEY: "test-key" } }));
vi.mock("~/db", () => ({ prisma: {} }));

const { Route } = await import("~/routes/index");
const validateSearch = Route.options.validateSearch as (
	search: Record<string, unknown>,
) => Record<string, unknown>;

describe("index route validateSearch", () => {
	it("applies defaults for an empty search", () => {
		expect(validateSearch({})).toEqual({
			menu: false,
			timeline: false,
			key: true,
			panel: true,
			dateModal: false,
			disclaimerModal: false,
			feedbackModal: false,
			scheme: "default",
			date: expect.any(String),
			country: "United States of America",
		});
	});

	it("only recognizes the exact boolean literal, not truthy/falsy lookalikes", () => {
		// menu/timeline require === true to flip on; any other value defaults false.
		const result = validateSearch({
			menu: "yes",
			timeline: 1,
			key: "no",
			panel: 0,
		});
		expect(result.menu).toBe(false);
		expect(result.timeline).toBe(false);
		// key/panel require === false to flip off; any other value defaults true.
		expect(result.key).toBe(true);
		expect(result.panel).toBe(true);
	});

	it("only flips key/panel to false with an explicit false, and menu/timeline to true with an explicit true", () => {
		const result = validateSearch({
			menu: true,
			timeline: true,
			key: false,
			panel: false,
		});
		expect(result).toMatchObject({
			menu: true,
			timeline: true,
			key: false,
			panel: false,
		});
	});

	it("falls back to the default scheme for any value other than 'inverted'", () => {
		expect(validateSearch({ scheme: "inverted" }).scheme).toBe("inverted");
		expect(validateSearch({ scheme: "default" }).scheme).toBe("default");
		expect(validateSearch({ scheme: "bogus" }).scheme).toBe("default");
		expect(validateSearch({ scheme: 123 }).scheme).toBe("default");
	});

	it("passes through a string date as-is", () => {
		expect(validateSearch({ date: "2020-06-15" }).date).toBe("2020-06-15");
	});

	it("falls back to today's date for a non-string date", () => {
		const result = validateSearch({ date: 12345 });
		expect(typeof result.date).toBe("string");
		expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("accepts a country that exists in countryNames", () => {
		expect(validateSearch({ country: "Brazil" }).country).toBe("Brazil");
	});

	it("falls back to the default country for an unknown country name", () => {
		expect(validateSearch({ country: "Narnia" }).country).toBe(
			"United States of America",
		);
	});

	it("falls back to the default country for a non-string value", () => {
		expect(validateSearch({ country: 42 }).country).toBe(
			"United States of America",
		);
	});
});
