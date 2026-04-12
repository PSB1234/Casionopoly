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
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
import { ItemSeparator } from "./ui/8bit/item";

export default function Kick({ roomKey }: { roomKey: string }) {
	const { socket } = useSocketStore();
	const { userId, players, sendVote, votedPlayers } = useGameStore();

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Button size="sm" variant={"destructive"}>
					kick
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will mark this person to be
						kicked from the game.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<ul>
					{players.map((player, index) => (
						<li key={player.id}>
							<div className="mt-4 flex w-full flex-row justify-between">
								<div>
									<h3>{player.username}</h3>
									<p>Votes: {player.votes ?? 0}</p>
								</div>
								<Button
									disabled={
										votedPlayers.includes(player.id) || player.id === userId
									}
									onClick={() => sendVote(roomKey, player.id, socket)}
									variant={"destructive"}
								>
									Vote
								</Button>
							</div>
							{index < players.length - 1 && <ItemSeparator />}
						</li>
					))}
				</ul>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
