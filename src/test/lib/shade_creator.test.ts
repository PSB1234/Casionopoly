import { describe, expect, it } from "vitest";
import { adjustColorShade } from "@/lib/shade_creator";

describe("adjustColorShade", () => {
	it("lightens a color by positive percent", () => {
		const result = adjustColorShade("#3498db", 20);
		// Each channel should increase: r=52→62, g=152→182, b=219→262→clamped 255
		expect(result).toMatch(/^#[0-9a-f]{6}$/);
		// The result should be brighter (higher hex values)
		const origR = 0x34;
		const newR = Number.parseInt(result.slice(1, 3), 16);
		expect(newR).toBeGreaterThan(origR);
	});

	it("darkens a color by negative percent", () => {
		const result = adjustColorShade("#3498db", -20);
		expect(result).toMatch(/^#[0-9a-f]{6}$/);
		const origR = 0x34;
		const newR = Number.parseInt(result.slice(1, 3), 16);
		expect(newR).toBeLessThan(origR);
	});

	it("clamps at 255 (white stays white)", () => {
		const result = adjustColorShade("#ffffff", 50);
		// All channels would exceed 255, should clamp
		expect(result).toBe("#ffffff");
	});

	it("clamps at 0 (black stays black with negative)", () => {
		const result = adjustColorShade("#000000", -50);
		expect(result).toBe("#000000");
	});

	it("handles 3-char hex", () => {
		const result = adjustColorShade("#fff", 0);
		expect(result).toBe("#ffffff");
	});

	it("handles hex with # prefix", () => {
		const result = adjustColorShade("#3498db", 0);
		expect(result).toMatch(/^#[0-9a-f]{6}$/);
		expect(result).toBe("#3498db");
	});
});
