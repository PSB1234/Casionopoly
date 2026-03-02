import type { tradeDisplaySchema } from "@/lib/type";
import { cn } from "@/lib/utils";
import TradeReview from "./tradeReview";
import { Card, CardContent, CardHeader } from "./ui/8bit/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemFooter,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
} from "./ui/8bit/item";
import { ScrollArea } from "./ui/8bit/scroll-area";

export default function TradeDisplay({
	userId,
	roomKey,
	getUsernameById,
	displayTrade,
}: {
	userId: string;
	roomKey: string;
	getUsernameById: (playerId: string) => string | undefined;
	displayTrade: () => tradeDisplaySchema[];
}) {
	const trades = displayTrade();

	if (trades.length === 0) {
		return (
			<Card className="flex flex-col">
				<CardHeader>Trade Display</CardHeader>
				<CardContent className="text-center text-neutral-500 text-sm">
					No active trades pending.
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="flex min-h-0 flex-col">
			<CardHeader>Trade Display</CardHeader>
			<CardContent className="min-h-0">
				<ScrollArea className="h-60 lg:h-full w-full">
					<ItemGroup>
						{trades.map((trade, index) => {
							// Assuming tradeSchema has offer/request objects similar to TradeData
							const offerSummary =
								trade.offeredProperties.amount > 0 ||
								trade.offeredProperties.properties.length > 0
									? `$${trade.offeredProperties.amount} + ${trade.offeredProperties.properties.length} props`
									: "Offer";

							return (
								<div key={`${trade.fromPlayerId}-${trade.toPlayerId}-${index}`}>
									<Item variant="default">
										<ItemContent>
											<ItemTitle className="flex-wrap text-sm">
												<span className="break-all">
													{getUsernameById(trade.fromPlayerId)}
												</span>
												<span className="mx-2 text-primary">&rarr;</span>
												<span className="break-all">
													{getUsernameById(trade.toPlayerId)}
												</span>
											</ItemTitle>
											<div className="mt-1 break-words text-muted-foreground text-xs">
												Status: {offerSummary}
											</div>
										</ItemContent>

										{trade.toPlayerId === userId ? (
											<ItemFooter className="mt-2 flex justify-end">
												<TradeReview roomKey={roomKey} tradeDisplay={trade} />
											</ItemFooter>
										) : (
											<ItemFooter className="mt-2 flex justify-end">
												<span className="px-2 text-muted-foreground text-xs italic">
													Pending
												</span>
											</ItemFooter>
										)}
									</Item>
									{/* Render separator only between items */}
									{index < trades.length - 1 && <ItemSeparator />}
								</div>
							);
						})}
					</ItemGroup>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
