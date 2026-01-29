"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Bankruptcy from "@/components/bankruptcy";
import Board from "@/components/board";
import Chat from "@/components/chat";
import GhostBoard from "@/components/ghost-board";
import Kick from "@/components/kick";
import Option from "@/components/option";
import Playerlist from "@/components/playerlist";
import Properties from "@/components/properties";
import Sounds from "@/components/sounds";
import Trade from "@/components/trade";
import TradeDisplay from "@/components/tradeDisplay";
import { env } from "@/env";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function Game() {
	const { game_id } = useParams<{ game_id: string }>();
	const { socket, connectSocket } = useSocketStore();
	const { players, initializeSocket, userId, displayTrade, getUsernameById } =
		useGameStore();
	useEffect(() => {
		if (!game_id) return;
		if (!userId) return;
		if (!socket) {
			connectSocket(env.NEXT_PUBLIC_SOCKET_URL, {
				auth: {
					userId: userId,
				},
			});
			return;
		}
		// Initialize socket for the room
		initializeSocket(game_id, socket);
		return () => {};
	}, [socket, game_id, initializeSocket, connectSocket, userId]);
	return (
		<div className="flex h-screen max-h-screen max-w-screen items-center justify-center gap-6 px-5">
			<div className="flex h-full max-h-screen w-full max-w-sm flex-col justify-between gap-5 py-5">
				<div className="flex flex-row items-center justify-between">
					<div className="relative">
						<h1 className="relative z-10 font-bold font-jaro text-3xl text-yellow-200">
							Industrial.io
						</h1>
						<div className="pointer-events-none absolute top-1 left-1 select-none font-bold font-jaro text-3xl text-black">
							Industrial.io
						</div>
					</div>
					<Sounds />
				</div>
				<Option />
				<Trade roomKey={game_id} />
				<Chat />
			</div>
			<div className="relative aspect-square h-full max-h-screen w-full max-w-screen p-5">
				<Board game_id={game_id} />
				<div className="pointer-events-none absolute inset-0">
					<GhostBoard PlayerList={players} />
				</div>
			</div>
			<div className="flex h-full max-h-screen w-full max-w-sm flex-col gap-5 py-5">
				<Playerlist PlayerList={players} />
				<div className="flex justify-between">
					<Kick roomKey={game_id} />
					<Bankruptcy roomKey={game_id} />
				</div>
				<Properties roomKey={game_id} />
				<TradeDisplay
					displayTrade={displayTrade}
					getUsernameById={getUsernameById}
					roomKey={game_id}
					userId={userId}
				/>
			</div>
		</div>
	);
}
