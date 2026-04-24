"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAudio } from "@/components/provider/audio_provider";
import { Button } from "@/components/ui/8bit/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";
import Leaderboard from "@/components/ui/8bit/leaderboard";
import { useGameStore } from "@/store/game_store";

const VICTORY_SFX =
	"/music/soundeffects/game/freesound_community-winsquare-6993.mp3";
const GAME_OVER_SFX =
	"/music/soundeffects/game/freesound_community-game-over-38511.mp3";


export default function ResultPage() {
	const router = useRouter();

	const { players, userId, getPlayersMoney } = useGameStore();
	const { audioRef, isSoundOn } = useAudio();

	const sortedPlayers = useMemo(() => {
		return [...players].sort((a, b) => a.rank - b.rank);
	}, [players]);

	const winner = sortedPlayers[0];
	const isWinner = winner?.id === userId;

	useEffect(() => {
		audioRef.current?.pause();
		if (isSoundOn) {
			const sfx = new Audio(isWinner ? VICTORY_SFX : GAME_OVER_SFX);
			sfx.volume = 0.8;
			sfx.play().catch(console.error);
		}
	}, [isWinner, audioRef, isSoundOn]);

	const leaderboardPlayers = useMemo(() => {
		return sortedPlayers.map((player) => ({
			id: player.id,
			name: player.username,
			score: getPlayersMoney(player.id),
			isCurrentPlayer: player.id === userId,
			avatarFallback: player.username.charAt(0).toUpperCase(),
		}));
	}, [sortedPlayers, userId, getPlayersMoney]);

	const handlePlayAgain = () => {
		router.push("/searchRoom");
	};

	const handleBackToHome = () => {
		router.push("/");
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
			<Card className="w-full max-w-md" font="retro">
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						{isWinner ? "VICTORY!" : "DEFEAT!"}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="retro text-center text-muted-foreground text-sm">
						{isWinner
							? "Congratulations! You are the winner!"
							: `Winner: ${winner?.username ?? "Unknown"}`}
					</p>

					<div className="rounded-lg border-2 border-yellow-400 bg-yellow-400/20 p-4">
						<Leaderboard
							maxPlayers={10}
							players={leaderboardPlayers}
							showAvatar={false}
							showRank={true}
							title="FINAL STANDINGS"
						/>
					</div>

					<div className="flex flex-col gap-3">
						<Button className="w-full" onClick={handlePlayAgain}>
							Play Again
						</Button>
						<Button
							className="w-full"
							onClick={handleBackToHome}
							variant="outline"
						>
							Back to Home
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
