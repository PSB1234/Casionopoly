import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSocketStore } from "@/store/socket_store";

describe("useSocketStore", () => {
	beforeEach(() => {
		useSocketStore.setState({
			socket: null,
			isConnected: false,
			rooms: [],
		});
	});

	it("initial state: socket null, isConnected false, rooms empty", () => {
		const state = useSocketStore.getState();
		expect(state.socket).toBeNull();
		expect(state.isConnected).toBe(false);
		expect(state.rooms).toEqual([]);
	});

	it("setRooms / getRooms round-trips", () => {
		const rooms = [
			{ roomKey: "123456", name: "Test Room" },
			{ roomKey: "654321", name: "Other Room" },
		];
		useSocketStore.getState().setRooms(rooms);
		expect(useSocketStore.getState().getRooms()).toEqual(rooms);
	});

	it("getSocket returns null when uninitialized", () => {
		const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const socket = useSocketStore.getState().getSocket();
		expect(socket).toBeNull();
		consoleSpy.mockRestore();
	});

	it("emitEvent warns when socket not connected", () => {
		const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		useSocketStore
			.getState()
			.emitEvent("SEND_MESSAGE" as never, ...([] as never));
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining("Socket not connected"),
		);
		consoleSpy.mockRestore();
	});
});
