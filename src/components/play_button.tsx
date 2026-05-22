"use client";
import { Activity, useEffect, useState } from "react";
import ChestUi from "@/components/chest-ui";
import { Button } from "@/components/ui/8bit/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/8bit/dialog";
import { toast } from "@/components/ui/8bit/toast";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import TileDataJson from "@/lib/tiledata";
import type {
	ChestResolutionReason,
	ChestResolutionResult,
	ChestSpinOutcome,
} from "@/lib/type";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function PlayButton({ game_id }: { game_id: string }) {
	const [diceValue, setDiceValue] = useState<number>(1);
	const [isRolling, setIsRolling] = useState<boolean>(false);
	const [buyProperty, setBuyProperty] = useState<boolean>(false);
	const [endTurnBtn, setEndTurnBtn] = useState<boolean>(false);
	const [hasRolled, setHasRolled] = useState<boolean>(false);
	const [endTurnFree, setEndTurnFree] = useState<boolean>(false);
	const [position, setPosition] = useState<number>(0);
	const [isEndingTurn, setIsEndingTurn] = useState<boolean>(false);
	const [awaitingTurnResolution, setAwaitingTurnResolution] =
		useState<boolean>(false);
	const [isChestOpen, setIsChestOpen] = useState<boolean>(false);
	const [chestResult, setChestResult] = useState<{
		open: boolean;
		title: string;
		description: string;
	}>({
		open: false,
		title: "",
		description: "",
	});
	const [pendingChestResult, setPendingChestResult] = useState<{
		title: string;
		description: string;
	} | null>(null);

	const { socket, emitEvent } = useSocketStore();
	const updatePlayer = useGameStore((state) => state.updatePlayer);
	const userId = useGameStore((state) => state.userId);
	const checkPropertyIsOwned = useGameStore(
		(state) => state.checkPropertyIsOwned,
	);
	const addProperty = useGameStore((state) => state.addProperty);
	const getRankOfProperty = useGameStore((state) => state.getRankOfProperty);
	const checkPropertyOwnedByPlayer = useGameStore(
		(state) => state.checkPropertyOwnedByPlayer,
	);
	const turn = useGameStore((state) => state.turn);
	const players = useGameStore((state) => state.players);
	const getPlayersMoney = useGameStore((state) => state.getPlayersMoney);

	const myPlayer = players.find((p) => p.id === userId);
	const myRank = myPlayer?.rank || -1;
	const isMyTurn = turn === myRank;
	const myMoney = getPlayersMoney(userId);
	const isBankrupt = myMoney <= 0;

	function onPlayClick() {
		if (isBankrupt) return;
		setEndTurnBtn(true);
		setHasRolled(true);
		setEndTurnFree(false);
		const diceRoll = Math.floor(Math.random() * 6) + 1;
		emitEvent(SOCKET_EVENTS.SEND_POSITION, diceRoll, game_id);
		emitEvent(SOCKET_EVENTS.SEND_DICE_ROLL, diceRoll, game_id);
	}
	const onBuyClick = () => {
		setBuyProperty(false);
		setEndTurnFree(true);
		const tile = TileDataJson[position];
		if (!tile) {
			console.error("Invalid tile position:", position);
			return;
		}
		addProperty(userId, tile.id);
		emitEvent(SOCKET_EVENTS.BUY_PROPERTY, tile.id, userId, game_id);
		const price = tile.price || 0;
		emitEvent(
			SOCKET_EVENTS.SEND_MONEY,
			-price,
			userId,
			game_id,
			"buy-property",
		);
	};
	const onAuctionClick = () => {
		setBuyProperty(false);
		setEndTurnFree(true);
		const tile = TileDataJson[position];
		if (!tile) return;
		emitEvent(SOCKET_EVENTS.START_AUCTION, tile.id, userId, game_id);
	};
	const onEndTurnClick = () => {
		setIsEndingTurn(true);
		setAwaitingTurnResolution(true);
		setEndTurnBtn(false); // Hide immediately for feedback
		setHasRolled(false);
		setBuyProperty(false);
		setEndTurnFree(false);
		setDiceValue(1);
		emitEvent(SOCKET_EVENTS.SEND_TURN, turn, game_id);
	};

	const handleChestResolve = ({
		reason,
		spin,
	}: {
		reason: ChestResolutionReason;
		spin?: ChestSpinOutcome;
	}) => {
		return new Promise<void>((resolve) => {
			emitEvent(
				SOCKET_EVENTS.RESOLVE_CHEST,
				game_id,
				reason,
				spin,
				(result: ChestResolutionResult) => {
					setEndTurnFree(true);
					setPendingChestResult({
						title: result.title,
						description: `${result.description} ${result.rewardText}`,
					});
					resolve();
				},
			);
		});
	};

	useEffect(() => {
		if (isChestOpen || !pendingChestResult) return;
		setChestResult({
			open: true,
			title: pendingChestResult.title,
			description: pendingChestResult.description,
		});
		setPendingChestResult(null);
	}, [isChestOpen, pendingChestResult]);
	// Reset local state whenever the turn changes globally
	// biome-ignore lint/correctness/useExhaustiveDependencies: <Idk I forgot>
	useEffect(() => {
		setEndTurnBtn(false);
		setHasRolled(false);
		setEndTurnFree(false);
		setBuyProperty(false);
		setIsEndingTurn(false);
	}, [turn]);

	useEffect(() => {
		if (!socket) return;
		let interval: NodeJS.Timeout | null = null;
		let timeout: NodeJS.Timeout | null = null;
		let moveTimeout: NodeJS.Timeout | null = null;

		const handleDiceRoll = (diceRoll: number) => {
			setIsRolling(true);
			interval = setInterval(() => {
				setDiceValue(Math.floor(Math.random() * 6) + 1);
			}, 100);
			timeout = setTimeout(() => {
				if (interval) clearInterval(interval);

				setDiceValue(diceRoll);

				setIsRolling(false);
			}, 1000);
		};
		const playerMoveListener = (position: number, player_id: string) => {
			moveTimeout = setTimeout(() => {
				updatePlayer(player_id, { position });
				setPosition(position);
				if (player_id === userId) {
					// Only send money update if this is the current player who moved
					const tile = TileDataJson[position];
					if (!tile) {
						console.error("Invalid tile position:", position);
						return;
					}
					const propertyOwner = checkPropertyIsOwned(tile.id);
					if (tile.type === "tax") {
						emitEvent(SOCKET_EVENTS.COLLECT_TAX, userId, game_id);
						setEndTurnFree(true);
						return;
					}
					if (tile.type === "go-to-jail") {
						emitEvent(SOCKET_EVENTS.GO_TO_JAIL, userId, game_id);
						return;
					}
					if (tile.type === "chance") {
						setBuyProperty(false);
						setEndTurnFree(false);
						setIsChestOpen(true);
						return;
					}
					if (tile.buyable && propertyOwner === false) {
						// Property is not owned, show buy option
						setBuyProperty(true);
						// End Turn remains disabled until buy button is clicked
						return;
					} else {
						setBuyProperty(false);
						setEndTurnFree(true);
						// Property is owned
						const isOwnedByMe = checkPropertyOwnedByPlayer(userId, tile.id);
						if (isOwnedByMe) {
							// Owned by me, do nothing
							return;
						}
						if (
							propertyOwner &&
							(tile.type === "property" || tile.type === "subProperty")
						) {
							// Property is owned by another player, charge rent
							let amountToDeduct: number;
							if (tile.type === "subProperty") {
								// Check if owner owns all 3 railroads (IDs: 4, 14, 26)
								const railroadIds = [4, 14, 26];
								const ownsAllRailroads =
									userId &&
									railroadIds.every((id) =>
										checkPropertyOwnedByPlayer(userId, id),
									);
								amountToDeduct = ownsAllRailroads ? 500 : 200;
							} else {
								const rent = tile.rent!;
								const propertyRank = getRankOfProperty(tile.id);
								amountToDeduct = rent[propertyRank]!;
							}
							emitEvent(
								SOCKET_EVENTS.SEND_MONEY,
								-1 * amountToDeduct,
								userId,
								game_id,
								"pay-rent",
							);
						}
					}
				} else {
					setBuyProperty(false);
				}
			}, 1000);
		};

		const receiveTurnListener = (nextTurn: number) => {
			if (!awaitingTurnResolution) return;

			setAwaitingTurnResolution(false);
			setIsEndingTurn(false);
			if (nextTurn === myRank) {
				toast("Rolled 6! Play again.");
			}
		};

		socket.on(SOCKET_EVENTS.GET_DICE_ROLL, handleDiceRoll);
		socket.on(SOCKET_EVENTS.RECEIVE_POSITION, playerMoveListener);
		socket.on(SOCKET_EVENTS.RECEIVE_TURN, receiveTurnListener);
		return () => {
			if (interval) clearInterval(interval);
			if (timeout) clearTimeout(timeout);
			if (moveTimeout) clearTimeout(moveTimeout);
			socket.off(SOCKET_EVENTS.GET_DICE_ROLL, handleDiceRoll);
			socket.off(SOCKET_EVENTS.RECEIVE_POSITION, playerMoveListener);
			socket.off(SOCKET_EVENTS.RECEIVE_TURN, receiveTurnListener);
		};
	}, [
		socket,
		updatePlayer,
		userId,
		myRank,
		awaitingTurnResolution,
		checkPropertyIsOwned,
		emitEvent,
		game_id,
		checkPropertyOwnedByPlayer,
		getRankOfProperty,
	]);

	return (
		<>
			<Dialog
				onOpenChange={(open) => {
					setChestResult((previous) => ({ ...previous, open }));
				}}
				open={chestResult.open}
			>
				<DialogContent className="w-full max-w-md" showCloseButton={false}>
					<DialogTitle>{chestResult.title || "Chest Result"}</DialogTitle>
					<DialogDescription>{chestResult.description}</DialogDescription>
					<DialogFooter>
						<Button
							onClick={() => {
								setChestResult((previous) => ({ ...previous, open: false }));
							}}
						>
							OK
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<ChestUi
				onOpenChange={setIsChestOpen}
				onResolve={handleChestResolve}
				open={isChestOpen}
			/>
			<div
				className="h-[12cqmin] w-[12cqmin]"
				style={{
					backgroundImage: "url('/Images/six_sided_die.png')",
					backgroundPosition: `${(diceValue - 1) * 20}% ${isRolling ? 100 : 0}%`, // Adjust for different sprites 0 20 40 60 80 100
					backgroundSize: "600%",
					imageRendering: "pixelated",
				}}
			/>
			<div className="flex flex-col lg:flex-row items-center gap-[4cqmin]">
				<Activity mode={isMyTurn && !hasRolled ? "visible" : "hidden"}>
					<Button
						className="h-auto px-[3cqmin] py-[2.5cqmin] text-[3cqmin] lg:px-[2cqmin] lg:py-[2cqmin] lg:text-[2.5cqmin]"
						disabled={isRolling || buyProperty || isEndingTurn || isBankrupt}
						onClick={onPlayClick}
					>
						Play
					</Button>
				</Activity>

				<Activity mode={endTurnBtn && !buyProperty ? "visible" : "hidden"}>
					<Button
						className="h-auto px-[3cqmin] py-[2.5cqmin] text-[3cqmin] lg:px-[2cqmin] lg:py-[2cqmin] lg:text-[2.5cqmin]"
						disabled={!endTurnFree || isEndingTurn || isBankrupt}
						onClick={onEndTurnClick}
						variant={"destructive"}
					>
						End Turn
					</Button>
				</Activity>
				<Activity mode={buyProperty ? "visible" : "hidden"}>
					<div className="flex flex-col lg:flex-row gap-[4cqmin]">
						<Button
							className="h-auto px-[3cqmin] py-[2.5cqmin] text-[3cqmin] lg:px-[2cqmin] lg:py-[2cqmin] lg:text-[2.5cqmin]"
							disabled={isBankrupt}
							onClick={onBuyClick}
							variant="secondary"
						>
							Buy
						</Button>
						<Button
							className="h-auto px-[3cqmin] py-[2.5cqmin] text-[3cqmin] lg:px-[2cqmin] lg:py-[2cqmin] lg:text-[2.5cqmin] bg-yellow-500 hover:bg-yellow-600"
							disabled={isBankrupt}
							onClick={onAuctionClick}
						>
							Auction
						</Button>
					</div>
				</Activity>
			</div>
			<Activity mode={!isMyTurn ? "visible" : "hidden"}>
				<div className="text-center text-[3cqmin] text-neutral-500">
					{players.find((p) => p.rank === turn)?.username}'s is playing
				</div>
			</Activity>
		</>
	);
}
