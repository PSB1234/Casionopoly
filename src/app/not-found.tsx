"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAudio } from "@/components/provider/audio_provider";
import { Button } from "@/components/ui/8bit/button";

export default function NotFound() {
	const router = useRouter();
	const { setMusicSuppressed } = useAudio();

	useEffect(() => {
		setMusicSuppressed(true);
		return () => setMusicSuppressed(false);
	}, [setMusicSuppressed]);

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden p-4 transition-colors duration-1000">
			<div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
			<div className="z-10 flex w-full max-w-2xl flex-col items-center gap-6">
				<h1 className="retro zoom-in animate-in text-center text-6xl text-red-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] duration-700 md:text-8xl">
					404
				</h1>
				<p className="retro slide-in-from-bottom-4 animate-in text-center text-white/80 text-xl delay-150 duration-700 md:text-2xl">
					PAGE NOT FOUND
				</p>
				<Button
					className="slide-in-from-bottom-8 mt-8 w-full max-w-md animate-in bg-red-700 py-6 text-lg delay-300 duration-700 hover:bg-red-600"
					onClick={() => router.replace("/")}
				>
					BACK TO HOME
				</Button>
			</div>
		</div>
	);
}
