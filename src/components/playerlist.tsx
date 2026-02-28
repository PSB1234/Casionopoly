import { Avatar, AvatarFallback } from "@/components/ui/8bit/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";
import type { Player } from "@/lib/type";

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
						<Avatar>
							<AvatarFallback>
								{player.username.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex w-full justify-between gap-2">
							<p className="wrap-break-word text-xs">
								{player.rank}.{player.username}
							</p>
							<p className="text-xs opacity-75">${player.money}</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
