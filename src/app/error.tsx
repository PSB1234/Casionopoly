"use client";

import { useEffect } from "react";
import { useAudio } from "@/components/provider/audio_provider";
import { Button } from "@/components/ui/8bit/button";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { setMusicSuppressed } = useAudio();

	useEffect(() => {
		setMusicSuppressed(true);
		return () => setMusicSuppressed(false);
	}, [setMusicSuppressed]);

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden p-4">
			<div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
			<div className="z-10 flex w-full max-w-2xl flex-col items-center gap-6">
				<h1 className="retro text-center text-6xl text-red-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] md:text-8xl">
					ERROR
				</h1>
				<p className="retro text-center text-white/80 text-xl md:text-2xl">
					SOMETHING WENT WRONG
				</p>
				<Button
					className="mt-8 w-full max-w-md bg-red-700 py-6 text-lg hover:bg-red-600"
					onClick={() => reset()}
				>
					TRY AGAIN
				</Button>
			</div>
		</div>
	);
}
