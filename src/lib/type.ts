import type z from "zod";
import type { TradeData } from "@/components/trade/tradeList";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import type { createRoomSchema } from "@/lib/zod";

export type MoneyUpdateSource =
	| "buy-property"
	| "pay-rent"
	| "tax"
	| "chest"
	| "upgrade"
	| "trade"
	| "pass-start"
	| "manual";

export interface ServerToClientEvents {
	[SOCKET_EVENTS.USER_CONNECTED]: (username: string) => void;
	[SOCKET_EVENTS.USER_DISCONNECTED]: (userId: string) => void;
	[SOCKET_EVENTS.USERNAME_ASSIGNED]: (username: string) => void;
	[SOCKET_EVENTS.GET_ALL_ROOMS]: (roomsData: RoomData[]) => void;
	[SOCKET_EVENTS.PLAYER_LEFT]: (socket_id: string) => void;
	[SOCKET_EVENTS.GAME_LOOP]: (receivedRoomKey: string, player: Player) => void;
	[SOCKET_EVENTS.ERROR]: (message: string) => void;
	[SOCKET_EVENTS.GET_DICE_ROLL]: (diceRoll: number) => void;
	[SOCKET_EVENTS.RECEIVE_MESSAGE]: (message: string, username: string) => void;
	[SOCKET_EVENTS.RECEIVE_MONEY]: (money: number, userid: string) => void;
	[SOCKET_EVENTS.RECEIVE_MONEY_UPDATE]: (payload: MoneyUpdatePayload) => void;
	[SOCKET_EVENTS.RECEIVE_POSITION]: (
		position: number,
		player_id: string,
	) => void;
	[SOCKET_EVENTS.JAIL_STATUS_CHANGED]: (
		player_id: string,
		behindBars: boolean,
	) => void;
	[SOCKET_EVENTS.PROPERTY_BOUGHT]: (propertyId: number, userid: string) => void;
	[SOCKET_EVENTS.RECEIVE_TRADE_OFFER]: (
		fromPlayer: string,
		toPlayer: string,
		tradeData: { offer: TradeData; request: TradeData },
	) => void;
	[SOCKET_EVENTS.RECEIVE_CONFIRM_TRADE_OFFER]: (
		fromPlayer: string,
		toPlayer: string,
		roomKey: string,
		tradeData: { offer: TradeData; request: TradeData },
		accepted: boolean,
	) => void;
	[SOCKET_EVENTS.RECEIVE_TURN]: (turn: number) => void;
	[SOCKET_EVENTS.PROPERTY_UPGRADED]: (
		propertyId: number,
		userid: string,
		rank: number,
	) => void;
	[SOCKET_EVENTS.CHAT_HISTORY]: (
		messages: Array<{ message: string; username: string }>,
	) => void;
	[SOCKET_EVENTS.AFTER_CHANGE_ROOM_STATUS]: () => void;
	[SOCKET_EVENTS.RECEIVE_VOTE]: (
		playerId: string,
		votes: number,
		voterId: string,
	) => void;

	[SOCKET_EVENTS.YOUR_VOTES]: (votedPlayerIds: string[]) => void;
	[SOCKET_EVENTS.TIMER_TICK]: (remainingSeconds: number) => void;
	[SOCKET_EVENTS.TIMER_EXPIRED]: () => void;
	[SOCKET_EVENTS.ROOM_AUTO_DELETED]: (roomKey: string) => void;
	[SOCKET_EVENTS.INACTIVITY_WARNING]: (countdown: number) => void;
	[SOCKET_EVENTS.INACTIVITY_TICK]: (remainingSeconds: number) => void;
	[SOCKET_EVENTS.INACTIVITY_RESET]: () => void;
	[SOCKET_EVENTS.GAME_FINISHED]: (
		winnerId: string,
		finalStandings: Player[],
	) => void;
	[SOCKET_EVENTS.RESOLVE_CHEST]: (
		roomKey: string,
		reason: ChestResolutionReason,
		spin: ChestSpinOutcome | undefined,
		ack: (result: ChestResolutionResult) => void,
	) => void;
	connect: () => void;
	disconnect: (reason: string) => void;
	reconnect: () => void;
	reconnect_attempt: () => void;
	reconnect_failed: () => void;
	connect_error: (error: Error) => void;
}

