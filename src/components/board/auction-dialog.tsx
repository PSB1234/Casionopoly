import { useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/8bit/dialog";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import TileDataJson from "@/lib/tiledata";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";
import { toast } from "@/components/ui/8bit/toast";

export default function AuctionDialog({ roomKey }: { roomKey: string }) {
	const { socket, emitEvent } = useSocketStore();
	const userId = useGameStore((state) => state.userId);
	const getUsernameById = useGameStore((state) => state.getUsernameById);
	const getPlayersMoney = useGameStore((state) => state.getPlayersMoney);

	const [isOpen, setIsOpen] = useState(false);
	const [propertyId, setPropertyId] = useState<number | null>(null);
	const [currentBid, setCurrentBid] = useState(0);
	const [highestBidder, setHighestBidder] = useState<string | null>(null);
	const [timeLeft, setTimeLeft] = useState(5);

	useEffect(() => {
		if (!socket) return;

		const handleAuctionStarted = (
			propId: number,
			basePrice: number,
			bid: number,
			bidder: string | null,
		) => {
			setPropertyId(propId);
			setCurrentBid(bid);
			setHighestBidder(bidder);
			setTimeLeft(5);
			setIsOpen(true);
		};

		const handleAuctionUpdated = (
			propId: number,
			bid: number,
			bidder: string | null,
		) => {
			if (propertyId === propId) {
				setCurrentBid(bid);
				setHighestBidder(bidder);
				setTimeLeft(5);
				if (bidder) {
					const bidderName = getUsernameById(bidder) ?? "Someone";
					toast("New Bid", {
						description: `${bidderName} placed a new bid of ₹${bid}.`,
					});
				}
			}
		};

		const handleAuctionEnded = (
			propId: number,
			winnerId: string,
			winningBid: number,
		) => {
			if (propertyId === propId) {
				setIsOpen(false);
				setPropertyId(null);
			}
		};

		socket.on(SOCKET_EVENTS.AUCTION_STARTED, handleAuctionStarted);
		socket.on(SOCKET_EVENTS.AUCTION_UPDATED, handleAuctionUpdated);
		socket.on(SOCKET_EVENTS.AUCTION_ENDED, handleAuctionEnded);

		return () => {
			socket.off(SOCKET_EVENTS.AUCTION_STARTED, handleAuctionStarted);
			socket.off(SOCKET_EVENTS.AUCTION_UPDATED, handleAuctionUpdated);
			socket.off(SOCKET_EVENTS.AUCTION_ENDED, handleAuctionEnded);
		};
	}, [socket, propertyId, getUsernameById]);

	useEffect(() => {
		if (!isOpen) return;
		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(timer);
	}, [isOpen, currentBid]);

	if (!isOpen || propertyId === null) return null;

	const tileData = TileDataJson.find((t) => t.id === propertyId);
	const propertyName = tileData?.name ?? "Unknown Property";
	const bidderName = highestBidder ? getUsernameById(highestBidder) : "No bids yet";
	const myMoney = getPlayersMoney(userId);

	const placeBid = (increment: number) => {
		const nextBid = currentBid + increment;
		if (myMoney >= nextBid) {
			emitEvent(SOCKET_EVENTS.PLACE_BID, nextBid, userId, roomKey);
		}
	};

	const getTimerColor = () => {
		if (timeLeft >= 4) return "text-green-500";
		if (timeLeft === 3) return "text-yellow-500";
		return "text-red-500 animate-pulse";
	};

	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Auction: {propertyName}</DialogTitle>
					<DialogDescription>
						An auction has started for {propertyName}. Place your bids!
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center gap-6 py-4">
					<div className="text-xl font-bold">
						Current Bid: ₹{currentBid}
					</div>
					<div className="text-sm text-neutral-500">
						Highest Bidder: {bidderName}
					</div>
					<div className="text-sm text-neutral-500">
						Your Money: ₹{myMoney}
					</div>
					<div className={`text-4xl font-bold ${getTimerColor()}`}>
						00:0{timeLeft}
					</div>
					<div className="flex gap-2">
						<Button
							disabled={myMoney < currentBid + 10}
							onClick={() => placeBid(10)}
						>
							+10
						</Button>
						<Button
							disabled={myMoney < currentBid + 50}
							onClick={() => placeBid(50)}
						>
							+50
						</Button>
						<Button
							disabled={myMoney < currentBid + 100}
							onClick={() => placeBid(100)}
						>
							+100
						</Button>
					</div>
				</div>
				<DialogFooter>
					<div className="text-xs text-neutral-400">
						Auction ends 5 seconds after the last bid.
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
