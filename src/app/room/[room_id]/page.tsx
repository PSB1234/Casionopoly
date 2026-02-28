"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import { Timer } from "@/components/ui/8bit/timer";
import { toast } from "@/components/ui/8bit/toast";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function Room() {
	const router = useRouter();
	const { room_id } = useParams<{ room_id: string }>();
	const { isThisPlayerLeader, players, initializeSocket, timerSeconds } =
		useGameStore();
	const { socket, emitEvent, rooms } = useSocketStore();
	const roomData = rooms.find((room) => room.roomKey === room_id);
	useEffect(() => {
		if (!socket || !room_id) return;
		initializeSocket(room_id, socket);
		function RoomStatus() {
			router.push(`/game/${room_id}`);
			router.refresh();
		}
		function handleRoomDeleted(deletedRoomKey: string) {
			if (deletedRoomKey === room_id) {
				toast("Room Closed", {
					description: "The waiting room was closed due to inactivity.",
				});
				router.push("/");
			}
		}
		function handlePlayerLeft(playerId: string) {
			const state = useGameStore.getState();
			if (state.userId === playerId) {
				toast("Kicked", {
					description: "You have been kicked from the room.",
				});
				router.push("/");
			} else {
				useGameStore.setState((state) => ({
					players: state.players.filter((p) => p.id !== playerId),
				}));
			}
		}
		socket.on(SOCKET_EVENTS.AFTER_CHANGE_ROOM_STATUS, RoomStatus);
		socket.on(SOCKET_EVENTS.ROOM_AUTO_DELETED, handleRoomDeleted);
		socket.on(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);
		socket.on(SOCKET_EVENTS.USER_DISCONNECTED, handlePlayerLeft);
		return () => {
			socket.off(SOCKET_EVENTS.AFTER_CHANGE_ROOM_STATUS, RoomStatus);
			socket.off(SOCKET_EVENTS.ROOM_AUTO_DELETED, handleRoomDeleted);
			socket.off(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);
			socket.off(SOCKET_EVENTS.USER_DISCONNECTED, handlePlayerLeft);
		};
	}, [room_id, socket, initializeSocket, router]);
	const copyCodeAction = () => {
		return () => {
			navigator.clipboard.writeText(room_id);
			toast("Copied to clipboard", {
				description: `Room code ${room_id} copied to clipboard`,
			});
		};
	};
	const onSubmit = () => {
		emitEvent(SOCKET_EVENTS.CHANGE_ROOM_STATUS, room_id, "playing");
	};
	return (
		<div className="flex w-full flex-col gap-5 p-10">
			<div className="relative flex h-full w-full flex-row justify-between border-foreground border-y-6 bg-card px-5 py-4 font-jaro">
				<div>
					<h1 className="my-2 font-bold text-3xl">{roomData?.name}</h1>
					<h3 className="relative flex w-fit flex-row items-center justify-center gap-4 border-foreground border-y-6 bg-background p-2 text-muted-foreground text-xl">
						{roomData?.roomKey}
						<button
							className="group relative h-full w-full hover:cursor-pointer"
							onClick={copyCodeAction()}
							type="button"
						>
							<Image
								alt="copy icon"
								height={30}
								src={"/icons/copy.svg"}
								width={30}
							/>
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 z-5 bg-black/0 transition-colors group-hover:bg-black/50"
							/>
						</button>
						<div
							aria-hidden="true"
							className="-mx-1.5 pointer-events-none absolute inset-0 border-foreground border-x-6"
						/>
					</h3>
				</div>
				<div
					aria-hidden="true"
					className="-mx-1.5 pointer-events-none absolute inset-0 border-foreground border-x-6"
				/>
				<Timer seconds={timerSeconds} />
			</div>

			<Card className="w-full p-5 md:col-span-3 md:row-span-6 md:h-full">
				<CardTitle>Players:</CardTitle>
				<CardContent>
					<ul>
						{players.length === 0 ? (
							<li>No players yet</li>
						) : (
							players.map((player, index) => (
								<li className="flex flex-row gap-2" key={player.id}>
									<p>{index + 1}.</p>
									<p className="overflow-hidden text-ellipsis">
										{player.username}
									</p>
								</li>
							))
						)}
					</ul>
				</CardContent>
			</Card>
			<Button
				disabled={!isThisPlayerLeader() || players.length < 2}
				onClick={onSubmit}
			>
				Submit
			</Button>
		</div>
	);
}
