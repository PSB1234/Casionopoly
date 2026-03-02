"use client";

import type { Socket } from "socket.io-client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/8bit/alert-dialog";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import type { ClientToServerEvents, ServerToClientEvents } from "@/lib/type";
import { useGameStore } from "@/store/game_store";

export default function InactivityWarning({
	roomKey,
	socket,
}: {
	roomKey: string;
	socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}) {
	const { showInactivityWarning, inactivityCountdown } = useGameStore();

	const handleConfirm = () => {
		if (socket) {
			socket.emit(SOCKET_EVENTS.CONFIRM_ACTIVITY, roomKey);
		}
	};

	return (
		<AlertDialog open={showInactivityWarning}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you still playing?</AlertDialogTitle>
					<AlertDialogDescription>
						No activity detected. The game will be closed in{" "}
						<span className="font-bold text-foreground">
							{inactivityCountdown}s
						</span>{" "}
						if no one responds.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={handleConfirm}>
						I&apos;m still here!
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
