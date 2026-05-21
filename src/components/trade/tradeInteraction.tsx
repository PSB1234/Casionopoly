import { useState } from "react";
import TradeList, { type TradeData } from "@/components/trade/tradeList";
import { Button } from "@/components/ui/8bit/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/8bit/dialog";
import type { Player } from "@/lib/type";

export function TradeInteraction({
	currentUser,
	targetPlayer,
	onSubmit,
}: {
	currentUser: Player;
	targetPlayer: Player;
	onSubmit: (targetId: string, offer: TradeData, request: TradeData) => void;
}) {
	// These states hold the data for this specific trade
	const [myOffer, setMyOffer] = useState<TradeData>({
		amount: 0,
		properties: [],
	});
	const [theirOffer, setTheirOffer] = useState<TradeData>({
		amount: 0,
		properties: [],
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"destructive"}>Trade</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl w-[90vw]">
				<DialogHeader>
					<DialogTitle>Trade with {targetPlayer.username}</DialogTitle>
					<DialogDescription>
						Here's your properties which you can trade with{" "}
						{targetPlayer.username}.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-6 mt-2">
					<div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-10 w-full">
						<div className="w-full md:flex-1">
							<TradeList
								data={myOffer}
								onDataChange={setMyOffer}
								player={currentUser}
							/>
						</div>

						<div className="w-full md:flex-1">
							<TradeList
								data={theirOffer}
								onDataChange={setTheirOffer}
								player={targetPlayer}
							/>
						</div>
					</div>
					<Button
						className="w-full sm:w-auto sm:self-end"
						onClick={() => onSubmit(targetPlayer.id, myOffer, theirOffer)}
					>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
