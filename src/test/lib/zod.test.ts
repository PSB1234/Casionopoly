import { describe, expect, it } from "vitest";
import { ChatSchema, createRoomSchema } from "@/lib/zod";

describe("createRoomSchema", () => {
	it("valid public room passes", () => {
		const result = createRoomSchema.safeParse({
			roomName: "Test Room",
			type: "public",
		});
		expect(result.success).toBe(true);
	});

	it("valid private room with password passes", () => {
		const result = createRoomSchema.safeParse({
			roomName: "Secret Room",
			type: "private",
			password: "pass1234",
		});
		expect(result.success).toBe(true);
	});

	it("rejects room name < 3 chars", () => {
		const result = createRoomSchema.safeParse({
			roomName: "AB",
			type: "public",
		});
		expect(result.success).toBe(false);
	});

	it("rejects room name > 20 chars", () => {
		const result = createRoomSchema.safeParse({
			roomName: "A".repeat(21),
			type: "public",
		});
		expect(result.success).toBe(false);
	});

	it("rejects invalid type", () => {
		const result = createRoomSchema.safeParse({
			roomName: "Good Name",
			type: "secret",
		});
		expect(result.success).toBe(false);
	});
});

describe("ChatSchema", () => {
	it("valid message passes", () => {
		const result = ChatSchema.safeParse({ message: "Hello world" });
		expect(result.success).toBe(true);
	});

	it("empty string fails", () => {
		const result = ChatSchema.safeParse({ message: "" });
		expect(result.success).toBe(false);
	});
});
