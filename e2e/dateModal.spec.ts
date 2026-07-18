import { expect, test } from "@playwright/test";

test.describe("Date Modal", () => {
	test("opens from the header and changes the selected date", async ({
		page,
	}) => {
		await page.goto("/?date=2000-01-15");
		await page.waitForLoadState("networkidle");
		await page.getByTitle("Pick New Date").click();

		const dialog = page.getByRole("dialog");
		await expect(
			dialog.getByRole("heading", { name: "January 15th, 2000" }),
		).toBeVisible();

		await dialog.getByRole("button", { name: "Select a Year" }).click();
		await page.getByRole("option", { name: "2005", exact: true }).click();

		await dialog.getByRole("button", { name: "Select a Month" }).click();
		await page.getByRole("option", { name: "March", exact: true }).click();

		await dialog.getByRole("button", { name: "Select a Day" }).click();
		await page.getByRole("option", { name: "3rd", exact: true }).click();

		await expect(
			dialog.getByRole("heading", { name: "March 3rd, 2005" }),
		).toBeVisible();
		await expect(page).toHaveURL(/date=2005-03-03/);
	});

	test("clamps the day when switching to a shorter month", async ({
		page,
	}) => {
		await page.goto("/?dateModal=true&date=2020-01-31");
		await page.waitForLoadState("networkidle");
		const dialog = page.getByRole("dialog");
		await expect(
			dialog.getByRole("heading", { name: "January 31st, 2020" }),
		).toBeVisible();

		await dialog.getByRole("button", { name: "Select a Month" }).click();
		await page.getByRole("option", { name: "February", exact: true }).click();

		// 2020 is a leap year, so Jan 31st clamps to Feb 29th, not Feb 28th.
		await expect(
			dialog.getByRole("heading", { name: "February 29th, 2020" }),
		).toBeVisible();
		await expect(page).toHaveURL(/date=2020-02-29/);
	});

	test("closes with the Close button", async ({ page }) => {
		await page.goto("/?dateModal=true");
		await page.waitForLoadState("networkidle");
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();
		await dialog.getByRole("button", { name: "Close" }).click();
		await expect(dialog).not.toBeVisible();
	});
});
