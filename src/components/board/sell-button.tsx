import { Button } from "@/components/ui/8bit/button";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import TileDataJson from "@/lib/tiledata";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

export default function SellButton({
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
	const { getRankOfProperty } = useGameStore();

	const currentRank = getRankOfProperty(propertyIndex);

	const handleSell = () => {
		const tileData = TileDataJson.find((t) => t.id === propertyIndex);
		if (!tileData || !socket) return;

		let refundAmount = 0;
		if (currentRank > 0) {
			const upgradeCost = tileData.upgrade?.[currentRank - 1];
			if (upgradeCost !== undefined) {
				refundAmount = Math.floor(upgradeCost * 0.7);
			}
		} else {
			if (tileData.price !== undefined) {
				refundAmount = Math.floor(tileData.price * 0.7);
			}
		}

		if (refundAmount > 0) {
			socket.emit(
				SOCKET_EVENTS.SELL_PROPERTY,
				propertyIndex,
				playerId,
				roomKey,
				refundAmount,
			);
		}
	};

	const label = currentRank > 0 ? "Downgrade" : "Sell";

	return (
		<Button 
			disabled={disabled} 
			onClick={handleSell}
			className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1"
			size="sm"
		>
			{label}
		</Button>
	);
}
