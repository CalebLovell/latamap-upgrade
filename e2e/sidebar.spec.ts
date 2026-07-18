import { expect, test } from "@playwright/test";

test.describe("Sidebar Menu", () => {
	test("opens from the header and lists map controls", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await page.getByTitle("Open Menu").click();

		const sidebar = page.getByRole("dialog");
		await expect(
			sidebar.getByRole("button", { name: "Select a Date" }),
		).toBeVisible();
		await expect(
			sidebar.getByRole("button", { name: "Invert Color Scheme" }),
		).toBeVisible();
		await expect(
			sidebar.getByRole("button", { name: "Toggle Map Key" }),
		).toBeVisible();
		await expect(
			sidebar.getByRole("button", { name: "Toggle Data Panel" }),
		).toBeVisible();
	});

	test("closes via the Close button", async ({ page }) => {
		await page.goto("/?menu=true");
		await page.waitForLoadState("networkidle");
		const sidebar = page.getByRole("dialog");
		await expect(sidebar).toBeVisible();
		await sidebar.getByRole("button", { name: "Close" }).click();
		await expect(sidebar).not.toBeVisible();
	});

	test("Select a Date opens the date modal and closes the menu", async ({
		page,
	}) => {
		await page.goto("/?menu=true");
		await page.waitForLoadState("networkidle");
		const sidebar = page
			.getByRole("dialog")
			.filter({ has: page.getByRole("button", { name: "Select a Date" }) });
		await sidebar.getByRole("button", { name: "Select a Date" }).click();

		const dateDialog = page
			.getByRole("dialog")
			.filter({ has: page.getByRole("button", { name: "Select a Year" }) });
		await expect(dateDialog).toBeVisible();
		await expect(sidebar).not.toBeVisible();
	});

	test("Invert Color Scheme updates the URL search param", async ({
		page,
	}) => {
		await page.goto("/?menu=true");
		await page.waitForLoadState("networkidle");
		await page
			.getByRole("dialog")
			.getByRole("button", { name: "Invert Color Scheme" })
			.click();
		await expect(page).toHaveURL(/scheme=inverted/);
	});

	test("Toggle Map Key hides and re-shows the legend", async ({ page }) => {
		await page.goto("/?menu=true");
		await page.waitForLoadState("networkidle");
		await expect(page.getByText("Monarchy")).toBeVisible();

		await page
			.getByRole("dialog")
			.getByRole("button", { name: "Toggle Map Key" })
			.click();
		await expect(page.getByText("Monarchy")).not.toBeVisible();
	});
});
