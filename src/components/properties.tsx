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
import { getNameOfPropertyById } from "@/lib/tiledata";
import { useGameStore } from "@/store/game_store";
import Upgrade from "./upgrade";

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
		<Card>
			<CardTitle className="px-5">Properties</CardTitle>
			{properties.length === 0 || properties === undefined ? null : (
				<CardDescription className="px-5">
					List of your properties
				</CardDescription>
			)}
			<CardContent className="h-full">
				<ItemGroup>
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
							<div key={property.id}>
								<Item variant="default">
									<ItemContent className="flex w-full flex-row justify-between">
										<ItemTitle>{getNameOfPropertyById(property.id)}</ItemTitle>
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
			</CardContent>
		</Card>
	);
}
