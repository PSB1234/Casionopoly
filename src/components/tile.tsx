import Images from "next/image";
import type { TileDataSchema } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";
export default function Tile({
	className,
	TileData,
}: {
	className: string;
	TileData: TileDataSchema;
}) {
	const { checkPropertyIsOwned, getColorByPropertyIndex, getRankOfProperty } =
		useGameStore();
	const isOwned = checkPropertyIsOwned(TileData.id);
	const ownerColor = isOwned ? getColorByPropertyIndex(TileData.id) : undefined;
	const rank = getRankOfProperty(TileData.id);

	// Determine side
	const isTop = TileData.id >= 1 && TileData.id <= 7;
	const isRight = TileData.id >= 9 && TileData.id <= 15;
	const isBottom = TileData.id >= 17 && TileData.id <= 23;
	const isLeft = TileData.id >= 25 && TileData.id <= 31;
	//Determine image width and height
	let positionClass = "";
	let directionClass = "";
	let textDirectionClass = "";
	let textIconClass = "";
	if (isTop) {
		positionClass = " max-h-1/3 border-t-4";
		directionClass = "flex-col-reverse ";
		textDirectionClass = "items-center justify-center";
		textIconClass = "flex-col-reverse";
	} else if (isBottom) {
		positionClass = " max-h-1/3  border-b-4";
		directionClass = "flex-col ";
		textDirectionClass = "items-center justify-center";
		textIconClass = "flex-col ";
	} else if (isLeft) {
		positionClass = "max-w-1/3 border-l-4";
		directionClass = "flex-row-reverse  ";
		textDirectionClass = "items-end justify-start";
		textIconClass = "flex-col";
	} else if (isRight) {
		positionClass = " max-w-1/3 border-r-4";
		directionClass = "flex-row";
		textDirectionClass = "items-end justify-end";
		textIconClass = "flex-col";
	} else {
		positionClass = "border-0";
		textDirectionClass = "items-center justify-center";
	}

	return (
		<div
			className={cn(
				"relative flex h-full w-full min-w-10 flex-row justify-between border-foreground border-y-4", //change min-w for responsiveness
				className,
			)}
			style={{ borderColor: ownerColor }}
		>
			{TileData.type === "jail" ? (
				<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
					<p className="flex w-full justify-center py-1 text-center text-md">
						{TileData.name.toLowerCase()}
					</p>
					<div className="flex h-2/3 p-0">
						<Images
							alt={`jail-${TileData.id}`}
							className="pixelated w-full"
							height={50}
							src={`/Images/prison.svg`}
							width={50}
						/>
					</div>
				</div>
			) : (
				<>
					<div
						className={cn(
							"flex h-full w-full justify-between overflow-clip text-clip p-1",
							textDirectionClass,
						)}
					>
						{TileData.type === "property" ? (
							<div
								className={cn(
									"flex h-full w-full",
									textIconClass,
									"items-center gap-0",
								)}
							>
								<div className={cn("flex h-full w-full justify-center")}>
									{rank > 0 && rank <= 5 && (
										<Images
											alt={`house-${rank}`}
											height={isTop || isBottom ? 30 : 20}
											src={`/upgrade-icons/house-${rank - 1}.svg`}
											width={isTop || isBottom ? 30 : 20}
										/>
									)}
								</div>
								<p className="break-all text-center text-sm leading-tight">
									{TileData.name.toLowerCase()}
								</p>
							</div>
						) : (
							<p className="h-full w-full break-all text-center font-extralight text-sm leading-tight">
								{TileData.name.toLowerCase()}
							</p>
						)}
					</div>
					{TileData.flagName && TileData.type === "property" && (
						<div
							className={cn(
								positionClass,
								"h-full w-full border-foreground p-0",
							)}
							style={{
								borderColor: ownerColor,
							}}
						>
							{/* flag  section */}
							<div className={cn("h-full w-full", directionClass)}>
								<div
									className="relative m-0 h-full w-full items-center justify-center overflow-clip border-foreground p-0"
									style={{ borderColor: ownerColor }}
								>
									{/** biome-ignore lint/performance/noImgElement: <explanation> */}
									<img
										alt={`${TileData.id}`}
										className={cn("h-full w-full")}
										rel="preload"
										src={`/tiles/${TileData.flagName.toLowerCase()}.png`}
									/>
									{/* blur effect */}
									<div
										aria-hidden="true"
										className="pointer-events-none absolute inset-0"
										style={{
											borderColor: ownerColor,
											backgroundColor: `rgba(0,0,0, ${ownerColor ? 0.5 : 0})`,
										}}
									/>
								</div>
							</div>
						</div>
					)}
					{TileData.type === "railroad" &&
						TileData.name.toLowerCase() === "railway" && (
							// biome-ignore lint/performance/noImgElement: <explanation>
							<Images
								alt={`train-${TileData.id}`}
								className="pixelated h-full w-1/3"
								height={20}
								src={`/Images/train.svg`}
								width={20}
							/>
						)}
					{TileData.type === "railroad" &&
						TileData.name.toLowerCase() === "port" && (
							// biome-ignore lint/performance/noImgElement: <explanation>
							<Images
								alt={`ship-${TileData.id}`}
								className="pixelated w-full p-2"
								height={20}
								src={`/Images/ship.png`}
								width={20}
							/>
						)}
					{TileData.type === "railroad" &&
						TileData.name.toLowerCase() === "airport" && (
							// biome-ignore lint/performance/noImgElement: <explanation>
							<Images
								alt={`plane-${TileData.id}`}
								className="pixelated h-full w-full p-0 py-2"
								height={10}
								src={`/Images/plane.svg`}
								width={10}
							/>
						)}
					{TileData.type === "chance" &&
						TileData.name.toLowerCase() === "chest" && (
							// biome-ignore lint/performance/noImgElement: <explanation>
							<Images
								alt={`plane-${TileData.id}`}
								className="pixelated h-full w-full p-2"
								height={20}
								src={`/Images/chest.svg`}
								width={20}
							/>
						)}
					{TileData.type === "go-to-jail" && (
						// biome-ignore lint/performance/noImgElement: <explanation>
						<Images
							alt={`police-${TileData.id}`}
							className="pixelated w-full p-3"
							height={10}
							src={`/Images/police.png`}
							width={10}
						/>
					)}
				</>
			)}

			<div
				aria-hidden="true"
				className="-mx-1.5 pointer-events-none absolute inset-0 border-foreground border-x-4"
				style={{ borderColor: ownerColor }}
			/>
		</div>
	);
}
