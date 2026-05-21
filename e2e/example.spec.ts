import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
	test("page loads with correct title", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/Industrial.io/);
	});

	test("main menu buttons are visible", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("START GAME")).toBeVisible();
		await expect(page.getByText("Quick join")).toBeVisible();
		await expect(page.getByText("Join Room")).toBeVisible();
	});
});
