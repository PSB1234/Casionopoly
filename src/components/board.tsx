import Tile from "@/components/tile";
import TileDataJson from "@/lib/tiledata";
import { cn } from "@/lib/utils";
import Log from "./log";
import PlayButton from "./play_button";

// Helper function to get grid position for each tile
const getTilePosition = (index: number) => {
	// Map each tile index to its grid area
	const gridAreas = [
		"[grid-area:start]", // 0 - Start (bottom-left corner)
		"[grid-area:city1] flex-col", // 1
		"[grid-area:city2] flex-col", // 2
		"[grid-area:city3] flex-col", // 3
		"[grid-area:special1] flex-col", // 4
		"[grid-area:city4] flex-col", // 5
		"[grid-area:city5] flex-col", // 6
		"[grid-area:city6] flex-col", // 7
		"[grid-area:corner1] ", // 8 - Top-right corner
		"[grid-area:city7] flex-row-reverse", // 9
		"[grid-area:city8] flex-row-reverse", // 10
		"[grid-area:city9] flex-row-reverse", // 11
		"[grid-area:special2] flex-row-reverse", // 12
		"[grid-area:city10] flex-row-reverse", // 13
		"[grid-area:city11] flex-row-reverse", // 14
		"[grid-area:city12] flex-row-reverse", // 15
		"[grid-area:vacation]", // 16 - Bottom-right corner
		"[grid-area:city13] flex-col-reverse", // 17
		"[grid-area:city14] flex-col-reverse", // 18
		"[grid-area:city15] flex-col-reverse", // 19
		"[grid-area:special3] flex-col-reverse", // 20
		"[grid-area:city16] flex-col-reverse", // 21
		"[grid-area:city17] flex-col-reverse", // 22
		"[grid-area:city18] flex-col-reverse", // 23
		"[grid-area:corner2]", // 24 - Bottom-left corner
		"[grid-area:city19] flex-row", // 25
		"[grid-area:city20] flex-row", // 26
		"[grid-area:city21] flex-row", // 27
		"[grid-area:special4] flex-row", // 28
		"[grid-area:city22] flex-row", // 29
		"[grid-area:city23] flex-row", // 30
		"[grid-area:city24] flex-row", // 31
	];

	return gridAreas[index] || "";
};

export default function Board({ game_id }: { game_id: string }) {
	return (
		<div className="@container-[size] relative m-0 flex h-full w-full border-foreground border-y-6 bg-card p-2 font-jaro">
			<div
				className="grid h-full w-full gap-2"
				style={{
					gridTemplateColumns: "repeat(11, minmax(0, 1fr))",
					gridTemplateRows: "repeat(11, minmax(0, 1fr))",
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
				{/* Render players based on total_player count */}

				{TileDataJson.map((tileData) => (
					<Tile
						className={cn(getTilePosition(tileData.id))}
						key={tileData.id}
						TileData={tileData}
					/>
				))}
				{/* Center area for logs and controls */}
				<div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden p-[1cqmin] text-white [grid-area:Center] md:gap-4 md:p-[1.8cqmin]">
					<div className="flex w-full max-w-[85cqmin] shrink-0 scale-90 flex-col items-center justify-center gap-2 md:max-w-[58cqmin] md:scale-100 md:gap-4">
						<PlayButton game_id={game_id} />
					</div>
					<div className="flex min-h-0 w-full max-w-[85cqmin] flex-1 scale-90 flex-col items-center justify-center md:max-w-[58cqmin] md:scale-100">
						<Log />
					</div>
				</div>
			</div>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -mx-1.5 border-foreground border-x-6"
			/>
		</div>
	);
}