// Events that the client emits to the server
export interface ClientToServerEvents {
	[SOCKET_EVENTS.CREATE_ROOM]: (
		options: z.infer<typeof createRoomSchema>,
		color: string,
		callback: (roomkey: string, playerList: Player[]) => void,
	) => void;
	[SOCKET_EVENTS.JOIN_ROOM]: (
		username: string,
		roomKey: string,
		color: string,
		password: string | undefined,
		callback: (username: string, playerList: Player[]) => void,
	) => void;
	[SOCKET_EVENTS.CHANGE_NAME]: (
		newName: string,
		callback?: (success: boolean, username: string) => void,
	) => void;
	[SOCKET_EVENTS.CHANGE_ROOM_STATUS]: (
		roomKey: string,
		status: "waiting" | "playing" | "finished",
	) => void;
	[SOCKET_EVENTS.SEND_POSITION]: (position: number, roomKey: string) => void;
	[SOCKET_EVENTS.SEND_DICE_ROLL]: (diceRoll: number, roomKey: string) => void;
	[SOCKET_EVENTS.SEND_MESSAGE]: (message: string, roomKey: string) => void;
	[SOCKET_EVENTS.SEND_MONEY]: (
		amount: number,
		userid: string,
		roomKey: string,
		source?: MoneyUpdateSource,
		targetUserId?: string,
	) => void;
	[SOCKET_EVENTS.BUY_PROPERTY]: (
		propertyId: number,
		userId: string,
		roomkey: string,
	) => void;
	[SOCKET_EVENTS.SEND_VOTE]: (
		roomKey: string,
		playerId: string,
		votes: number,
	) => void;
	[SOCKET_EVENTS.SEND_TURN]: (turn: number, roomKey: string) => void;
	[SOCKET_EVENTS.SEND_TRADE_OFFER]: (
		fromPlayer: string,
		toPlayer: string,
		roomKey: string,
		tradeData: { offer: TradeData; request: TradeData },
	) => void;
	[SOCKET_EVENTS.CONFIRM_TRADE_OFFER]: (
		fromPlayer: string,
		toPlayer: string,
		roomKey: string,
		tradeData: { offer: TradeData; request: TradeData },
		status: "accepted" | "rejected",
	) => void;
	[SOCKET_EVENTS.UPGRADE_PROPERTY]: (
		propertyId: number,
		userId: string,
		roomKey: string,
		upgradeCost: number,
	) => void;
	[SOCKET_EVENTS.GO_TO_JAIL]: (userId: string, game_id: string) => void;
	[SOCKET_EVENTS.COLLECT_TAX]: (userId: string, game_id: string) => void;
	[SOCKET_EVENTS.JOIN_RANDOM_ROOM]: (
		color: string,
		callback: (roomKey: string, playerList: Player[]) => void,
	) => void;
	[SOCKET_EVENTS.LEAVE_ROOM]: (roomKey: string) => void;
	[SOCKET_EVENTS.LEAVE_GAME]: (userId: string, roomKey: string) => void;
	[SOCKET_EVENTS.REMOVE_PLAYER]: (roomKey: string) => void;
	[SOCKET_EVENTS.CONFIRM_ACTIVITY]: (roomKey: string) => void;
	[SOCKET_EVENTS.RESOLVE_CHEST]: (
		roomKey: string,
		reason: ChestResolutionReason,
		spin: ChestSpinOutcome | undefined,
		ack: (result: ChestResolutionResult) => void,
	) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
}

export type Player = {
	id: string;
	socketid: string; // socket id
	username: string;
	rank: number;
	position: number;
	votes: number;
	money: number;
	color: string;
	properties: PropertySchema[];
	leader: boolean;
	behindBars: boolean;
};

export type PlayerStats = {
	moneyEarned: number;
	moneySpent: number;
	tradesCompleted: number;
	propertiesBought: number;
	propertiesSold: number;
};

export type PlayerStatus =
	| "playing"
	| "bankrupt"
	| "winner";

export type PlayerSnapshot = {
	player: Player;
	stats: PlayerStats;
	status: PlayerStatus;
};

export type PropertySchema = {
	id: number;
	rank: number;
	group: number;
};
export interface Room {
	roomKey: string;
	players: number;
	isPrivate: boolean;
	status: "waiting" | "playing" | "finished"; // Add status field
}
export type TileDataSchema = {
	id: number;
	name: string;
	flagName: string;
	group: number;
	type:
		| "property"
		| "Vacation"
		| "go-to-jail"
		| "jail"
		| "freeParking"
		| "start"
		| "tax"
		| "chance"
		| "subProperty";
	buyable?: boolean;
	price?: number;
	rent?: number[];
	isCornerTile?: boolean;
	reward?: number;
	upgrade?: number[];
};

export type TileOwnership = {
	tileId: number;
	ownerId: string;
};
export interface tradeDisplaySchema {
	fromPlayerId: string;
	toPlayerId: string;
	offeredProperties: TradeData;
	requestedProperties: TradeData;
	status: "pending" | "accepted" | "rejected";
}
export interface RoomData {
	roomKey: string;
	name: string;
	isPrivate: boolean;
}

export type ChestResolutionReason = "stopped" | "timeout";

export type ChestSymbol = "COIN" | "STAR" | "GEM" | "BOLT" | "LUCK" | "x2";

export type ChestSpinOutcome = {
	symbols: [ChestSymbol, ChestSymbol, ChestSymbol];
	rewardScore: number;
};

export type ChestEventId =
	| "unexpected-inheritance"
	| "startup-success-bonus"
	| "tax-refund"
	| "property-upgrade-grant"
	| "lucky-investment"
	| "medical-emergency"
	| "property-damage"
	| "fraud-scandal"
	| "market-crash"
	| "investigation-jail";

export type ChestResolutionResult = {
	eventId: ChestEventId;
	title: string;
	description: string;
	rewardText: string;
	reason: ChestResolutionReason;
	moneyDelta?: number;
	newBalance?: number;
	propertyId?: number;
	newRank?: number;
	position?: number;
	behindBars?: boolean;
	skipTurn?: boolean;
	usedFallback?: boolean;
};

export type MoneyUpdatePayload = {
	userId: string;
	newBalance: number;
	delta: number;
	source: MoneyUpdateSource;
	targetUserId?: string;
	eventId?: ChestEventId;
	eventTitle?: string;
};
