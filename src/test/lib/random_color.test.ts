import { describe, expect, it } from "vitest";
import { generateColorPair, lightenColor } from "@/lib/random_color";

describe("lightenColor", () => {
	it("returns values >= originals", () => {
		const result = lightenColor(100, 50, 200, 0.4);
		expect(result.r).toBeGreaterThanOrEqual(100);
		expect(result.g).toBeGreaterThanOrEqual(50);
		expect(result.b).toBeGreaterThanOrEqual(200);
	});

	it("clamps at 255", () => {
		const result = lightenColor(250, 250, 250, 0.9);
		expect(result.r).toBeLessThanOrEqual(255);
		expect(result.g).toBeLessThanOrEqual(255);
		expect(result.b).toBeLessThanOrEqual(255);
	});

	it("amount=0 returns same values", () => {
		const result = lightenColor(100, 150, 200, 0);
		expect(result.r).toBe(100);
		expect(result.g).toBe(150);
		expect(result.b).toBe(200);
	});
});

describe("generateColorPair", () => {
	it("returns valid 7-char hex strings (#rrggbb)", () => {
		const pair = generateColorPair();
		expect(pair.original).toMatch(/^#[0-9a-f]{6}$/);
		expect(pair.lighter).toMatch(/^#[0-9a-f]{6}$/);
	});

	it("lighter color differs from original", () => {
		// Run multiple times to reduce flakiness from random identical colors
		let differed = false;
		for (let i = 0; i < 10; i++) {
			const pair = generateColorPair();
			if (pair.lighter !== pair.original) {
				differed = true;
				break;
			}
		}
		expect(differed).toBe(true);
	});
});
