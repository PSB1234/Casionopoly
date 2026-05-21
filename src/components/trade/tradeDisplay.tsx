import TradeReview from "@/components/trade/tradeReview";
import { Card, CardContent } from "@/components/ui/8bit/card";
import {
	Item,
	ItemContent,
	ItemFooter,
	ItemGroup,
	ItemTitle,
} from "@/components/ui/8bit/item";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import type { tradeDisplaySchema } from "@/lib/type";

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
				<CardContent className="text-center text-neutral-500 text-sm">
					No active trades pending.
				</CardContent>
			</Card>
		);
	}

	return (
		<div>
				<ScrollArea className="max-h-[65vh] w-full lg:h-full">
					<ItemGroup className="p-4 pr-6 gap-5">
						{trades.map((trade) => {
							// Assuming tradeSchema has offer/request objects similar to TradeData
							const offerSummary =
								trade.offeredProperties.amount > 0 ||
								trade.offeredProperties.properties.length > 0
									? `$${trade.offeredProperties.amount} + ${trade.offeredProperties.properties.length} props`
									: "Offer";
							return (
								<Card
									className="w-full bg-black/20"
									key={`${trade.fromPlayerId}-${trade.toPlayerId}`}
								>
									<CardContent >
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
												<div className="wrap-break-word mt-1 text-muted-foreground text-xs">
													Status: {offerSummary}
												</div>
											</ItemContent>

											{trade.toPlayerId === userId ? (
												<ItemFooter className="mt-2 flex justify-end">
													<TradeReview roomKey={roomKey} tradeDisplay={trade} />
												</ItemFooter>
											) : (
												<ItemFooter className="mt-2 flex justify-end">
													<span className="px-2 text-muted-foreground text-xs">
														Pending...
													</span>
												</ItemFooter>
											)}
										</Item>
									</CardContent>
								</Card>
							);
						})}
					</ItemGroup>
				</ScrollArea>
</div>
	);
}
