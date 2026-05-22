import Images from "next/image";
import { useState, useRef, useEffect } from "react";
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
	const displayTileName = TileData.type === "chance" ? "Casino" : TileData.name;

	const [showTooltip, setShowTooltip] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const handlePointerEnter = (e: React.PointerEvent) => {
		if (e.pointerType === "mouse") {
			setShowTooltip(true);
		}
	};

	const handlePointerLeave = (e: React.PointerEvent) => {
		if (e.pointerType === "mouse") {
			setShowTooltip(false);
		} else if (e.pointerType === "touch") {
			if (timerRef.current) clearTimeout(timerRef.current);
			setShowTooltip(false);
		}
	};

	const handlePointerDown = (e: React.PointerEvent) => {
		if (e.pointerType === "touch") {
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				setShowTooltip(true);
			}, 2000);
		}
	};

	const handlePointerUp = (e: React.PointerEvent) => {
		if (e.pointerType === "touch") {
			if (timerRef.current) clearTimeout(timerRef.current);
			setShowTooltip(false);
		}
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

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

	let tooltipClass = "";
	if (isTop) {
		tooltipClass = "top-full left-1/2 -translate-x-1/2 mt-2";
	} else if (isBottom) {
		tooltipClass = "bottom-full left-1/2 -translate-x-1/2 mb-2";
	} else if (isLeft) {
		tooltipClass = "left-full top-1/2 -translate-y-1/2 ml-2";
	} else if (isRight) {
		tooltipClass = "right-full top-1/2 -translate-y-1/2 mr-2";
	} else {
		if (TileData.id === 0) tooltipClass = "top-full left-full mt-2 ml-2";
		else if (TileData.id === 8) tooltipClass = "top-full right-full mt-2 mr-2";
		else if (TileData.id === 16) tooltipClass = "bottom-full right-full mb-2 mr-2";
		else if (TileData.id === 24) tooltipClass = "bottom-full left-full mb-2 ml-2";
	}

	return (
		<div
			className={cn(
				"@container-[size] select-none relative flex h-full min-h-0 w-full min-w-0 flex-row justify-between border-foreground border-y-2",
				className,
			)}
			style={{ borderColor: ownerColor }}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			onContextMenu={(e) => {
				if (showTooltip) e.preventDefault();
			}}
		>
			{showTooltip && (
				<div className={cn("absolute z-[100] rounded-md bg-black/90 px-3 py-1.5 text-sm text-white shadow-lg pointer-events-none w-max border border-white/20", tooltipClass)}>
					{displayTileName}
				</div>
			)}
			{TileData.type === "jail" ? (
				<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
					<p className="px-[5cqmin] pt-[2cqmin] text-[12cqmin] leading-tight lg:px-4 lg:pt-1 lg:text-xs">
						Bypass
					</p>
					<div className="relative flex h-[65%] w-[65%] border-foreground border-t-2 border-r-2 p-0">
						<Images
							alt={`jail-${TileData.id}`}
							className="pixelated pointer-events-none object-contain"
							fill
							src={`/Images/prison.svg`}
						/>
					</div>
				</div>
			) : TileData.type === "Vacation" ? (
				<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
					<p className="flex w-full justify-center py-[2cqh] text-center text-[12cqw] lg:text-[14cqw]">
						{displayTileName.toLowerCase()}
					</p>
					<div className="relative flex h-2/3 p-0">
						<Images
							alt={`vacation-${TileData.id}`}
							className="pixelated pointer-events-none object-contain"
							fill
							src={`/Images/vacation.png`}
						/>
					</div>
				</div>
			) : TileData.type === "tax" ? (
				<div className="m-0 flex h-full w-full flex-col justify-between text-clip p-0">
					<p className="flex w-full justify-center py-[2cqh] text-center text-[12cqw] lg:text-[14cqw]">
						{displayTileName.toLowerCase()}
					</p>
					<div className="relative flex h-2/3 p-0">
						<Images
							alt={`tax-${TileData.id}`}
							className="pixelated pointer-events-none object-contain"
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
									className="relative flex h-full w-full justify-center"
								>
									{rank > 0 && rank <= 5 && (
										<Images
											alt={`house-${rank}`}
											className="pointer-events-none object-contain"
											fill
											src={`/upgrade-icons/house-${rank - 1}.svg`}
										/>
									)}
								</div>
								<p className="break-all text-center font-medium text-[25cqmin] leading-tight lg:text-sm" style={{color:ownerColor}}>
									{displayTileName.toLowerCase()}
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
								<p className="break-all text-center font-extralight text-[25cqmin] leading-tight lg:text-sm" style={{color:ownerColor}}>
									{displayTileName.toLowerCase()}

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
										className="pointer-events-none h-full w-full object-cover"
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
						<div
							className={cn(
								positionClass,
								"h-full w-full border-foreground p-[2cqmin]",
							)}
							style={{ borderColor: ownerColor }}
						>
							<div className="relative h-full w-full">
								<Images
									alt={`${TileData.name.toLowerCase()}-${TileData.id}`}
									className="pixelated pointer-events-none object-contain"
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
						<div
							className={cn(
								positionClass,
								"h-full w-full border-foreground p-[2cqmin]",
							)}
							style={{ borderColor: ownerColor }}
						>
							<div className="relative h-full w-full">
								<Images
									alt={`chest-${TileData.id}`}
									className="pixelated pointer-events-none object-contain"
									fill
									src={`/Images/chest.svg`}
								/>
							</div>
						</div>
					)}
					{TileData.type === "go-to-jail" && (
						<div
							className={cn(
								positionClass,
								"h-full w-full border-foreground p-[2cqmin]",
							)}
							style={{ borderColor: ownerColor }}
						>
							<div className="relative h-full w-full">
								<Images
									alt={`police-${TileData.id}`}
									className="pixelated pointer-events-none object-contain"
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
				className="pointer-events-none absolute inset-0 -mx-0.5 border-foreground border-x-2"
				style={{ borderColor: ownerColor }}
			/>
		</div>
	);
}
