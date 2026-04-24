import type { Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TradeData } from "@/components/tradeList";
import { toast } from "@/components/ui/8bit/toast";
import { generateColorPair } from "@/lib/random_color";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import TileDataJson from "@/lib/tiledata";
import type {
	ClientToServerEvents,
	MoneyUpdatePayload,
	Player,
	PropertySchema,
	ServerToClientEvents,
	tradeDisplaySchema,
} from "@/lib/type";

const MAX_GAME_LOGS = 80;
const inrFormatter = new Intl.NumberFormat("en-IN");

const formatSignedRupees = (amount: number) => {
	const absAmount = Math.abs(amount);
	const sign = amount >= 0 ? "+" : "-";
	return `${sign}Rs.${inrFormatter.format(absAmount)}`;
};

const formatMoneySource = (
	payload: MoneyUpdatePayload,
	actorName: string,
	targetName?: string,
) => {
	switch (payload.source) {
		case "buy-property":
			return `${actorName} bought a property (${formatSignedRupees(payload.delta)}).`;
		case "pay-rent":
			return targetName
				? `${actorName} paid rent to ${targetName} (${formatSignedRupees(payload.delta)}).`
				: `${actorName} paid rent (${formatSignedRupees(payload.delta)}).`;
		case "tax":
			return `${actorName} paid tax (${formatSignedRupees(payload.delta)}).`;
		case "chest":
			return `${actorName} chest event${payload.eventTitle ? `: ${payload.eventTitle}` : ""} (${formatSignedRupees(payload.delta)}).`;
		case "upgrade":
			return `${actorName} upgraded a property (${formatSignedRupees(payload.delta)}).`;
		case "trade":
			return targetName
				? `${actorName} trade with ${targetName} (${formatSignedRupees(payload.delta)}).`
				: `${actorName} trade settlement (${formatSignedRupees(payload.delta)}).`;
		case "pass-start":
			return `${actorName} passed Start (${formatSignedRupees(payload.delta)}).`;
		default:
			return `${actorName} balance update (${formatSignedRupees(payload.delta)}).`;
	}
};

export type GameLogEntry = {
	id: string;
	message: string;
	timestamp: number;
};

export interface GameStoreState {
	players: Player[];
	logs: GameLogEntry[];
	username: string;
	userId: string;
	currentRoomKey: string;
	turn: number;
	lastTurnLog: number | null;
	color: string;
	votedPlayers: string[];
	trade: tradeDisplaySchema[];
	timerSeconds: number;
	showInactivityWarning: boolean;
	inactivityCountdown: number;
	isTradeDialogOpen: boolean;
	isNavigating: boolean;
	hasFinished: boolean;
}

export interface GameStoreActions {
	initializeSocket: (
		roomKey: string,
		Socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
	) => void;
	getPlayerCount: () => number;
	setState: (state: Partial<GameStoreState>) => void;
	setUsername: (username: string) => void;
	setPlayers: (players: Player[]) => void;
	setColor: (color: string) => void;
	getColorOfUser: (playerId: string) => string | undefined;
	getColorByPropertyIndex: (propertyIndex: number) => string | undefined;
	setVotedPlayers: (playerIds: string[]) => void;
	addProperty: (playerId: string, propertyIndex: number) => void;
	getPlayersMoney: (playerId: string) => number;
	totalPropertyInGroup: (propertyGroup: number) => number;
	checkIfPropertyGroupIsOwnedByPlayer: (
		playerId: string,
		propertyIndex: number,
	) => boolean;
	checkPropertyIsOwned: (propertyIndex: number) => boolean;
	checkPropertyOwnedByPlayer: (
		playerId: string,
		propertyIndex: number,
	) => boolean;
	getPropertyCount: (playerId: string) => number;
	getProperty: (playerId: string) => PropertySchema[];
	getRankOfProperty: (propertyIndex: number) => number;
	getPropertyGroupById: (tileId: number) => number;
	removeProperty: (playerId: string, propertyIndex: number) => void;
	upgradeProperty: (
		playerId: string,
		socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
		propertyIndex: number,
		roomKey: string,
		upgradeCost: number,
	) => void;
	updatePlayer: (id: string, updates: Partial<Player>) => void;
	isThisPlayerLeader: () => boolean;
	sendVote: (
		roomKey: string,
		playerId: string,
		socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
	) => void;
	sendTrade: (
		roomKey: string,
		userId: string,
		playerId: string,
		socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
		tradeData: { offer: TradeData; request: TradeData },
	) => void;
	acceptTrade: (
		fromPlayer: string,
		toPlayer: string,
		roomKey: string,
		socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
		tradeData: { offer: TradeData; request: TradeData },
		status: "accepted" | "rejected",
	) => void;
	displayTrade: () => tradeDisplaySchema[];
	getUsernameById: (playerId: string) => string | undefined;
	setTradeDialogOpen: (isOpen: boolean) => void;
	setIsNavigating: (isNavigating: boolean) => void;
	setHasFinished: (hasFinished: boolean) => void;
	addLog: (message: string) => void;
	clearLogs: () => void;
}

