"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Separator } from "@/components/ui/8bit/separator";
import { env } from "@/env";
import { generateColorPair } from "@/lib/random_color";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import type { Player, RoomData } from "@/lib/type";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
import { RoomPasswordDialog } from "./room-password-dialog";

export function SearchRoomClient({
	initialRooms,
}: {
	initialRooms: RoomData[];
}) {
	const router = useRouter();
	const setRooms = useSocketStore((state) => state.setRooms);
	const rooms = useSocketStore((state) => state.rooms);
	const emitEvent = useSocketStore((state) => state.emitEvent);
	const username = useGameStore((state) => state.username);
	const color = useGameStore((state) => state.color);
	const setColor = useGameStore((state) => state.setColor);
	const setIsNavigating = useGameStore((state) => state.setIsNavigating);

	const [pendingRoom, setPendingRoom] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	useEffect(() => {
		setIsNavigating(false);
	}, [setIsNavigating]);

	// Hydrate the store with server-fetched rooms on mount
	useEffect(() => {
		if (initialRooms.length > 0 && rooms.length === 0) {
			setRooms(initialRooms);
		}
	}, [initialRooms, rooms.length, setRooms]);
	// Poll room list every 60 seconds
	useEffect(() => {
		const pollRooms = async () => {
			try {
				const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/rooms`);
				if (res.ok) {
					const json = await res.json();
					setRooms(json.data || []);
				}
			} catch (error) {
				console.error("Failed to poll rooms:", error);
			}
		};
		const interval = setInterval(pollRooms, 60000);
		return () => clearInterval(interval);
	}, [setRooms]);

	const joinRoom = (roomId: string, password: string | undefined) => {
		let finalColor = color;
		if (!finalColor) {
			const { original } = generateColorPair();
			finalColor = original;
			setColor(finalColor);
		}
		emitEvent(
			SOCKET_EVENTS.JOIN_ROOM,
			username,
			roomId,
			finalColor,
			password,
			(username: string, playerList: Player[]) => {
				useGameStore.setState({
					players: playerList,
					isNavigating: true,
				});
				console.log(`${username} joined room ${roomId}`);
				router.push(`/room/${roomId}`);
				router.refresh();
			},
		);
	};

	const onSubmit = (roomData: RoomData) => {
		if (roomData.isPrivate) {
			setPendingRoom(roomData.roomKey);
			setPasswordError(null);
			setDialogOpen(true);
			return;
		}
		joinRoom(roomData.roomKey, undefined);
	};

	const handlePasswordSubmit = (password: string) => {
		if (!pendingRoom) return;
		joinRoom(pendingRoom, password);
	};
	useEffect(() => {
		const socket = useSocketStore.getState().socket;
		if (!socket || !pendingRoom) return;

		const handler = (message: string) => {
			if (message === "Password required") {
				setPasswordError(null);
				setDialogOpen(true);
			} else if (message === "Incorrect password") {
				setPasswordError(message);
			}
		};

		socket.on(SOCKET_EVENTS.ERROR, handler);
		return () => {
			socket.off(SOCKET_EVENTS.ERROR, handler);
		};
	}, [pendingRoom]);

	const displayRooms = rooms.length > 0 ? rooms : initialRooms;

	return (
		<span className="flex h-screen w-screen flex-col p-10 backdrop-blur-md">
			<div className="flex flex-row items-center gap-10 pb-6">
				<Input className="backdrop-blur-xl" />
				<Button>search</Button>
			</div>
			{displayRooms.length === 0 ? (
				<span style={{ visibility: "visible" }}>
					<Card className="h-full w-full p-5" font={"retro"}>
						<CardTitle>No Rooms Available</CardTitle>
					</Card>
				</span>
			) : (
				<span style={{ visibility: "visible" }}>
					<Card className="h-full w-full p-5" font={"retro"}>
						<CardTitle>Available Rooms</CardTitle>
						<Separator className="my-4" />
						<CardContent>
							<ul>
								{displayRooms.map((roomData: RoomData) => (
									<li
										className="m-5 flex w-full justify-between"
										key={roomData.roomKey}
									>
										<h3>{roomData.name}</h3>
										<Button onClick={() => onSubmit(roomData)}>Join</Button>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</span>
			)}

			<RoomPasswordDialog
				error={passwordError}
				onClose={() => {
					setDialogOpen(false);
					setPendingRoom(null);
					setPasswordError(null);
				}}
				onSubmit={handlePasswordSubmit}
				open={dialogOpen}
			/>
		</span>
	);
}
