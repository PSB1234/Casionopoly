"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import type { ClientToServerEvents, ServerToClientEvents } from "@/lib/type";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/8bit/alert-dialog";

export default function BankruptcyChoice({
	userId,
	game_id,
	socket,
}: {
	userId: string;
	game_id: string;
	socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}) {
	const router = useRouter();

	const [dialogMode, setDialogMode] = useState<"bankrupt" | "game-over" | null>(null);
	const [hasSeenBrokeAlert, setHasSeenBrokeAlert] = useState(false);
	const { emitEvent } = useSocketStore();
	const {
		players,
		getPlayersMoney,
		setTradeDialogOpen,
		setHasFinished,
		savePlayerSnapshot,
	} = useGameStore();
	const currentMoney = getPlayersMoney(userId);

	const handleSurrender = useCallback(() => {
		const currentPlayer = players.find((p) => p.id === userId);
		if (currentPlayer) {
			const status = "bankrupt";
			savePlayerSnapshot(userId, status);
		}
		setHasFinished(true);
		if (socket && game_id) {
			emitEvent(SOCKET_EVENTS.LEAVE_GAME, userId, game_id);
		}
		router.replace(`/game/${game_id}/result`);
	}, [socket, game_id, userId, emitEvent, router, setHasFinished, players, savePlayerSnapshot]);

	// Auto-quit when player runs out of money
	// Guard: skip when players haven't loaded yet (e.g. during page refresh)
	useEffect(() => {
		if (players.length === 0) return;
		if (currentMoney <= 0) {
			if (players.length <= 1) {
				setDialogMode("game-over");
				return;
			}
			if (!hasSeenBrokeAlert) {
				setDialogMode("bankrupt");
				setHasSeenBrokeAlert(true);
			}
		} else {
			setDialogMode(null);
			setHasSeenBrokeAlert(false);
		}
	}, [currentMoney, hasSeenBrokeAlert, players.length]);

	const onGameOverOk = useCallback(() => {
		handleSurrender();
	}, [handleSurrender]);

	const onDialogOpenChange = useCallback(
		(isOpen: boolean) => {
			if (!isOpen && dialogMode === "game-over") {
				return;
			}
			if (!isOpen) {
				setDialogMode(null);
			}
		},
		[dialogMode],
	);

	return (
		<AlertDialog onOpenChange={onDialogOpenChange} open={dialogMode !== null}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{dialogMode === "game-over" ? "Game Over" : "You are Bankrupt!"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{dialogMode === "game-over"
							? "You are bankrupt and no players remain. The game is over."
							: "You have run out of money. You can trade with other players to get back in the game, or surrender."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					{dialogMode === "game-over" ? (
						<AlertDialogAction onClick={onGameOverOk}>OK</AlertDialogAction>
					) : (
						<>
							<AlertDialogAction
								onClick={() => {
									setTradeDialogOpen(true);
									setDialogMode(null);
								}}
							>
								Trade
							</AlertDialogAction>
							<AlertDialogCancel
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								onClick={handleSurrender}
							>
								Surrender
							</AlertDialogCancel>
						</>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
