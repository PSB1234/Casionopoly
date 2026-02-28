"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import TileDataJson from "@/lib/tiledata";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
// TODO:FIX DICE BUG WHERE ROLLING IS SHOWN TO EVERYONE RATHER THAN JUST THE PLAYER WHO ROLLED IT
export default function PlayButton({ game_id }: { game_id: string }) {
	const [diceValue, setDiceValue] = useState<number>(1);
	const [isRolling, setIsRolling] = useState<boolean>(false);
	const [buyProperty, setBuyProperty] = useState<boolean>(false);
	const [endTurnBtn, setEndTurnBtn] = useState<boolean>(false);
	const [hasRolled, setHasRolled] = useState<boolean>(false);
	const [endTurnFree, setEndTurnFree] = useState<boolean>(false);
	const [position, setPosition] = useState<number>(0);
	const { socket, emitEvent } = useSocketStore();
	const updatePlayer = useGameStore((state) => state.updatePlayer);
	const userId = useGameStore((state) => state.userId);
	const checkPropertyIsOwned = useGameStore((state) => state.checkPropertyIsOwned);
	const addProperty = useGameStore((state) => state.addProperty);
	const getRankOfProperty = useGameStore((state) => state.getRankOfProperty);
	const checkPropertyOwnedByPlayer = useGameStore((state) => state.checkPropertyOwnedByPlayer);
	const turn = useGameStore((state) => state.turn);
	const players = useGameStore((state) => state.players);

	const myPlayer = players.find((p) => p.id === userId);
	const myRank = myPlayer?.rank || -1;
	const isMyTurn = turn === myRank;

	function onPlayClick() {
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
		emitEvent(SOCKET_EVENTS.SEND_MONEY, -price, userId, game_id);
	};
	const onEndTurnClick = () => {
		setEndTurnBtn(false);
		setHasRolled(false);
		setDiceValue(1);
		emitEvent(SOCKET_EVENTS.SEND_TURN, turn, game_id);
	};
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
			console.log("Received dice roll from server", diceRoll);
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

						if (propertyOwner) {
							// Property is owned by another player, charge rent
							let amountToDeduct: number;
							if (tile.type === "railroad") {
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
							);
						}
					}
				} else {
					setBuyProperty(false);
				}
			}, 1000);
		};

		socket.on(SOCKET_EVENTS.GET_DICE_ROLL, handleDiceRoll);
		socket.on(SOCKET_EVENTS.RECEIVE_POSITION, playerMoveListener);
		socket.on(SOCKET_EVENTS.RECEIVE_TURN, (_turn) => {
			setEndTurnBtn(false);
			setHasRolled(false);
		});
		return () => {
			if (interval) clearInterval(interval);
			if (timeout) clearTimeout(timeout);
			if (moveTimeout) clearTimeout(moveTimeout);
			socket.off(SOCKET_EVENTS.GET_DICE_ROLL, handleDiceRoll);
			socket.off(SOCKET_EVENTS.RECEIVE_POSITION, playerMoveListener);
		};
	}, [
		socket,
		updatePlayer,
		userId,
		checkPropertyIsOwned,
		emitEvent,
		game_id,
		checkPropertyOwnedByPlayer,
		getRankOfProperty,
	]);

	return (
		<>
			<div
				className="h-20 w-20"
				style={{
					backgroundImage: "url('/Images/six_sided_die.png')",
					backgroundPosition: `${(diceValue - 1) * 20}% ${isRolling ? 100 : 0}%`, // Adjust for different sprites 0 20 40 60 80 100
					backgroundSize: "600%",
					imageRendering: "pixelated",
				}}
			/>
			<div className="flex flex-row gap-4">
				{isMyTurn && !hasRolled && (
					<Button disabled={isRolling || buyProperty} onClick={onPlayClick}>
						Play
					</Button>
				)}
				{endTurnBtn && (
					<Button
						disabled={!endTurnFree}
						onClick={onEndTurnClick}
						variant={"destructive"}
					>
						End Turn
					</Button>
				)}
				{buyProperty && (
					<Button onClick={onBuyClick} variant="secondary">
						Buy
					</Button>
				)}
			</div>
			{!isMyTurn && (
				<div className="text-center text-neutral-500 text-sm">
					{players.find((p) => p.rank === turn)?.username}'s is playing
				</div>
			)}
		</>
	);
}
