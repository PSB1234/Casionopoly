"use client";
import { usePathname, useRouter } from "next/navigation";
import { Activity, useEffect, useState } from "react";
import VolumeControl from "@/components/music-player";
import Title from "@/components/title";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";
export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const [isHomepage, setIsHomepage] = useState(false);
	const username = useGameStore((state) => state.username);
	useEffect(() => {
		if (pathname === "/") {
			setIsHomepage(true);
		} else {
			setIsHomepage(false);
		}
	});
	return (
		<div
			className={cn(
				"flex h-fit w-full flex-row items-center justify-between border-0 px-4 pt-8",
				pathname === "/searchRoom"
					? "border-foreground border-b-4 bg-card"
					: "",
			)}
		>
			<Activity mode={isHomepage ? "hidden" : "visible"}>
				<button
					className="px-5"
					onClick={() => router.replace("/")}
					type="button"
				>
					<Title size="sm" />
				</button>
			</Activity>
			<Activity mode={!isHomepage ? "hidden" : "visible"}>
				<h3 className="w-full font-jaro text-2xl text-[#fff085]">
					Hello, {username}
				</h3>
			</Activity>
			<VolumeControl />
		</div>
	);
}
