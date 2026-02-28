"use client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Bankruptcy from "@/components/bankruptcy";
import Board from "@/components/board";
import Chat from "@/components/chat";
import GhostBoard from "@/components/ghost-board";
import Kick from "@/components/kick";
import Playerlist from "@/components/playerlist";
import Properties from "@/components/properties";
import Sounds from "@/components/sounds";
import Trade from "@/components/trade";
import TradeDisplay from "@/components/tradeDisplay";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/8bit/alert-dialog";
import { env } from "@/env";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function Game() {
	const router = useRouter();
	const { game_id } = useParams<{ game_id: string }>();
	const { socket, connectSocket, emitEvent } = useSocketStore();
	const [isBroke, setIsBroke] = useState(false);
	const [hasSeenBrokeAlert, setHasSeenBrokeAlert] = useState(false);
	const {
		players,
		initializeSocket,
		userId,
		displayTrade,
		getUsernameById,
		getPlayersMoney,
	} = useGameStore();
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

		initializeSocket(game_id, socket);
		return () => {};
	}, [socket, game_id, initializeSocket, connectSocket, userId]);
	const currentMoney = getPlayersMoney(userId);

	const handleSurrender = useCallback(() => {
		if (socket && game_id) {
			emitEvent(SOCKET_EVENTS.LEAVE_GAME, userId, game_id);
		}
		router.replace("/");
	}, [socket, game_id, userId, emitEvent, router]);

	// Auto-quit when player runs out of money
	// Guard: skip when players haven't loaded yet (e.g. during page refresh)
	useEffect(() => {
		if (players.length === 0) return;
		if (currentMoney <= 0) {
			if (players.length <= 1) {
				handleSurrender();
				return;
			}
			if (!hasSeenBrokeAlert) {
				setIsBroke(true);
				setHasSeenBrokeAlert(true);
			}
		} else {
			setIsBroke(false);
			setHasSeenBrokeAlert(false);
		}
	}, [currentMoney, hasSeenBrokeAlert, players.length, handleSurrender]);

	return (
		<div className="flex h-screen max-h-screen max-w-screen items-center justify-center gap-6 px-5">
			<AlertDialog onOpenChange={setIsBroke} open={isBroke}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>You are Bankrupt!</AlertDialogTitle>
						<AlertDialogDescription>
							You have run out of money. You can trade with other players to get
							back in the game, or surrender?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>Trade</AlertDialogAction>
						<AlertDialogCancel
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleSurrender}
						>
							Surrender
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className="flex h-full max-h-screen w-full max-w-lg flex-col justify-between gap-5 py-5">
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
				<Trade roomKey={game_id} />
				<Chat />
			</div>
			<div className="relative aspect-square h-full max-h-screen w-full p-5">
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
