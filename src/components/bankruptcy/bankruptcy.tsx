"use client"
import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/8bit/alert-dialog";
import { Button } from "@/components/ui/8bit/button";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
import { toast } from "../ui/8bit/toast";
export default function Bankruptcy({ roomKey }: { roomKey: string }) {
	const router = useRouter();
	const { socket, emitEvent } = useSocketStore();
	const { userId, setHasFinished, players, savePlayerSnapshot } =
		useGameStore();
	const handleContinue = () => {
		if (socket) {
			const currentPlayer = players.find((p) => p.id === userId);
			if (currentPlayer) {
				savePlayerSnapshot(userId, "bankrupt");
			}
			setHasFinished(true);
			emitEvent(SOCKET_EVENTS.LEAVE_GAME, userId, roomKey);
			router.replace(`/game/${roomKey}/result`);
		} else {
			toast("Error", {
				description: "Socket not connected",
			});
			return;
		}
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Button size="sm" variant={"outline"}>
					Bankruptcy
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will mark you to be{" "}
						<b>Bankrupted </b>
						and removed from the game.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleContinue}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
