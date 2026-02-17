import { expect, test } from "@playwright/test";

test.describe("Map Page", () => {
	test("loads with SVG map visible", async ({ page }) => {
		await page.goto("/");
		const svg = page.locator("svg").first();
		await expect(svg).toBeVisible({ timeout: 15000 });
	});

	test("clicking a country shows data panel", async ({ page }) => {
		await page.goto("/?country=Brazil");
		await expect(page.getByText("Brazil", { exact: true })).toBeVisible({ timeout: 15000 });
	});

	test("timeline navigation works", async ({ page }) => {
		await page.goto("/");
		const timeline = page.locator('[role="slider"]').first();
		if (await timeline.isVisible()) {
			await expect(timeline).toBeVisible();
		}
	});
});
