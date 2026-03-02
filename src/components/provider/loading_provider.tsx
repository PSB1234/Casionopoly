"use client";

import LoadingScreen from "@/components/ui/8bit/loading-screen";
import { useGameStore } from "@/store/game_store";

export default function LoadingProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const isNavigating = useGameStore((state) => state.isNavigating);

	return (
		<>
			{isNavigating && <LoadingScreen />}
			{children}
		</>
	);
}
