"use client";
import { useEffect } from "react";
import BackgroundMusic from "@/components/background-music";
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
		<main className="flex min-h-screen flex-col items-center gap-12 overflow-auto pt-24 pb-12 text-white">
			<BackgroundMusic delayMs={1 * 1000} trackIndex={0} />
			<TitleWithSubtitle size="xl" />
			<MainMenu />
			<HowToPlay />
		</main>
	);
}
