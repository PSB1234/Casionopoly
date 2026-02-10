import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/8bit/card";
import {
	Item,
	ItemContent,
	ItemGroup,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/8bit/item";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import Upgrade from "@/components/upgrade";
import { getNameOfPropertyById } from "@/lib/tiledata";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";

export default function Properties({ roomKey }: { roomKey: string }) {
	const {
		getProperty,
		userId,
		players,
		turn,
		checkIfPropertyGroupIsOwnedByPlayer,
	} = useGameStore();
	const properties = getProperty(userId);
	const myPlayer = players.find((p) => p.id === userId);
	const myRank = myPlayer?.rank || -1;
	const isMyTurn = turn === myRank;

	return (
		<Card className="flex min-h-0 flex-1 flex-col">
			<CardTitle className="px-5">Properties</CardTitle>
			{properties.length === 0 || properties === undefined ? null : (
				<CardDescription className="px-5">
					List of your properties
				</CardDescription>
			)}
			<CardContent className="min-h-0 flex-1">
				<ScrollArea
					className={cn(
						"relative h-full w-full border-foreground pr-2",
						!(properties.length === 0 || properties === undefined) &&
							"border-y-6",
					)}
				>
					<ItemGroup className="h-full w-full">
						{properties.length === 0 || properties === undefined ? (
							<Item variant="default">
								<ItemContent>
									<ItemTitle className="text-center text-neutral-500 text-sm">
										No properties Owned
									</ItemTitle>
								</ItemContent>
							</Item>
						) : (
							properties.map((property, index) => (
								<div className="h-full w-full" key={property.id}>
									<Item variant="default">
										<ItemContent className="flex h-full w-full flex-row justify-between">
											<ItemTitle>
												{getNameOfPropertyById(property.id)}
											</ItemTitle>
											<Upgrade
												disabled={
													!isMyTurn ||
													!checkIfPropertyGroupIsOwnedByPlayer(
														userId,
														property.id,
													)
												}
												playerId={userId}
												propertyIndex={property.id}
												roomKey={roomKey}
											/>
										</ItemContent>
									</Item>
									{index < properties.length - 1 && <ItemSeparator />}
								</div>
							))
						)}
					</ItemGroup>
					{!(properties.length === 0 || properties === undefined) && (
						<div
							aria-hidden="true"
							className="-mx-1.5 pointer-events-none absolute inset-0 border-foreground border-x-4"
						/>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
