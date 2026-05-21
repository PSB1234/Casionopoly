import { describe, expect, it } from "vitest";
import { generateRoomId } from "@/lib/helper";

describe("generateRoomId", () => {
	it("returns a 6-digit string", () => {
		const id = generateRoomId(new Map());
		expect(id).toMatch(/^\d{6}$/);
	});

	it("does not return a key already in the map", () => {
		const existing = new Map<string, Set<string>>();
		// Fill with many keys to stress-test collision avoidance
		for (let i = 100000; i < 100010; i++) {
			existing.set(i.toString(), new Set());
		}
		const id = generateRoomId(existing);
		expect(existing.has(id)).toBe(false);
	});

	it("works with empty map", () => {
		const id = generateRoomId(new Map());
		expect(id).toMatch(/^\d{6}$/);
	});
});
