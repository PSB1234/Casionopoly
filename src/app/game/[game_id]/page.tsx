"use client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Bankruptcy from "@/components/bankruptcy";
import BankruptcyChoice from "@/components/bankruptcyChoice";
import Board from "@/components/board";
import Chat from "@/components/chat";
import GhostBoard from "@/components/ghost-board";
import InactivityWarning from "@/components/inactivity-warning";
import Kick from "@/components/kick";
import Playerlist from "@/components/playerlist";
import Properties from "@/components/properties";
import Sounds from "@/components/sounds";
import Trade from "@/components/trade";
import TradeDisplay from "@/components/tradeDisplay";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/8bit/alert-dialog";
import { env } from "@/env";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
export default function Game() {
	const router = useRouter();
	const { game_id } = useParams<{ game_id: string }>();
	const { socket, connectSocket } = useSocketStore();
	const {
		players,
		initializeSocket,
		userId,
		displayTrade,
		getUsernameById,
		setIsNavigating,
	} = useGameStore();

	useEffect(() => {
		setIsNavigating(false);
	}, [setIsNavigating]);

	useEffect(() => {
		if (!game_id) return;
		if (!userId) return;
		if (!socket) {
			connectSocket(env.NEXT_PUBLIC_SOCKET_URL, {
				auth: {
					userId: userId,
				},
			});
			return;
		}

		initializeSocket(game_id, socket);
		return () => {};
	}, [socket, game_id, initializeSocket, connectSocket, userId]);

	// Redirect home when room is auto-deleted due to inactivity
	useEffect(() => {
		if (!socket || !game_id) return;
		const handleAutoDeleted = (deletedRoomKey: string) => {
			if (deletedRoomKey === game_id) {
				router.replace("/");
			}
		};
		socket.on(SOCKET_EVENTS.ROOM_AUTO_DELETED, handleAutoDeleted);
		return () => {
			socket.off(SOCKET_EVENTS.ROOM_AUTO_DELETED, handleAutoDeleted);
		};
	}, [socket, game_id, router]);
	

	const Logo = () => (
		<div className="relative">
			<h1 className="relative z-10 font-bold font-jaro text-3xl text-yellow-200">
				Industrial.io
			</h1>
			<div className="pointer-events-none absolute top-1 left-1 select-none font-bold font-jaro text-3xl text-black">
				Industrial.io
			</div>
		</div>
	);

	return (
		<div className="flex min-h-screen w-full flex-col lg:flex-row items-center justify-center p-5 lg:h-screen overflow-y-auto lg:overflow-hidden">
			<InactivityWarning roomKey={game_id} socket={socket} />
			<BankruptcyChoice userId={userId} game_id={game_id} socket={socket} />

			{/* Mobile Header: Logo and Sounds */}
			<div className="flex lg:hidden w-full flex-row items-center justify-between px-2 shrink-0 order-1">
				<Logo />
				<Sounds />
			</div>

			{/* Middle Column: Board (Desktop Middle, Mobile Top after Header) */}
			<div className="flex items-center justify-center order-2 lg:order-2 w-full lg:flex-1 lg:h-full lg:max-h-screen p-0 lg:p-5">
				<div className="relative w-full max-w-[100vw] lg:w-[100cqmin] lg:min-w-[500px] h-auto aspect-square lg:h-[100cqmin] p-2 lg:p-5">
					<Board game_id={game_id} />
					<div className="pointer-events-none absolute inset-0">
						<GhostBoard PlayerList={players} />
					</div>
				</div>
			</div>

			{/* Desktop Left Column Container */}
			<div className="flex flex-col gap-5 w-full lg:w-[350px] lg:flex-shrink-0 min-w-0 order-3 lg:order-1 h-auto lg:h-full lg:max-h-screen py-0 lg:py-5 text-xs md:text-sm">
				<div className="hidden lg:flex flex-row items-center justify-between shrink-0">
					<Logo />
					<Sounds />
				</div>
				
				{/* Specific Mobile Order using inner flex-col */}
				<div className="flex flex-col gap-5 lg:contents">
					{/* 1. Player List (Mobile only here) */}
					<div className="order-1 lg:hidden">
						<Playerlist PlayerList={players} />
					</div>
					{/* 2. Kick/Surrender (Mobile only here) */}
					<div className="order-2 lg:hidden flex justify-between shrink-0">
						<Kick roomKey={game_id} />
						<Bankruptcy roomKey={game_id} />
					</div>
					{/* 3. Chat */}
					<div className="order-3 lg:flex-1 min-h-0">
						<Chat />
					</div>
					{/* 4. Trade */}
					<div className="order-4">
						<Trade roomKey={game_id} />
					</div>
					{/* 5. Trade Display (Mobile only here) */}
					<div className="order-5 lg:hidden">
						<TradeDisplay
							displayTrade={displayTrade}
							getUsernameById={getUsernameById}
							roomKey={game_id}
							userId={userId}
						/>
					</div>
					{/* 6. Properties (Mobile only here) */}
					<div className="order-6 lg:hidden">
						<Properties roomKey={game_id} />
					</div>
				</div>
			</div>

			{/* Desktop Right Column: Playerlist, Kick, Bankruptcy, Properties (Hidden on Mobile) */}
			<div className="hidden lg:flex flex-col gap-5 w-full lg:w-[350px] lg:flex-shrink-0 min-w-0 order-4 lg:order-3 h-auto lg:h-full lg:max-h-screen py-0 lg:py-5 text-xs md:text-sm">
				<Playerlist PlayerList={players} />
				<div className="flex justify-between shrink-0">
					<Kick roomKey={game_id} />
					<Bankruptcy roomKey={game_id} />
				</div>
				<Properties roomKey={game_id} />
				<TradeDisplay
					displayTrade={displayTrade}
					getUsernameById={getUsernameById}
					roomKey={game_id}
					userId={userId}
				/>
			</div>
		</div>
	);
}
