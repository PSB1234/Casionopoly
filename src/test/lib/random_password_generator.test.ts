import { describe, expect, it } from "vitest";
import { generatePassword, randomIndex } from "@/lib/random_password_generator";

describe("generatePassword", () => {
	it("has length exactly 20", () => {
		expect(generatePassword()).toHaveLength(20);
	});

	it("contains at least one uppercase letter", () => {
		const pw = generatePassword();
		expect(pw).toMatch(/[A-Z]/);
	});

	it("contains at least one lowercase letter", () => {
		const pw = generatePassword();
		expect(pw).toMatch(/[a-z]/);
	});

	it("contains at least one digit", () => {
		const pw = generatePassword();
		expect(pw).toMatch(/[0-9]/);
	});

	it("contains at least one symbol", () => {
		const pw = generatePassword();
		expect(pw).toMatch(/[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/);
	});
});

describe("randomIndex", () => {
	it("returns values in [0, max) range", () => {
		for (let i = 0; i < 100; i++) {
			const val = randomIndex(10);
			expect(val).toBeGreaterThanOrEqual(0);
			expect(val).toBeLessThan(10);
		}
	});
});
