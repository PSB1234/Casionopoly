"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/components/provider/audio_provider";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent } from "@/components/ui/8bit/card";
import type { Player, PlayerStats } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";

const VICTORY_SFX =
	"/music/soundeffects/game/freesound_community-winsquare-6993.mp3";
const GAME_OVER_SFX =
	"/music/soundeffects/game/freesound_community-game-over-38511.mp3";

export default function ResultPage() {
	const router = useRouter();

	const { players, userId, playerStats, playerSnapshots, hasFinished } =
		useGameStore();
	const { audioRef, isSoundOn, setMusicSuppressed } = useAudio();

	const [expandedPlayers, setExpandedPlayers] = useState<
		Record<string, boolean>
	>({
		[userId]: true,
	});

	const toggleExpand = (id: string) => {
		setExpandedPlayers((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const allPlayersData = useMemo(() => {
		const dataMap = new Map<
			string,
			{ player: Player; stats: PlayerStats; status: string }
		>();

		// Add snapshots (players who left/bankrupted)
		Object.values(playerSnapshots).forEach((snap) => {
			dataMap.set(snap.player.id, {
				player: snap.player,
				stats: snap.stats,
				status: snap.status,
			});
		});

		// Add current active players (skip those who already left/bankrupted)
		players.forEach((p) => {
			if (playerSnapshots[p.id]) return;
			const stats = playerStats[p.id] || {
				moneyEarned: 0,
				moneySpent: 0,
				propertiesBought: 0,
				propertiesSold: 0,
				tradesCompleted: 0,
			};
			dataMap.set(p.id, {
				player: p,
				stats,
				status: p.money <= 0 ? "bankrupt" : "playing",
			});
		});

		// Sort by money descending
		const list = Array.from(dataMap.values()).sort(
			(a, b) => b.player.money - a.player.money,
		);

		// If game is finished and there is a unique top player (no tie), make them the winner
		const topPlayer = list[0];
		if (topPlayer && hasFinished) {
			const isUniqueTop =
				list.length === 1 ||
				list[0]?.player.money !== list[1]?.player.money;
			if (isUniqueTop) {
				topPlayer.status = "winner";
			}
		}

		return list;
	}, [players, playerSnapshots, playerStats, hasFinished]);

	const winnerData =
		allPlayersData.find((d) => d.status === "winner") || allPlayersData[0];
	const isWinner = winnerData?.player.id === userId;

	useEffect(() => {
		setMusicSuppressed(true);
		return () => setMusicSuppressed(false);
	}, [setMusicSuppressed]);

	useEffect(() => {
		audioRef.current?.pause();
		if (isSoundOn) {
			const sfx = new Audio(isWinner ? VICTORY_SFX : GAME_OVER_SFX);
			sfx.volume = 0.8;
			sfx.play().catch(console.error);
		}
	}, [isWinner, audioRef, isSoundOn]);

	const handlePlayAgain = () => {
		router.replace("/searchRoom");
	};

	const handleBackToHome = () => {
		router.replace("/");
	};

	return (
		<div
			className={cn(
				"relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden p-4",
			)}
		>
			<div
				className={cn(
					"pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay",
				)}
			/>

			<div className="z-10 flex w-full max-w-2xl flex-col items-center gap-6">
				<h1
					className={cn(
						"retro text-center text-6xl [-webkit-text-stroke:2px_white] md:text-8xl",
						isWinner ? "text-green-400" : "text-red-500",
					)}
				>
					{isWinner ? "VICTORY" : "DEFEAT"}
				</h1>

				<Card className="w-full max-w-md" font="retro">
					<CardContent className="space-y-6 pt-6">
						<div className="flex flex-col gap-4">
							<h2 className="retro text-center text-2xl text-white">
								Result
							</h2>
							{allPlayersData.map((data, index) => {
								const isExpanded = expandedPlayers[data.player.id];
								const isCurrent = data.player.id === userId;
								return (
									<div
										className="relative flex flex-col gap-2 border-white border-y-4 bg-black/40 p-3"
										key={data.player.id}
									>
										<div className="flex items-center justify-between gap-2">
											<div className="flex min-w-0 flex-1 items-center gap-3">
												<div className="retro shrink-0 text-lg text-white/50">
													#{index + 1}
												</div>
												<div className="flex min-w-0 flex-col">
													<span
														className={cn(
															"retro break-all text-lg",
															isCurrent ? "text-yellow-400" : "text-white",
														)}
													>
														{data.player.username}
													</span>
													<span
														className={cn(
															"text-xs uppercase",
													data.status === "winner"
														? "text-green-400"
														: data.status === "bankrupt"
															? "text-red-400"
															: "text-gray-400",
														)}
													>
														{data.status}
													</span>
												</div>
											</div>
											<div className="flex shrink-0 items-center gap-4">
												<span className="retro text-green-400">
													₹{data.player.money}
												</span>
												<Button
													className="h-8 px-2 text-xs"
													onClick={() => toggleExpand(data.player.id)}
													size="sm"
													variant="outline"
												>
													{isExpanded ? "HIDE" : "EXPAND"}
												</Button>
											</div>
										</div>

										{isExpanded && (
											<div className="mt-3 grid grid-cols-2 gap-2 rounded bg-black/60 p-3 text-white/80 text-xs">
												<div className="flex justify-between">
													<span className="text-white/50">Earned:</span>
													<span className="text-green-400">
														+₹{data.stats.moneyEarned}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-white/50">Spent:</span>
													<span className="text-red-400">
														-₹{data.stats.moneySpent}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-white/50">Props Bought:</span>
													<span className="text-white">
														{data.stats.propertiesBought}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-white/50">Props Traded:</span>
													<span className="text-white">
														{data.stats.propertiesSold}
													</span>
												</div>
												<div className="col-span-2 flex justify-between border-white/10 border-t pt-2">
													<span className="text-white/50">
														Trades Completed:
													</span>
													<span className="text-white">
														{data.stats.tradesCompleted}
													</span>
												</div>
											</div>
										)}
										<div className="pointer-events-none absolute inset-0 -mx-1 border-white border-x-4" />
									</div>
								);
							})}
						</div>

						<div className="mt-8 flex flex-col gap-4">
							<Button
								className={"w-full py-6 text-lg"}
								onClick={handlePlayAgain}
							>
								PLAY AGAIN
							</Button>
							<Button
								className="w-full py-6 text-lg"
								onClick={handleBackToHome}
								variant="outline"
							>
								BACK TO HOME
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
