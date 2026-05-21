import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
	test("search room page loads", async ({ page }) => {
		await page.goto("/searchRoom");
		// Page should load without error
		await expect(page).toHaveURL(/searchRoom/);
	});

	test("/room/invalid-id shows appropriate state", async ({ page }) => {
		await page.goto("/room/invalid-id");
		// The room page should load (even if empty/no players)
		await expect(page).toHaveURL(/room\/invalid-id/);
	});
});
