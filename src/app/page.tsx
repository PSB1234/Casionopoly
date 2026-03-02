"use client";
import { useEffect } from "react";
import Title from "@/components/title";
import MainMenu from "@/components/ui/8bit/blocks/main-menu";
import { useGameStore } from "@/store/game_store";

export default function HomePage() {
	const setIsNavigating = useGameStore((state) => state.setIsNavigating);
	useEffect(() => {
		setIsNavigating(false);
	}, [setIsNavigating]);
	return (
		<main className="flex min-h-screen flex-col items-center justify-center text-white">
			<Title />
			<MainMenu />
		</main>
	);
}
