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
		console.log("Attempting to connect to socket URL:", url);
		const existing = get().socket;
		if (existing?.connected) return; // prevent duplicate connections
		const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
			// safe defaults; user opts override
			transports: ["websocket"],
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			...opts,
		});
		set({ socket, isConnected: false });
		socket.on("connect", () => {
			set({ isConnected: true });
			console.log("Socket connected!");
		});
		socket.on("disconnect", () => {
			set({ isConnected: false });
			console.log("Socket disconnected!");
		});
		// Listen for room updates
		socket.on(SOCKET_EVENTS.GET_ALL_ROOMS, (roomsData: RoomData[]) => {
			set({ rooms: roomsData });
			console.log("Rooms updated:", roomsData);
		});
		//handle errors
		socket.on("connect_error", (error) => {
			console.error("Connection error:", error);
		});

		socket.on(SOCKET_EVENTS.ERROR, (message: string) => {
			console.warn("Socket error:", message);
			toast(`${message}`, { description: message });
		});
	},
	getSocket: () => {
		const { socket } = get();
		if (!socket) {
			console.warn("Socket not initialized");
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
			// remove listeners to avoid leaks
			socket.removeAllListeners();
			socket.disconnect();
			set({ socket: null, isConnected: false });
		}
	},
}));
export default useSocketStore;
