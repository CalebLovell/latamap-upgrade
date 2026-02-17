import { describe, expect, it } from "vitest";
import { events } from "~/data/events";

describe("events", () => {
	it("is a non-empty array", () => {
		expect(events.length).toBeGreaterThan(0);
	});

	it("every event has required fields", () => {
		for (const event of events) {
			expect(event.title).toBeTruthy();
			expect(event.date).toBeInstanceOf(Date);
			expect(event.country).toBeTruthy();
			expect(event.description).toBeTruthy();
		}
	});

	it("events are in chronological order", () => {
		for (let i = 1; i < events.length; i++) {
			expect(events[i].date.getTime()).toBeGreaterThanOrEqual(
				events[i - 1].date.getTime(),
			);
		}
	});

	it("all event dates are valid", () => {
		for (const event of events) {
			expect(Number.isNaN(event.date.getTime())).toBe(false);
		}
	});

	it("no duplicate titles", () => {
		const titles = events.map((e) => e.title);
		expect(new Set(titles).size).toBe(titles.length);
	});
});
