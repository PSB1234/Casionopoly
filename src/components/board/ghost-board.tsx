import PlayerSprite from "@/components/board/player_sprite";
import TileDataJson from "@/lib/tiledata";
import type { Player } from "@/lib/type";
import { cn } from "@/lib/utils";

const PLAYER_SLOT_POSITIONS = [
	"top-[20%] left-[20%]",
	"top-[20%] left-1/2",
	"top-[20%] left-[80%]",
	"top-1/2 left-[20%]",
	"top-1/2 left-1/2",
	"top-1/2 left-[80%]",
	"top-[80%] left-[20%]",
	"top-[80%] left-1/2",
	"top-[80%] left-[80%]",
];

const sortPlayersForSlots = (players: Player[]) => {
	return [...players].sort((a, b) => a.id.localeCompare(b.id));
};

const renderPlayersInSlots = (players: Player[], spriteClassName: string) => {
	return sortPlayersForSlots(players).map((player, index) => (
		<div
			className={cn(
				"absolute -translate-x-1/2 -translate-y-1/2",
				PLAYER_SLOT_POSITIONS[index % PLAYER_SLOT_POSITIONS.length],
			)}
			key={player.id}
		>
			<PlayerSprite
				className={spriteClassName}
				color={player.color || "#000000"}
			/>
		</div>
	));
};

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
		<div className="pointer-events-none absolute inset-0 h-full w-full px-4 py-5 sm:px-8 sm:py-8">
			<div
				className="relative grid h-full w-full gap-2"
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
				{/* Render tiles in their grid positions */}
				{TileDataJson.map((tileData) =>
					tileData.type === "jail" ? (
						<div
							className={cn(
								"flex h-full w-full items-center justify-center p-[0.5cqmin]",
								getTilePosition(tileData.id),
							)}
							key={tileData.id}
						>
							<div className="flex h-full w-full flex-wrap items-center justify-center gap-[0.2cqmin]">
								<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
									<div className="relative h-[35%] w-full p-0">
										{renderPlayersInSlots(
											PlayerList.filter(
												(player) =>
													player.position === tileData.id &&
													player.behindBars !== true,
											),
											"h-[3.2cqmin] w-[3.2cqmin]",
										)}
									</div>
									<div
										className={cn("relative mt-auto flex h-[65%] w-[65%] p-0")}
									>
										{renderPlayersInSlots(
											PlayerList.filter(
												(player) =>
													player.position === tileData.id &&
													player.behindBars === true,
											),
											"h-full max-h-[2.8cqmin] w-full max-w-[2.8cqmin]",
										)}
										<div className="absolute inset-0 h-full w-full" />
									</div>
								</div>
							</div>
						</div>
					) : (
						<div
							className={cn(
								"flex h-full w-full items-center justify-center p-[0.5cqmin]",
								getTilePosition(tileData.id),
							)}
							key={tileData.id}
						>
							<div className="relative h-full w-full">
								{renderPlayersInSlots(
									PlayerList.filter(
										(player) => player.position === tileData.id,
									),
									"h-[4cqmin] w-[4cqmin]",
								)}
							</div>
						</div>
					),
				)}
				{/* Center area for logs and controls */}
				<div className="flex flex-col items-center justify-center gap-5 text-white [grid-area:Center]"></div>
			</div>
		</div>
	);
}
