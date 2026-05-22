import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { toast } from "@/components/ui/8bit/toast";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import type {
	ClientToServerEvents,
	RoomData,
	ServerToClientEvents,
} from "@/lib/type";
// Store state
export interface SocketStoreState {
	socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
	isConnected: boolean;
	rooms: RoomData[];
}
// Store actions
export interface SocketStoreActions {
	setRooms: (rooms: RoomData[]) => void;
	getRooms: () => RoomData[];
	getSocket: () => Socket<ServerToClientEvents, ClientToServerEvents> | null;
	connectSocket: (url: string, opts?: Parameters<typeof io>[1]) => void;
	emitEvent: <E extends keyof ClientToServerEvents>(
		eventName: E,
		...args: Parameters<ClientToServerEvents[E]>
	) => void;
	disconnectSocket: () => void;
}
export type SocketStore = SocketStoreState & SocketStoreActions;
export const useSocketStore = create<SocketStore>((set, get) => ({
	socket: null,
	isConnected: false,
	rooms: [],
	connectSocket: (url: string, opts) => {
		const existing = get().socket;
		if (existing?.connected) {
			return; // prevent duplicate connections
		}

		// If socket exists but not connected, clean it up first
		if (existing) {
			existing.off("connect");
			existing.off("disconnect");
			existing.off("connect_error");
			existing.off(SOCKET_EVENTS.GET_ALL_ROOMS);
			existing.off(SOCKET_EVENTS.ERROR);
			existing.off(SOCKET_EVENTS.ROOM_AUTO_DELETED);
			existing.disconnect();
		}

		const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
			// safe defaults; user opts override
			transports: ["websocket"],
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			...opts,
		});
		set({ socket, isConnected: false });

		// Remove any existing listeners before adding new ones (safety)
		socket.off("connect");
		socket.off("disconnect");
		socket.off("connect_error");
		socket.off(SOCKET_EVENTS.GET_ALL_ROOMS);
		socket.off(SOCKET_EVENTS.ERROR);
		socket.off(SOCKET_EVENTS.ROOM_AUTO_DELETED);

		// Now register listeners
		socket.on("connect", () => {
			set({ isConnected: true });
		});
		socket.on("disconnect", (reason) => {
			set({ isConnected: false });
		});
		// Listen for room updates
		socket.on(SOCKET_EVENTS.GET_ALL_ROOMS, (roomsData: RoomData[]) => {
			set({ rooms: roomsData });
		});
		socket.on(SOCKET_EVENTS.ROOM_AUTO_DELETED, (roomKey: string) => {
			set({ rooms: get().rooms.filter((r) => r.roomKey !== roomKey) });
		});
		//handle errors
		socket.on("connect_error", (error) => {
			console.error("Connection error:", error);
			toast("Connection Error", {
				description: "Failed to connect to server. Retrying...",
			});
		});

		socket.on(SOCKET_EVENTS.ERROR, (message: string) => {
			console.warn("Socket error:", message);
			let displayMessage = message;
			try {
				if (message.startsWith("[") || message.startsWith("{")) {
					JSON.parse(message); // check if it's valid JSON
					displayMessage = "An unexpected error occurred. Please try again.";
				}
			} catch (e) {
				// Not JSON, keep original message
			}
			toast("Error", { description: displayMessage });
		});
	},
	getSocket: () => {
		const { socket } = get();
		if (!socket) {
			return null;
		}
		return socket;
	},
	emitEvent: (eventName, ...args) => {
		const { socket } = get();
		if (socket?.connected) {
			(
				socket.emit as unknown as (
					ev: keyof ClientToServerEvents | string,
					...payload: unknown[]
				) => void
			)(eventName, ...args);
		} else {
			console.warn(`Socket not connected, cannot emit event : ${eventName}`);
		}
	},
	setRooms: (rooms: RoomData[]) => {
		set({ rooms });
	},
	getRooms: () => {
		const { rooms } = get();
		return rooms;
	},
	disconnectSocket: () => {
		const { socket } = get();
		if (socket) {
			// Remove only the listeners we registered in connectSocket
			socket.off("connect");
			socket.off("disconnect");
			socket.off("connect_error");
			socket.off(SOCKET_EVENTS.GET_ALL_ROOMS);
			socket.off(SOCKET_EVENTS.ERROR);
			socket.off(SOCKET_EVENTS.ROOM_AUTO_DELETED);
			socket.disconnect();
			set({ socket: null, isConnected: false });
		}
	},
}));
export default useSocketStore;
