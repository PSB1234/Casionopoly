"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Separator } from "@/components/ui/8bit/separator";
import { generateColorPair } from "@/lib/random_color";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import type { Player, RoomData } from "@/lib/type";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function SearchPage() {
	const router = useRouter();
	const rooms = useSocketStore((state) => state.rooms);
	const emitEvent = useSocketStore((state) => state.emitEvent);
	const username = useGameStore((state) => state.username);
	const color = useGameStore((state) => state.color);
	const setColor = useGameStore((state) => state.setColor);
	const onSubmit = (roomId: string) => {
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
			(username: string, playerList: Player[]) => {
				useGameStore.setState({
					players: playerList,
				});
				console.log(`${username} joined room ${roomId}`);
				router.push(`/room/${roomId}`);
				router.refresh();
			},
		);
	};
	
	return (
		<span className="flex h-screen w-screen flex-col p-10 backdrop-blur-md">
			<div className="flex flex-row items-center gap-10 pb-6">
				<Input className="backdrop-blur-xl" />
				<Button>search</Button>
			</div>
			{rooms.length === 0 ? (
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
								{rooms.map((roomData: RoomData) => (
									<li
										className="m-5 flex w-full justify-between"
										key={roomData.roomKey}
									>
										<h3>{roomData.name}</h3>
										<Button onClick={() => onSubmit(roomData.roomKey)}>
											Join
										</Button>
										
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</span>
			)}
		</span>
	);
}
