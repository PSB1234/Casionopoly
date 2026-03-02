import { describe, expect, it } from "vitest";
import TileDataJson, { getNameOfPropertyById } from "@/lib/tiledata";

describe("TileDataJson", () => {
	it("has exactly 32 tiles", () => {
		expect(TileDataJson).toHaveLength(32);
	});

	it("IDs are sequential 0-31", () => {
		for (let i = 0; i < 32; i++) {
			expect(TileDataJson[i]?.id).toBe(i);
		}
	});

	it('first tile (id=0) is "Start" with type "start"', () => {
		const start = TileDataJson[0];
		expect(start).toBeDefined();
		expect(start?.name).toBe("Start");
		expect(start?.type).toBe("start");
	});

	it("all buyable tiles have a price > 0", () => {
		const buyable = TileDataJson.filter((t) => t.buyable);
		expect(buyable.length).toBeGreaterThan(0);
		for (const tile of buyable) {
			expect(tile.price).toBeGreaterThan(0);
		}
	});
});

describe("getNameOfPropertyById", () => {
	it('returns "Paris" for id 1', () => {
		expect(getNameOfPropertyById(1)).toBe("Paris");
	});

	it('returns "Unknown Property" for non-existent id', () => {
		expect(getNameOfPropertyById(999)).toBe("Unknown Property");
	});
});
