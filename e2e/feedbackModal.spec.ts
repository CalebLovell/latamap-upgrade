import { expect, test } from "@playwright/test";

test.describe("Feedback Modal", () => {
	test("opens from the sidebar menu and closes when empty", async ({ page }) => {
		await page.goto("/?menu=true");
		await page.waitForLoadState("networkidle");
		await page
			.getByRole("dialog")
			.getByRole("button", { name: "Send Feedback" })
			.click();

		const feedbackDialog = page
			.getByRole("dialog")
			.filter({ has: page.getByRole("heading", { name: "Send Feedback" }) });
		await expect(feedbackDialog).toBeVisible();

		await feedbackDialog.getByRole("button", { name: "Close" }).click();
		await expect(
			page.getByRole("heading", { name: "Send Feedback" }),
		).not.toBeVisible();
	});

	test("asks for confirmation before discarding unsaved text", async ({
		page,
	}) => {
		await page.goto("/?feedbackModal=true");
		await page.waitForLoadState("networkidle");
		const dialog = page.getByRole("dialog");
		await expect(
			dialog.getByRole("heading", { name: "Send Feedback" }),
		).toBeVisible();
		await page
			.getByPlaceholder("Type your feedback here...")
			.fill("Don't lose this");

		page.once("dialog", (d) => d.dismiss());
		await dialog.getByRole("button", { name: "Close" }).click();
		await expect(
			dialog.getByRole("heading", { name: "Send Feedback" }),
		).toBeVisible();

		page.once("dialog", (d) => d.accept());
		await dialog.getByRole("button", { name: "Close" }).click();
		await expect(
			page.getByRole("heading", { name: "Send Feedback" }),
		).not.toBeVisible();
	});

	test("submits feedback and surfaces a failure, without ever contacting the real email service", async ({
		page,
	}) => {
		// Server functions run on the dev server itself, so this request never
		// reaches the browser's network stack for real -- blocking it here keeps
		// the test from ever triggering a live Resend email send.
		await page.route("**/_serverFn/**", (route) =>
			route.fulfill({
				status: 500,
				contentType: "text/plain",
				body: "blocked in e2e",
			}),
		);

		await page.goto("/?feedbackModal=true");
		await page.waitForLoadState("networkidle");
		await page
			.getByPlaceholder("Type your feedback here...")
			.fill("E2E test feedback");
		await page
			.getByPlaceholder("Your email (optional)")
			.fill("e2e@example.com");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect(
			page.getByText("Something went wrong. Please try again."),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Send Feedback" }),
		).toBeVisible();
	});
});
