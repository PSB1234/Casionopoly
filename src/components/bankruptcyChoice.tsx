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
} from "./ui/8bit/alert-dialog";

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

	const [isBroke, setIsBroke] = useState(false);
	const [hasSeenBrokeAlert, setHasSeenBrokeAlert] = useState(false);
	const { emitEvent } = useSocketStore();
	const { players, getPlayersMoney, setTradeDialogOpen } = useGameStore();
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
                            <AlertDialogAction onClick={() => setTradeDialogOpen(true)}>
                                Trade
                            </AlertDialogAction>
                            <AlertDialogCancel
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={handleSurrender}
                            >
                                Surrender
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
    </AlertDialog>
  )
}