export type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
	persist(
		(set, get) => ({
			players: [],
			logs: [],
			username: "",
			userId: "",
			currentRoomKey: "",
			color: "",
			turn: 1,
			lastTurnLog: null,
			votedPlayers: [],
			trade: [],
			timerSeconds: 0,
			showInactivityWarning: false,
			inactivityCountdown: 0,
			isTradeDialogOpen: false,
			isNavigating: false,
			hasFinished: false,
			initializeSocket: (
				roomKey: string,
				socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
			) => {
				if (!socket) return;
				if (get().currentRoomKey !== roomKey) {
					set({ currentRoomKey: roomKey, logs: [], lastTurnLog: null });
				}
				const joinRoom = () => {
					const { username, userId, color } = get();
					let finalColor = color;
					if (!finalColor) {
						const { original } = generateColorPair();
						finalColor = original;
						set({ color: finalColor });
					}
					// Emit JOIN_ROOM with stored username
					socket.emit(
						SOCKET_EVENTS.JOIN_ROOM,
						username,
						roomKey,
						finalColor,
						undefined,
						(username: string, playerList: Player[]) => {
							// Server sends back the confirmed username and player list
							set({ username, players: playerList });
						},
					);
				};
				// Listen for game loop broadcasts (other players joining)
				const handleGameLoop = (receivedRoomKey: string, player: Player) => {
					if (receivedRoomKey !== roomKey) return;
					set((state) => {
						const playerIndex = state.players.findIndex(
							(p) => p.id === player.id,
						);
						if (playerIndex !== -1) {
							// Update existing player with latest data from server
							const updatedPlayers = [...state.players];
							updatedPlayers[playerIndex] = player;
							return { players: updatedPlayers };
						}
						return {
							logs: [
								...state.logs,
								{
									id: crypto.randomUUID(),
									message: `${player.username} joined the game.`,
									timestamp: Date.now(),
								},
							].slice(-MAX_GAME_LOGS),
							players: [...state.players, player],
						};
					});
				};
				const handlePlayerLeft = (playerId: string) => {
					const leavingPlayer = get().players.find((player) => player.id === playerId);
					if (get().userId === playerId) {
						get().addLog("You were removed from the game.");
						window.location.href = "/";
					} else {
						set((state) => ({
							logs: [
								...state.logs,
								{
									id: crypto.randomUUID(),
									message: `${leavingPlayer?.username ?? "A player"} left the game.`,
									timestamp: Date.now(),
								},
							].slice(-MAX_GAME_LOGS),
							players: state.players.filter((p) => p.id !== playerId),
						}));
					}
				};
				const handleReceiveMoney = (money: number, userId: string) => {
					set((state) => {
						return {
							players: state.players.map((p) =>
								p.id === userId ? { ...p, money } : p,
							),
						};
					});
				};

				const handlePropertyBought = (propertyId: number, userId: string) => {
					get().addProperty(userId, propertyId);
					const username = get().getUsernameById(userId) ?? "A player";
					const propertyName =
						TileDataJson.find((tile) => tile.id === propertyId)?.name ??
						`Property ${propertyId}`;
					get().addLog(`${username} bought ${propertyName}.`);
				};

				const handleReceiveTurn = (turn: number) => {
					const { lastTurnLog } = get();
					const shouldSkipLog = lastTurnLog === turn;

					set({ turn });

					if (shouldSkipLog) return;

					const nextPlayer = get().players.find((player) => player.rank === turn);
					if (nextPlayer) {
						get().addLog(`Turn: ${nextPlayer.username}.`);
						set({ lastTurnLog: turn });
					}
				};

				const handleReceiveMoneyUpdate = (payload: MoneyUpdatePayload) => {
					set((state) => ({
						players: state.players.map((p) =>
							p.id === payload.userId ? { ...p, money: payload.newBalance } : p,
						),
					}));

					if (payload.delta === 0) return;

					const actorName = get().getUsernameById(payload.userId) ?? "A player";
					const targetName = payload.targetUserId
						? get().getUsernameById(payload.targetUserId)
						: undefined;
					get().addLog(formatMoneySource(payload, actorName, targetName));
				};

				const handleJailStatusChanged = (
					playerId: string,
					behindBars: boolean,
				) => {
					const username = get().getUsernameById(playerId) ?? "A player";
					set((state) => ({
						players: state.players.map((p) =>
							p.id === playerId ? { ...p, behindBars } : p,
						),
					}));
					get().addLog(
						behindBars
							? `${username} was sent to jail.`
							: `${username} is out of jail.`,
					);
				};

				const handleReceiveVote = (
					playerId: string,
					votes: number,
					voterId: string,
				) => {
					set((state) => {
						const updatedVotedPlayers =
							voterId === state.userId
								? [...state.votedPlayers, playerId]
								: state.votedPlayers;
						return {
							players: state.players.map((p) =>
								p.id === playerId ? { ...p, votes } : p,
							),
							votedPlayers: updatedVotedPlayers,
						};
					});
				};

				const handleYourVotes = (votedPlayerIds: string[]) => {
					set({ votedPlayers: votedPlayerIds });
				};

				const handleReceiveTradeOffer = (
					fromPlayer: string,
					toPlayer: string,
					tradeData: { offer: TradeData; request: TradeData },
				) => {
					set((state) => {
						// Check if a pending trade already exists between these players
						const existingTradeIndex = state.trade.findIndex(
							(t) =>
								t.fromPlayerId === fromPlayer &&
								t.toPlayerId === toPlayer &&
								t.status === "pending",
						);

						const newTrade: tradeDisplaySchema = {
							fromPlayerId: fromPlayer,
							toPlayerId: toPlayer,
							offeredProperties: tradeData.offer,
							requestedProperties: tradeData.request,
							status: "pending",
						};

						if (existingTradeIndex !== -1) {
							// Update existing trade
							const updatedTrades = [...state.trade];
							updatedTrades[existingTradeIndex] = newTrade;
							return { trade: updatedTrades };
						}

						return { trade: [...state.trade, newTrade] };
					});
				};

				const handleReceiveConfirmTradeOffer = (
					fromPlayer: string,
					toPlayer: string,
				) => {
					set((state) => {
						const trade = state.trade.find(
							(t) => t.fromPlayerId === fromPlayer && t.toPlayerId === toPlayer,
						);

						if (!trade) return {};
						return {
							trade: state.trade.filter(
								(t) =>
									!(t.fromPlayerId === fromPlayer && t.toPlayerId === toPlayer),
							),
						};
					});
				};
				const handleUpgradeProperty = (
					propertyId: number,
					userid: string,
					rank: number,
				) => {
					const state = get();
					const player = state.players.find((p) => p.id === userid);
					if (!player) return;
					const property = player.properties.find(
						(prop) => prop.id === propertyId,
					);
					if (!property) return;
					const newRank = rank;
					get().updatePlayer(userid, {
						properties: player.properties.map((prop) =>
							prop.id === propertyId ? { ...prop, rank: newRank } : prop,
						),
					});
					const propertyName =
						TileDataJson.find((tile) => tile.id === propertyId)?.name ??
						`Property ${propertyId}`;
					get().addLog(
						`${player.username} upgraded ${propertyName} to level ${newRank + 1}.`,
					);
				};
				const handleTimerTick = (remainingSeconds: number) => {
					set({ timerSeconds: remainingSeconds });
				};
				const handleTimerExpired = () => {
					set({ timerSeconds: 0 });
					toast("Time's up!", {
						description: "The waiting room has been closed due to inactivity.",
					});
				};
				const handleRoomAutoDeleted = (deletedRoomKey: string) => {
					// Room deletion will be handled in the page component
					// This handler is here for completeness
					if (deletedRoomKey === roomKey) {
						set({ timerSeconds: 0 });
					}
				};
				const handleInactivityWarning = (countdown: number) => {
					set({ showInactivityWarning: true, inactivityCountdown: countdown });
				};
				const handleInactivityTick = (remainingSeconds: number) => {
					set({ inactivityCountdown: remainingSeconds });
				};
				const handleInactivityReset = () => {
					set({ showInactivityWarning: false, inactivityCountdown: 0 });
				};
				// Remove any existing listeners to prevent duplicates
				socket.off(SOCKET_EVENTS.GAME_LOOP);
				socket.off(SOCKET_EVENTS.PLAYER_LEFT);
				socket.off(SOCKET_EVENTS.RECEIVE_MONEY);
				socket.off(SOCKET_EVENTS.RECEIVE_MONEY_UPDATE);
				socket.off(SOCKET_EVENTS.PROPERTY_BOUGHT);
				socket.off(SOCKET_EVENTS.RECEIVE_TURN);
				socket.off(SOCKET_EVENTS.JAIL_STATUS_CHANGED);
				socket.off(SOCKET_EVENTS.RECEIVE_VOTE);
				socket.off(SOCKET_EVENTS.YOUR_VOTES);
				socket.off(SOCKET_EVENTS.RECEIVE_TRADE_OFFER);
				socket.off(SOCKET_EVENTS.RECEIVE_CONFIRM_TRADE_OFFER);
				socket.off(SOCKET_EVENTS.TIMER_TICK);
				socket.off(SOCKET_EVENTS.TIMER_EXPIRED);
				socket.off(SOCKET_EVENTS.ROOM_AUTO_DELETED);
				socket.off(SOCKET_EVENTS.INACTIVITY_WARNING);
				socket.off(SOCKET_EVENTS.INACTIVITY_TICK);
				socket.off(SOCKET_EVENTS.INACTIVITY_RESET);
				socket.off("reconnect");
				socket.on(SOCKET_EVENTS.GAME_LOOP, handleGameLoop);
				socket.on(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);
				socket.on(SOCKET_EVENTS.RECEIVE_MONEY, handleReceiveMoney);
				socket.on(SOCKET_EVENTS.RECEIVE_MONEY_UPDATE, handleReceiveMoneyUpdate);
				socket.on(SOCKET_EVENTS.PROPERTY_BOUGHT, handlePropertyBought);
				socket.on(SOCKET_EVENTS.RECEIVE_TURN, handleReceiveTurn);
				socket.on(SOCKET_EVENTS.JAIL_STATUS_CHANGED, handleJailStatusChanged);
				socket.on(SOCKET_EVENTS.RECEIVE_VOTE, handleReceiveVote);
				socket.on(SOCKET_EVENTS.YOUR_VOTES, handleYourVotes);
				socket.on(SOCKET_EVENTS.RECEIVE_TRADE_OFFER, handleReceiveTradeOffer);
				socket.on(
					SOCKET_EVENTS.RECEIVE_CONFIRM_TRADE_OFFER,
					handleReceiveConfirmTradeOffer,
				);
				socket.on(SOCKET_EVENTS.PROPERTY_UPGRADED, handleUpgradeProperty);
				socket.on(SOCKET_EVENTS.TIMER_TICK, handleTimerTick);
				socket.on(SOCKET_EVENTS.TIMER_EXPIRED, handleTimerExpired);
				socket.on(SOCKET_EVENTS.ROOM_AUTO_DELETED, handleRoomAutoDeleted);
				socket.on(SOCKET_EVENTS.INACTIVITY_WARNING, handleInactivityWarning);
				socket.on(SOCKET_EVENTS.INACTIVITY_TICK, handleInactivityTick);
				socket.on(SOCKET_EVENTS.INACTIVITY_RESET, handleInactivityReset);
				// Join on initial connection
				joinRoom();
				// Rejoin on reconnect
				socket.on("reconnect", joinRoom);
				// Cleanup
				socket.once("disconnect", () => {
					socket.off(SOCKET_EVENTS.GAME_LOOP, handleGameLoop);
					socket.off(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);
					socket.off(SOCKET_EVENTS.RECEIVE_MONEY, handleReceiveMoney);
					socket.off(SOCKET_EVENTS.RECEIVE_MONEY_UPDATE, handleReceiveMoneyUpdate);
					socket.off(SOCKET_EVENTS.PROPERTY_BOUGHT, handlePropertyBought);
					socket.off(SOCKET_EVENTS.RECEIVE_TURN, handleReceiveTurn);
					socket.off(
						SOCKET_EVENTS.JAIL_STATUS_CHANGED,
						handleJailStatusChanged,
					);
					socket.off(SOCKET_EVENTS.RECEIVE_VOTE, handleReceiveVote);
					socket.off(SOCKET_EVENTS.YOUR_VOTES, handleYourVotes);
					socket.off(
						SOCKET_EVENTS.RECEIVE_TRADE_OFFER,
						handleReceiveTradeOffer,
					);
					socket.off(
						SOCKET_EVENTS.RECEIVE_CONFIRM_TRADE_OFFER,
						handleReceiveConfirmTradeOffer,
					);
					socket.off(SOCKET_EVENTS.PROPERTY_UPGRADED, handleUpgradeProperty);
					socket.off(SOCKET_EVENTS.TIMER_TICK, handleTimerTick);
					socket.off(SOCKET_EVENTS.TIMER_EXPIRED, handleTimerExpired);
					socket.off(SOCKET_EVENTS.ROOM_AUTO_DELETED, handleRoomAutoDeleted);
					socket.off(SOCKET_EVENTS.INACTIVITY_WARNING, handleInactivityWarning);
					socket.off(SOCKET_EVENTS.INACTIVITY_TICK, handleInactivityTick);
					socket.off(SOCKET_EVENTS.INACTIVITY_RESET, handleInactivityReset);
				});
			},
			setUsername: (username: string) => set({ username }),
			getUsernameById: (playerId: string) => {
				const state = get();
				const player = state.players.find((p) => p.id === playerId);
				return player ? player.username : undefined;
			},
			setColor: (color: string) => set({ color }),
			getColorOfUser: (playerId: string) => {
				const state = get();
				const player = state.players.find((p) => p.id === playerId);
				return player ? player.color : undefined;
			},
			getColorByPropertyIndex: (propertyIndex: number) => {
				const state = get();
				const player = state.players.find((p) =>
					p.properties.some((property) => property.id === propertyIndex),
				);
				return player ? player.color : undefined;
			},
			setPlayers: (players: Player[]) => set({ players }),
			setVotedPlayers: (votedPlayers: string[]) => set({ votedPlayers }),
			updatePlayer: (id: string, updates: Partial<Player>) => {
				set((prev) => ({
					players: prev.players.map((player) =>
						player.id === id ? { ...player, ...updates } : player,
					),
				}));
			},
			getPlayerCount: () => get().players.length,
			getPlayersMoney: (playerId: string) => {
				const state = get();
				const player = state.players.find((p) => p.id === playerId);
				return player ? player.money : 0;
			},
			isThisPlayerLeader: () => {
				const state = get();
				const players = state.players;
				if (players.length === 0) return false;

				// Find the minimum rank among all players
				const minRank = Math.min(...players.map((p) => p.rank));
				const leader = players.find((player) => player.rank === minRank);

				return leader?.id === state.userId;
			},
			addProperty: (playerId: string, propertyIndex: number) => {
				set((state) => {
					const updatedPlayers = state.players.map((p) => {
						// Ensure the property is removed from any previous owner (e.g., during trade)
						const existingProperties = (p.properties ?? []).filter(
							(prop) => Number(prop.id) !== Number(propertyIndex),
						);

						if (p.id === playerId) {
							return {
								...p,
								properties: [
									...existingProperties,
									{
										id: Number(propertyIndex),
										rank: 0,
										group: get().getPropertyGroupById(propertyIndex),
									},
								],
							};
						}
						return {
							...p,
							properties: existingProperties,
						};
					});
					return { players: updatedPlayers };
				});
			},
			getPropertyCount: (playerId: string) => {
				const state = get();
				const foundPlayer = state.players.find((p) => p.id === playerId);
				return foundPlayer ? foundPlayer.properties.length : 0;
			},
			getProperty: (playerId: string) => {
				const state = get();
				const foundPlayer = state.players.find((p) => p.id === playerId);
				return foundPlayer?.properties ?? [];
			},
			getRankOfProperty: (propertyIndex: number) => {
				const state = get();
				for (const player of state.players) {
					const property = player.properties.find(
						(prop) => prop.id === propertyIndex,
					);
					if (property) {
						return property.rank;
					}
				}
				return 0;
			},
			//check if any player owns the property
			checkPropertyIsOwned: (propertyIndex: number) => {
				const state = get();
				return state.players.some((p) =>
					p.properties.some((property) => property.id === propertyIndex),
				);
			},
			//check if property is owned by player
			checkPropertyOwnedByPlayer: (playerId: string, propertyIndex: number) => {
				const state = get();
				const foundPlayer = state.players.find((p) => p.id === playerId);
				if (!foundPlayer) return false;
				return (
					foundPlayer.properties?.some((prop) => prop.id === propertyIndex) ??
					false
				);
			},
			getPropertyGroupById: (tileId: number) => {
				for (const property of TileDataJson) {
					if (property.id === Number(tileId)) {
						return property.group;
					}
				}
				return -1;
			},
			totalPropertyInGroup: (propertyGroup: number) => {
				return TileDataJson.filter(
					(property) => property.group === propertyGroup,
				).length;
			},
			checkIfPropertyGroupIsOwnedByPlayer: (
				playerId: string,
				propertyIndex: number,
			) => {
				const state = get();
				const foundPlayer = state.players.find((p) => p.id === playerId);
				if (!foundPlayer) return false;

				const propertyGroup = state.getPropertyGroupById(propertyIndex);
				if (propertyGroup === -1) return false;

				const propertiesInGroup = TileDataJson.filter(
					(p) => p.group === propertyGroup,
				);

				const playerPropertyIds = new Set(
					foundPlayer.properties.map((prop) => Number(prop.id)),
				);

				return propertiesInGroup.every((prop) =>
					playerPropertyIds.has(Number(prop.id)),
				);
			},
			upgradeProperty: (
				playerId: string,
				socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
				propertyIndex: number,
				roomKey: string,
				upgradeCost: number,
			) => {
				if (!socket) return;
				socket.emit(
					SOCKET_EVENTS.UPGRADE_PROPERTY,
					propertyIndex,
					playerId,
					roomKey,
					upgradeCost,
				);
			},
			displayTrade: () => {
				const state = get();
				return state.trade;
			},
			removeProperty: (playerId: string, propertyIndex: number) => {
				set((state) => {
					const updatedPlayers = state.players.map((p) => {
						if (p.id === playerId) {
							const newProperties = (p.properties ?? []).filter(
								(prop) => prop.id !== propertyIndex,
							);
							return {
								...p,
								properties: newProperties,
							};
						}
						return p;
					});
					return { players: updatedPlayers };
				});
			},
			sendVote: (
				roomKey: string,
				playerId: string,
				socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
			) => {
				const { players } = get();
				if (!socket) return;
				const player = players.find((p) => p.id === playerId);
				const newVotes = (player?.votes ?? 0) + 1;
				socket.emit(SOCKET_EVENTS.SEND_VOTE, roomKey, playerId, newVotes);
			},
			sendTrade: (
				roomKey: string,
				userId: string,
				playerId: string,
				socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
				tradeData: { offer: TradeData; request: TradeData },
			) => {
				if (!socket) return;

				socket.emit(
					SOCKET_EVENTS.SEND_TRADE_OFFER,
					userId,
					playerId,
					roomKey,
					tradeData,
				);
			},
			acceptTrade: (
				fromPlayer,
				toPlayer,
				roomKey,
				socket,
				tradeData,
				status,
			) => {
				if (!socket) return;
				socket.emit(
					SOCKET_EVENTS.CONFIRM_TRADE_OFFER,
					fromPlayer,
					toPlayer,
					roomKey,
					tradeData,
					status,
				);
			},
			setTradeDialogOpen: (isOpen) => set({ isTradeDialogOpen: isOpen }),
			setIsNavigating: (isNavigating) => set({ isNavigating }),
			setHasFinished: (hasFinished) => set({ hasFinished }),
			addLog: (message: string) => {
				set((state) => ({
					logs: [
						...state.logs,
						{
							id: crypto.randomUUID(),
							message,
							timestamp: Date.now(),
						},
					].slice(-MAX_GAME_LOGS),
				}));
			},
			clearLogs: () => set({ logs: [] }),
			setState: (state) => set(state),
		}),
		{
			name: "game-storage",
			partialize: (state) => ({
				username: state.username,
				userId: state.userId,
				color: state.color,
			}),
			onRehydrateStorage: () => (state) => {
				if (state && !state.userId) {
					state.userId = crypto.randomUUID();
				}
			},
		},
	),
);
