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
import { getNameOfPropertyById } from "@/lib/tiledata";
import type { tradeDisplaySchema } from "@/lib/type";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

export default function TradeReview({
	roomKey,
	tradeDisplay,
}: {
	roomKey: string;
	tradeDisplay: tradeDisplaySchema;
}) {
	const { acceptTrade } = useGameStore();
	const { socket } = useSocketStore();
	const handleSubmit = (accepted: boolean) => () => {
		acceptTrade(
			tradeDisplay.fromPlayerId,
			tradeDisplay.toPlayerId,
			roomKey,
			socket,
			{
				offer: tradeDisplay.offeredProperties,
				request: tradeDisplay.requestedProperties,
			},
			accepted ? "accepted" : "rejected",
		);
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Button size="sm" variant={"destructive"}>
					Review
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.The trade will be reviewed.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div>
					<div>Amount offered: {tradeDisplay.offeredProperties.amount}</div>
					<h3>Offered Properties:</h3>
					<ul>
						{tradeDisplay.offeredProperties.properties.length > 0 ? (
							tradeDisplay.offeredProperties.properties.map((propId) => (
								<li key={propId}>{getNameOfPropertyById(propId)}</li>
							))
						) : (
							<li>No properties offered.</li>
						)}
					</ul>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleSubmit(false)}>
						Reject
					</AlertDialogAction>
					<AlertDialogAction onClick={handleSubmit(true)}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
