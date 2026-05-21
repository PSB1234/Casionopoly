import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import type { Player } from "@/lib/type";
import PlayerSprite from "@/components/board/player_sprite";

export default function PlayerList({ PlayerList }: { PlayerList: Player[] }) {
	return (
		<Card>
			<CardTitle className="px-5">Player List</CardTitle>
			<CardContent className="space-y-4 text-clip">
				{PlayerList.sort((a, b) => {
					if (a.rank !== b.rank) {
						return a.rank - b.rank; // Higher rank first
					}
					return a.username.localeCompare(b.username);
				}).map((player, _index) => (
					<div
						className="flex flex-row items-center justify-between gap-4"
						key={player.id}
					>
						<div className="size-15"><PlayerSprite color={player.color} /></div>
						<div className="flex w-full min-w-0 justify-between gap-2 font-sans text-white">
							<p className="truncate text-sm font-bold">
								{player.username}
							</p>
							<p className="shrink-0 text-xs font-bold">${player.money}</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
