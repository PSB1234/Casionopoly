import * as React from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/8bit/avatar";
import { Badge } from "@/components/ui/8bit/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";
import { Separator } from "@/components/ui/8bit/separator";
import { cn } from "@/lib/utils";

import "./styles/retro.css";

export interface LeaderboardPlayer {
	id: string;
	name: string;
	score: number;
	rank?: number;
	isCurrentPlayer?: boolean;
	avatar?: string;
	avatarFallback?: string;
}

export interface LeaderboardProps extends React.ComponentProps<"div"> {
	players: LeaderboardPlayer[];
	maxPlayers?: number;
	showRank?: boolean;
	showAvatar?: boolean;
	className?: string;
	title?: string;
	currentPlayerId?: string;
}


function getRankVariant(
	rank: number,
	isCurrentPlayer: boolean,
): "default" | "first" | "second" | "third" | "current" {
	if (isCurrentPlayer) return "current";
	if (rank === 1) return "first";
	if (rank === 2) return "second";
	if (rank === 3) return "third";
	return "default";
}

function formatScore(score: number): string {
	return score.toLocaleString();
}

export function Leaderboard({
	players,
	maxPlayers = 10,
	showRank = true,
	showAvatar = true,
	className,
	title = "LEADERBOARD",
	currentPlayerId,
	...props
}: LeaderboardProps) {
	// Sort players by score (descending) and assign ranks
	const sortedPlayers = React.useMemo(() => {
		return players
			.sort((a, b) => b.score - a.score)
			.slice(0, maxPlayers)
			.map((player, index) => ({
				...player,
				rank: index + 1,
				isCurrentPlayer: currentPlayerId
					? player.id === currentPlayerId
					: player.isCurrentPlayer,
			}));
	}, [players, maxPlayers, currentPlayerId]);

	return (
		<Card
			className={className}
			data-slot="leaderboard"
			font={"retro"}
			{...props}
		>
			{title && (
				<CardHeader>
					<CardTitle className="text-center">{title}</CardTitle>
				</CardHeader>
			)}

			<CardContent className="space-y-5">
				<div className="space-y-2">
					{sortedPlayers.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							<p className="retro text-sm">No players yet</p>
						</div>
					) : (
						sortedPlayers.map((player) => {
							return (
								<div
									key={player.id}
								>
									<div className="flex items-center gap-3">
										{showAvatar && (
											<Avatar className="size-10" font="retro" variant="pixel">
												{player.avatar && (
													<AvatarImage alt={player.name} src={player.avatar} />
												)}
												<AvatarFallback className="retro text-xs">
													{player.avatarFallback ||
														player.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
										)}

										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-4">
												<span
													className={cn(
														"retro truncate font-medium text-xs md:text-sm",
														player.isCurrentPlayer && "font-bold text-primary",
													)}
												>
													{player.name}
												</span>
												{player.isCurrentPlayer && (
													<Badge className="text-[9px]">YOU</Badge>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<span
											className="retro font-bold text-xs md:text-sm"
										>
											{formatScore(player.score)}
										</span>
									</div>
								</div>
							);
						})
					)}
				</div>

				<Separator />

				{sortedPlayers.length > 0 && (
					<div className="mt-4 pt-4">
						<p
							className="retro text-center text-muted-foreground text-xs"
						>
							Showing top {Math.min(sortedPlayers.length, maxPlayers)} players
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default Leaderboard;
