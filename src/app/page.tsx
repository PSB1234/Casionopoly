"use client";
import { useEffect } from "react";
import ChangeName from "@/components/change-name";
import HowToPlay from "@/components/how-to-play";
import { TitleWithSubtitle } from "@/components/title";
import MainMenu from "@/components/ui/8bit/blocks/main-menu";
import { useGameStore } from "@/store/game_store";

export default function HomePage() {
	const setIsNavigating = useGameStore((state) => state.setIsNavigating);
	useEffect(() => {
		setIsNavigating(false);
	}, [setIsNavigating]);
	return (
		<main className="flex min-h-screen flex-col items-center gap-8 md:gap-12 overflow-x-hidden overflow-y-auto px-4 pt-16 md:pt-24 pb-12 text-white">
			<TitleWithSubtitle size="xl" />
			<div className="w-full max-w-sm">
				<ChangeName />
			</div>
			<MainMenu />
			
			<HowToPlay />
		</main>
	);
}
