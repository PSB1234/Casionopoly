import { expect, test } from "@playwright/test";

test.describe("Create Room", () => {
	test("create room dialog opens on button click", async ({ page }) => {
		await page.goto("/");
		await page.getByText("START GAME").click();
		await expect(page.getByText("Create Room")).toBeVisible();
	});

	test("form shows room name input and type selector", async ({ page }) => {
		await page.goto("/");
		await page.getByText("START GAME").click();
		await expect(page.getByPlaceholder("Monopoly Game")).toBeVisible();
		await expect(page.getByText("Public")).toBeVisible();
		await expect(page.getByText("Private")).toBeVisible();
	});

	test("selecting private shows password field", async ({ page }) => {
		await page.goto("/");
		await page.getByText("START GAME").click();
		await page.getByText("Private").click();
		await expect(page.getByPlaceholder("Enter password")).toBeVisible();
	});

	test("cannot submit with empty room name", async ({ page }) => {
		await page.goto("/");
		await page.getByText("START GAME").click();
		// Try to submit without filling in room name
		await page.getByRole("button", { name: "Create" }).click();
		// The dialog should remain open (form validation prevents submission)
		await expect(page.getByText("Create Room")).toBeVisible();
	});
});
