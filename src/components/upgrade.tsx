import Image from "next/image";
import { Button } from "@/components/ui/8bit/button";
import TileDataJson from "@/lib/tiledata";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function Upgrade({
	playerId,
	propertyIndex,
	roomKey,
	disabled,
}: {
	playerId: string;
	propertyIndex: number;
	roomKey: string;
	disabled: boolean;
}) {
	const { socket } = useSocketStore();
	const { upgradeProperty, getRankOfProperty } = useGameStore();

	const handleUpgrade = () => {
		const tileData = TileDataJson[propertyIndex];
		if (!tileData) return;

		const currentRank = getRankOfProperty(propertyIndex);
		const upgradeCostArray = tileData.upgrade;

		if (!socket || upgradeCostArray === undefined || currentRank >= 5) return;

		const upgradeCost = upgradeCostArray[currentRank];
		if (upgradeCost === undefined) return;

		// Send positive cost, backend handles deduction
		upgradeProperty(playerId, socket, propertyIndex, roomKey, upgradeCost);
	};
	return (
		<Button disabled={disabled} onClick={handleUpgrade}>
			<Image
				alt="Arrow Up"
				className="pixelated"
				fill
				src="/icons/arrow-up-solid.svg"
			/>
		</Button>
	);
}
