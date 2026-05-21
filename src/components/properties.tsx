import { Activity } from "react";
import Upgrade from "@/components/board/upgrade";
import {
	Item,
	ItemContent,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/8bit/item";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";
import TileDataJson, { getNameOfPropertyById } from "@/lib/tiledata";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";

export default function Properties({
	roomKey,
	fullHeight = false,
}: {
	roomKey: string;
	fullHeight?: boolean;
}) {
	const getProperty = useGameStore((state) => state.getProperty);
	const userId = useGameStore((state) => state.userId);
	const players = useGameStore((state) => state.players);
	const turn = useGameStore((state) => state.turn);
	const checkIfPropertyGroupIsOwnedByPlayer = useGameStore(
		(state) => state.checkIfPropertyGroupIsOwnedByPlayer,
	);
	const getPlayersMoney = useGameStore((state) => state.getPlayersMoney);

	const myPlayer = players.find((p) => p.id === userId);
	const myRank = myPlayer?.rank || -1;
	const isMyTurn = turn === myRank;

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Tabs defaultValue={userId} className="flex min-h-0 flex-1 flex-col">
				<TabsList className="w-full flex justify-start mb-2 !h-auto flex-wrap bg-muted/50 p-1">
					{players.map((player) => (
						<TabsTrigger key={player.id} value={player.id} className="text-xs px-2 py-1 !h-auto">
							{player.id === userId ? "My Props" : player.username}
						</TabsTrigger>
					))}
				</TabsList>
				
				{players.map((player) => {
					const properties = getProperty(player.id);
					const isBankrupt = getPlayersMoney(player.id) <= 0;
					const isCurrentUser = player.id === userId;
					
					return (
						<TabsContent key={player.id} value={player.id} className="min-h-0 flex-1 flex-col data-[state=active]:flex mt-0 h-full">
							<ScrollArea
								className={cn(
									"relative w-full border-foreground pr-2",
									fullHeight ? "h-full" : "max-h-[55vh] lg:h-full",
									!(properties.length === 0 || properties === undefined) &&
										"border-y-6",
								)}
							>
								<ItemGroup className="h-full w-full">
									<Activity mode={properties.length === 0 ? "visible" : "hidden"}>
										<Item variant="default">
											<ItemContent>
												<ItemTitle className="text-center text-neutral-500 text-sm">
													No properties Owned
												</ItemTitle>
											</ItemContent>
										</Item>
									</Activity>
									<Activity mode={properties.length > 0 ? "visible" : "hidden"}>
										{properties.map((property, index) => (
											<div className="h-full w-full" key={property.id}>
												<Item variant="default">
													<ItemContent className="flex h-full w-full flex-row justify-between">
														<ItemTitle>{getNameOfPropertyById(property.id)}</ItemTitle>
														<Activity
															mode={
																TileDataJson[property.id]?.type === "property" && isCurrentUser
																	? "visible"
																	: "hidden"
															}
														>
															<Upgrade
																disabled={
																	!isMyTurn ||
																	isBankrupt ||
																	!checkIfPropertyGroupIsOwnedByPlayer(
																		userId,
																		property.id,
																	)
																}
																playerId={userId}
																propertyIndex={property.id}
																roomKey={roomKey}
															/>
														</Activity>
													</ItemContent>
												</Item>
												<Activity
													mode={index < properties.length - 1 ? "visible" : "hidden"}
												>
													<ItemSeparator />
												</Activity>
											</div>
										))}
									</Activity>
								</ItemGroup>
								<Activity mode={properties.length > 0 ? "visible" : "hidden"}>
									<div
										aria-hidden="true"
										className="pointer-events-none absolute inset-0 -mx-1.5 border-foreground border-x-4"
									/>
								</Activity>
							</ScrollArea>
						</TabsContent>
					);
				})}
			</Tabs>
		</div>
	);
}
