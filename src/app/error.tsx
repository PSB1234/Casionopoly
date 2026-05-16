"use client";

import { useEffect } from "react";
import { useAudio } from "@/components/provider/audio_provider";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";

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
			<Card className="z-10 w-full max-w-2xl">
				<div className="flex w-full flex-col items-center gap-6 p-8">
					<h1 className="retro text-center text-6xl [-webkit-text-stroke:2px_white] text-red-500 md:text-8xl">
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
			</Card>
		</div>
	);
}
