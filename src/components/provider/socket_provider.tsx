"use client";

import { useEffect } from "react";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
import { toast } from "../ui/8bit/toast";

export default function SocketInit({
	url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "ws://localhost:8080",
	children,
}: {
	url?: string;
	children: React.ReactNode;
}) {
	const { connectSocket, disconnectSocket } = useSocketStore();
	const userId = useGameStore((state) => state.userId);
	const username = useGameStore((state) => state.username);

	useEffect(() => {
		if (userId ) {
			connectSocket(url, { auth: { userId, username } });
		}
		return () => disconnectSocket();
	}, [url, connectSocket, disconnectSocket, userId, username]);

	return <>{children}</>; // no UI
}
