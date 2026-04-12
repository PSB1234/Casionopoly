"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/8bit/dialog";
import type {
	ChestResolutionReason,
	ChestSpinOutcome,
	ChestSymbol,
} from "@/lib/type";

interface ChestUiProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onResolve: (payload: {
		reason: ChestResolutionReason;
		spin?: ChestSpinOutcome;
	}) => Promise<void> | void;
}

const SLOT_SYMBOLS_1 = ["COIN", "STAR", "GEM", "BOLT", "LUCK", "x2"] as const;
const SLOT_SYMBOLS_2 = ["STAR", "COIN", "BOLT", "GEM", "x2", "LUCK"] as const;
const SLOT_SYMBOLS_3 = ["GEM", "LUCK", "COIN", "x2", "STAR", "BOLT"] as const;
const SLOT_REELS = [SLOT_SYMBOLS_1, SLOT_SYMBOLS_2, SLOT_SYMBOLS_3] as const;
const REWARD_BY_SYMBOL: Record<ChestSymbol, number> = {
	COIN: 0,
	STAR: 10,
	GEM: 20,
	BOLT: 30,
	LUCK: 40,
	x2: 50,
};
export default function ChestUi({
	open,
	onOpenChange,
	onResolve,
}: ChestUiProps) {
	const [isResolving, setIsResolving] = useState(false);
	const [slotOneIndex, setSlotOneIndex] = useState(0);
	const [slotOneIsTransitioning, setSlotOneIsTransitioning] = useState(false);
	const [slotTwoIndex, setSlotTwoIndex] = useState(0);
	const [slotTwoIsTransitioning, setSlotTwoIsTransitioning] = useState(false);
	const [slotThreeIndex, setSlotThreeIndex] = useState(0);
	const [slotThreeIsTransitioning, setSlotThreeIsTransitioning] = useState(false);
	const spinIntervalRef = useRef<number | null>(null);
	const spinIntervalRef2 = useRef<number | null>(null);
	const spinIntervalRef3 = useRef<number | null>(null);
	const wrapTimeoutRef = useRef<number | null>(null);
	const wrapTimeoutRef2 = useRef<number | null>(null);
	const wrapTimeoutRef3 = useRef<number | null>(null);
	const slotSymbolRefs = useRef<Array<Array<HTMLDivElement | null>>>([
		[],
		[],
		[],
	]);

	function setSlotSymbolRef(reelIndex: number, symbolIndex: number) {
		return (element: HTMLDivElement | null) => {
			slotSymbolRefs.current[reelIndex] ??= [];
			slotSymbolRefs.current[reelIndex][symbolIndex] = element;
		};
	}

	function startSlotOneSpin() {
		if (spinIntervalRef.current !== null) {
			window.clearInterval(spinIntervalRef.current);
		}
		if (wrapTimeoutRef.current !== null) {
			window.clearTimeout(wrapTimeoutRef.current);
		}

		setSlotOneIsTransitioning(true);

		spinIntervalRef.current = window.setInterval(() => {
			setSlotOneIndex((currentIndex) => {
				if (currentIndex === SLOT_SYMBOLS_1.length - 1) {
					wrapTimeoutRef.current = window.setTimeout(() => {
						setSlotOneIsTransitioning(false);
						setSlotOneIndex(0);
						window.requestAnimationFrame(() => {
							setSlotOneIsTransitioning(true);
						});
					}, 150);

					return currentIndex + 1;
				}

				return currentIndex + 1;
			});
		}, 300);
	}

	function startSlotTwoSpin() {
		if (spinIntervalRef2.current !== null) {
			window.clearInterval(spinIntervalRef2.current);
		}
		if (wrapTimeoutRef2.current !== null) {
			window.clearTimeout(wrapTimeoutRef2.current);
		}

		setSlotTwoIsTransitioning(true);

		spinIntervalRef2.current = window.setInterval(() => {
			setSlotTwoIndex((currentIndex) => {
				if (currentIndex === SLOT_SYMBOLS_2.length - 1) {
					wrapTimeoutRef2.current = window.setTimeout(() => {
						setSlotTwoIsTransitioning(false);
						setSlotTwoIndex(0);
						window.requestAnimationFrame(() => {
							setSlotTwoIsTransitioning(true);
						});
					}, 150);

					return currentIndex + 1;
				}

				return currentIndex + 1;
			});
		}, 200);
	}

	function startSlotThreeSpin() {
		if (spinIntervalRef3.current !== null) {
			window.clearInterval(spinIntervalRef3.current);
		}
		if (wrapTimeoutRef3.current !== null) {
			window.clearTimeout(wrapTimeoutRef3.current);
		}

		setSlotThreeIsTransitioning(true);

		spinIntervalRef3.current = window.setInterval(() => {
			setSlotThreeIndex((currentIndex) => {
				if (currentIndex === SLOT_SYMBOLS_3.length - 1) {
					wrapTimeoutRef3.current = window.setTimeout(() => {
						setSlotThreeIsTransitioning(false);
						setSlotThreeIndex(0);
						window.requestAnimationFrame(() => {
							setSlotThreeIsTransitioning(true);
						});
					}, 150);

					return currentIndex + 1;
				}

				return currentIndex + 1;
			});
		}, 100);
	}

	function startAllSlotsSpin() {
		startSlotOneSpin();
		startSlotTwoSpin();
		startSlotThreeSpin();
	}

	const stopAllSlotsSpin = useCallback(() => {
		if (spinIntervalRef.current !== null) {
			window.clearInterval(spinIntervalRef.current);
			spinIntervalRef.current = null;
		}
		if (spinIntervalRef2.current !== null) {
			window.clearInterval(spinIntervalRef2.current);
			spinIntervalRef2.current = null;
		}
		if (spinIntervalRef3.current !== null) {
			window.clearInterval(spinIntervalRef3.current);
			spinIntervalRef3.current = null;
		}
		if (wrapTimeoutRef.current !== null) {
			window.clearTimeout(wrapTimeoutRef.current);
			wrapTimeoutRef.current = null;
		}
		if (wrapTimeoutRef2.current !== null) {
			window.clearTimeout(wrapTimeoutRef2.current);
			wrapTimeoutRef2.current = null;
		}
		if (wrapTimeoutRef3.current !== null) {
			window.clearTimeout(wrapTimeoutRef3.current);
			wrapTimeoutRef3.current = null;
		}
		setSlotOneIsTransitioning(false);
		setSlotTwoIsTransitioning(false);
		setSlotThreeIsTransitioning(false);
	}, []);

	function getSpinOutcome(): ChestSpinOutcome {
		const slotOneSymbol =
			SLOT_SYMBOLS_1[slotOneIndex % SLOT_SYMBOLS_1.length] ?? SLOT_SYMBOLS_1[0];
		const slotTwoSymbol =
			SLOT_SYMBOLS_2[slotTwoIndex % SLOT_SYMBOLS_2.length] ?? SLOT_SYMBOLS_2[0];
		const slotThreeSymbol =
			SLOT_SYMBOLS_3[slotThreeIndex % SLOT_SYMBOLS_3.length] ?? SLOT_SYMBOLS_3[0];
		const symbols: ChestSpinOutcome["symbols"] = [
			slotOneSymbol,
			slotTwoSymbol,
			slotThreeSymbol,
		];
		const rewardScore = symbols.reduce(
			(total: number, symbol: ChestSymbol) => total + REWARD_BY_SYMBOL[symbol],
			0,
		);

		return { symbols, rewardScore };
	}

	async function handleStopClick() {
		if (isResolving) return;
		stopAllSlotsSpin();
		setIsResolving(true);
		try {
			await onResolve({ reason: "stopped", spin: getSpinOutcome() });
			onOpenChange(false);
		} finally {
			setIsResolving(false);
		}
	}

	useEffect(() => {
		return () => {
			stopAllSlotsSpin();
		};
	}, [stopAllSlotsSpin]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Chest Reward Machine</DialogTitle>
					<DialogDescription>
						Spin all three reels and stop to claim your chest reward.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-3 gap-5 py-3 *:relative *:flex *:h-32 *:flex-col *:items-center *:gap-15 *:overflow-y-clip *:border-foreground *:border-y-6 *:p-0!">
					{SLOT_REELS.map((reel, reelIndex) => (
						<div key={reel.join("-")}>
							{reelIndex === 0 && (
								<div
									className="flex h-32 w-full flex-col items-center justify-start"
									style={{
										transform: `translateY(-${slotOneIndex * 100}%)`,
										transitionProperty: slotOneIsTransitioning ? "transform" : "none",
										transitionDuration: "220ms",
										transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
									}}
								>
									{reel.map((symbol, symbolIndex) => (
										<div
											className="flex h-32 w-full shrink-0 items-center justify-center"
											key={symbol}
											ref={setSlotSymbolRef(reelIndex, symbolIndex)}
										>
											{symbol}
										</div>
									))}
									<div
										className="flex h-32 w-full shrink-0 items-center justify-center"
										key="slot-one-loop"
										ref={setSlotSymbolRef(reelIndex, reel.length)}
									>
										{reel[0]}
									</div>
								</div>
							)}
							{reelIndex === 1 && (
								<div
									className="flex h-32 w-full flex-col items-center justify-start"
									style={{
										transform: `translateY(-${slotTwoIndex * 100}%)`,
										transitionProperty: slotTwoIsTransitioning ? "transform" : "none",
										transitionDuration: "220ms",
										transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
									}}
								>
									{reel.map((symbol, symbolIndex) => (
										<div
											className="flex h-32 w-full shrink-0 items-center justify-center"
											key={symbol}
											ref={setSlotSymbolRef(reelIndex, symbolIndex)}
										>
											{symbol}
										</div>
									))}
									<div
										className="flex h-32 w-full shrink-0 items-center justify-center"
										key="slot-two-loop"
										ref={setSlotSymbolRef(reelIndex, reel.length)}
									>
										{reel[0]}
									</div>
								</div>
							)}
							{reelIndex === 2 && (
								<div
									className="flex h-32 w-full flex-col items-center justify-start"
									style={{
										transform: `translateY(-${slotThreeIndex * 100}%)`,
										transitionProperty: slotThreeIsTransitioning
											? "transform"
											: "none",
										transitionDuration: "220ms",
										transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
									}}
								>
									{reel.map((symbol, symbolIndex) => (
										<div
											className="flex h-32 w-full shrink-0 items-center justify-center"
											key={symbol}
											ref={setSlotSymbolRef(reelIndex, symbolIndex)}
										>
											{symbol}
										</div>
									))}
									<div
										className="flex h-32 w-full shrink-0 items-center justify-center"
										key="slot-three-loop"
										ref={setSlotSymbolRef(reelIndex, reel.length)}
									>
										{reel[0]}
									</div>
								</div>
							)}
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 -mx-1.5 border-foreground border-x-6 dark:border-ring"
							/>
						</div>
					))}
				</div>
				<DialogFooter className="flex w-full gap-6">
					<Button
						disabled={isResolving}
						onClick={startAllSlotsSpin}
						type="button"
						variant="secondary"
					>
						Start
					</Button>
					<Button
						disabled={isResolving}
						onClick={handleStopClick}
						type="button"
						variant="destructive"
					>
						Stop
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
