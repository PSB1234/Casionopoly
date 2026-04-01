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
	const checkPropertyIsOwned = useGameStore(
		(state) => state.checkPropertyIsOwned,
	);
	const getColorByPropertyIndex = useGameStore(
		(state) => state.getColorByPropertyIndex,
	);
	const getRankOfProperty = useGameStore((state) => state.getRankOfProperty);

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
		positionClass = " max-h-[35%] border-t-2";
		directionClass = "flex-col-reverse ";
		textDirectionClass = "items-center justify-center";
		textIconClass = "flex-col-reverse";
	} else if (isBottom) {
		positionClass = " max-h-[35%]  border-b-2";
		directionClass = "flex-col ";
		textDirectionClass = "items-center justify-center";
		textIconClass = "flex-col ";
	} else if (isLeft) {
		positionClass = "max-w-[35%] border-l-2";
		directionClass = "flex-row-reverse  ";
		textDirectionClass = "items-center justify-center";
		textIconClass = "flex-col";
	} else if (isRight) {
		positionClass = " max-w-[35%] border-r-2";
		directionClass = "flex-row";
		textDirectionClass = "items-center justify-center";
		textIconClass = "flex-col";
	} else {
		positionClass = "border-0";
		textDirectionClass = "items-center justify-center";
	}

	return (
		<div
			className={cn(
				"relative flex h-full min-h-0 w-full min-w-0 flex-row justify-between border-foreground border-y-2 [container-type:size]",
				className,
			)}
			style={{ borderColor: ownerColor }}
		>
			{TileData.type === "jail" ? (
				<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
					<p className="flex w-full justify-center py-[2cqh] text-center text-[12cqw] lg:text-[14cqw]">
						{TileData.name.toLowerCase()}
					</p>
					<div className="relative flex h-2/3 p-0">
						<Images
							alt={`jail-${TileData.id}`}
							className="pixelated object-contain"
							fill
							src={`/Images/prison.svg`}
						/>
					</div>
				</div>
			) : TileData.type === "Vacation" ? (
				<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
					<p className="flex w-full justify-center py-[2cqh] text-center text-[12cqw] lg:text-[14cqw]">
						{TileData.name.toLowerCase()}
					</p>
					<div className="relative flex h-2/3 p-0">
						<Images
							alt={`vacation-${TileData.id}`}
							className="pixelated object-contain"
							fill
							src={`/Images/vacation.png`}
						/>
					</div>
				</div>
			) : TileData.type === "tax" ? (
				<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
					<p className="flex w-full justify-center py-[2cqh] text-center text-[12cqw] lg:text-[14cqw]">
						{TileData.name.toLowerCase()}
					</p>
					<div className="relative flex h-2/3 p-0">
						<Images
							alt={`tax-${TileData.id}`}
							className="pixelated object-contain"
							fill
							src={`/Images/tax.png`}
						/>
					</div>
				</div>
			) : (
				<>
					<div
						className={cn(
							"flex h-full w-full justify-between overflow-clip text-clip p-[1cqw]",
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
								<div
									className={cn("relative flex h-full w-full justify-center")}
								>
									{rank > 0 && rank <= 5 && (
										<Images
											alt={`house-${rank}`}
											className="object-contain"
											fill
											src={`/upgrade-icons/house-${rank - 1}.svg`}
										/>
									)}
								</div>
								<p className="break-all text-center font-medium text-[25cqmin] leading-tight lg:text-sm">
									{TileData.name.toLowerCase()}
								</p>
								{TileData.price && (
									<p className="mt-[2cqh] text-center font-bold text-[25cqmin] text-yellow-400 lg:text-sm">
										${TileData.price}
									</p>
								)}
							</div>
						) : (
							<div
								className={cn(
									isTop ? "justify-start" : "justify-center",
									isBottom ? "justify-end" : "justify-center",
									"flex h-full w-full flex-col items-center gap-[2cqh]",
								)}
							>
								<p className="break-all text-center font-extralight text-[25cqmin] leading-tight lg:text-sm">
									{TileData.name.toLowerCase()}
								</p>
								{TileData.price && (
									<p className="text-center font-bold text-[25cqmin] text-yellow-400 lg:text-sm">
										${TileData.price}
									</p>
								)}
							</div>
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
										className={cn("h-full w-full object-cover")}
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
					{TileData.type === "subProperty" && (
						<div className={cn(positionClass, "h-full w-full p-[2cqmin]")}>
							<div className="relative h-full w-full">
								<Images
									alt={`${TileData.name.toLowerCase()}-${TileData.id}`}
									className="pixelated object-contain"
									fill
									src={
										TileData.name.toLowerCase() === "railway"
											? "/Images/train.svg"
											: TileData.name.toLowerCase() === "port"
												? "/Images/ship.png"
												: "/Images/plane.svg"
									}
								/>
							</div>
						</div>
					)}
					{TileData.type === "chance" && (
						<div className={cn(positionClass, "h-full w-full p-[2cqmin]")}>
							<div className="relative h-full w-full">
								<Images
									alt={`chest-${TileData.id}`}
									className="pixelated object-contain"
									fill
									src={`/Images/chest.svg`}
								/>
							</div>
						</div>
					)}
					{TileData.type === "go-to-jail" && (
						<div className={cn(positionClass, "h-full w-full p-[2cqmin]")}>
							<div className="relative h-full w-full">
								<Images
									alt={`police-${TileData.id}`}
									className="pixelated object-contain"
									fill
									src={`/Images/police.png`}
								/>
							</div>
						</div>
					)}
				</>
			)}

			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -mx-[2px] border-foreground border-x-2"
				style={{ borderColor: ownerColor }}
			/>
		</div>
	);
}
