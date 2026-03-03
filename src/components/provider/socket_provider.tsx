"use client";

import { useEffect } from "react";
import { env } from "@/env";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

export default function SocketInit({
	url = env.NEXT_PUBLIC_SOCKET_URL,
	children,
}: {
	url?: string;
	children: React.ReactNode;
}) {
	const { connectSocket, disconnectSocket } = useSocketStore();
	const userId = useGameStore((state) => state.userId);
	const username = useGameStore((state) => state.username);

	useEffect(() => {
		if (userId) {
			connectSocket(url, { auth: { userId, username } });
		}
		return () => {
			// Only disconnect when component unmounts, not on re-renders
			disconnectSocket();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		url,
		userId,
		connectSocket, // Only disconnect when component unmounts, not on re-renders
		disconnectSocket,
		username,
	]); // Only depend on values, not Zustand functions

	return <>{children}</>; // no UI
}
