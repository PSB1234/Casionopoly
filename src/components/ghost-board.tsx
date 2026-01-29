import TileDataJson from "@/lib/tiledata";
import type { Player } from "@/lib/type";
import { cn } from "@/lib/utils";
import PlayerSprite from "./player_sprite";

// Helper function to get grid position for each tile
const getTilePosition = (index: number) => {
	const gridAreas = [
		"[grid-area:start]",
		"[grid-area:city1]",
		"[grid-area:city2]",
		"[grid-area:city3]",
		"[grid-area:special1]",
		"[grid-area:city4]",
		"[grid-area:city5]",
		"[grid-area:city6]",
		"[grid-area:corner1]",
		"[grid-area:city7]",
		"[grid-area:city8]",
		"[grid-area:city9]",
		"[grid-area:special2]",
		"[grid-area:city10]",
		"[grid-area:city11]",
		"[grid-area:city12]",
		"[grid-area:vacation]",
		"[grid-area:city13]",
		"[grid-area:city14]",
		"[grid-area:city15]",
		"[grid-area:special3]",
		"[grid-area:city16]",
		"[grid-area:city17]",
		"[grid-area:city18]",
		"[grid-area:corner2]",
		"[grid-area:city19]",
		"[grid-area:city20]",
		"[grid-area:city21]",
		"[grid-area:special4]",
		"[grid-area:city22]",
		"[grid-area:city23]",
		"[grid-area:city24]",
	];
	return gridAreas[index] || "";
};
// TODO:MAKE BETTER QUALITY SPRITES FOR PLAYERS AND HANDLE HEIGHT PROPERLY AND ALSO MAKE IT COMPATIBLE FOR MULTIPLE PLAYERS TO STAY ON SAME TILE

export default function GhostBoard({ PlayerList }: { PlayerList: Player[] }) {
	return (
		<div className="pointer-events-none absolute inset-1 h-full w-full p-5">
			<div
				className="relative grid aspect-square h-full max-h-screen w-full grid-cols-11 grid-rows-11 gap-4 gap-y-2 px-4 py-6"
				style={{
					gridTemplateAreas: `
                "start start city1 city2 city3 special1 city4 city5 city6 corner1 corner1"
                "start start city1 city2 city3 special1 city4 city5 city6 corner1 corner1"
                "city24 city24 Center Center Center Center Center Center Center city7 city7"
                "city23 city23 Center Center Center Center Center Center Center city8 city8"
                "city22 city22 Center Center Center Center Center Center Center city9 city9"
                "special4 special4 Center Center Center Center Center Center Center special2 special2"
                "city21 city21 Center Center Center Center Center Center Center city10 city10"
                "city20 city20 Center Center Center Center Center Center Center city11 city11"
                "city19 city19 Center Center Center Center Center Center Center city12 city12"
                "corner2 corner2 city18 city17 city16 special3 city15 city14 city13 vacation vacation"
                "corner2 corner2 city18 city17 city16 special3 city15 city14 city13 vacation vacation"
                                `,
				}}
			>
				{/* Render tiles in their grid positions */}
				{TileDataJson.map((tileData) => (
					<div
						className={cn(
							"flex h-full w-full items-center justify-start p-2",
							getTilePosition(tileData.id),
						)}
						key={tileData.id}
					>
						{PlayerList.filter((player) => player.position === tileData.id).map(
							(player) => {
								return (
									<PlayerSprite
										className="h-5 w-5"
										color={player.color || "#000000"} // Fallback color
										key={player.id}
									/>
								);
							},
						)}
					</div>
				))}
				{/* Center area for logs and controls */}
				<div className="flex flex-col items-center justify-center gap-5 text-white [grid-area:Center]"></div>
			</div>
		</div>
	);
}
