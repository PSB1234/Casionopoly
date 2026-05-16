import { TradeInteraction } from "@/components/trade/tradeInteraction";
import type { TradeData } from "@/components/trade/tradeList";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/8bit/dialog";
import { ItemSeparator } from "@/components/ui/8bit/item";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

export default function Trade({ roomKey }: { roomKey: string }) {
	const { socket } = useSocketStore();
	const {
		userId,
		players,
		sendTrade,
		isTradeDialogOpen: open,
		setTradeDialogOpen: setOpen,
	} = useGameStore();

	const onSubmit = (playerId: string, offer: TradeData, request: TradeData) => {
		sendTrade(roomKey, userId, playerId, socket, {
			offer,
			request,
		});
		setOpen(false);
	};

	return (
		<Card className="flex flex-row items-center justify-between text-center">
			<CardTitle className="px-4">Trade</CardTitle>
			<CardContent>
				<Dialog onOpenChange={setOpen} open={open}>
					<DialogTrigger asChild>
						<Button size="sm">Open</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Trade</DialogTitle>
							<DialogDescription>
								Here you can trade your properties with other players.
							</DialogDescription>
						</DialogHeader>

						<ul>
							{players.map((player, index) => {
								if (player.id === userId) return null;
								return (
									<li key={player.id}>
										<div className="mt-4 mb-3 flex w-full flex-row justify-between text-center">
											<div>
												<h3>{player.username}</h3>
											</div>
											<TradeInteraction
												currentUser={players.find((p) => p.id === userId)!}
												onSubmit={onSubmit}
												targetPlayer={player}
											/>
										</div>
										{index < players.length - 2 && <ItemSeparator />}
									</li>
								);
							})}
						</ul>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
