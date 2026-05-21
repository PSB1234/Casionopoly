"use client";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/8bit/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";
import { MUSIC_TRACKS, useMusicStore } from "@/store/music_store";

export default function MusicPage() {
	const router = useRouter();
	const {
		selectedTrackIndex,
		previewingIndex,
		setSelectedTrackIndex,
		setPreviewingIndex,
	} = useMusicStore();
	const previewAudioRef = useRef<HTMLAudioElement | null>(null);

	const handlePreview = useCallback(
		(index: number) => {
			if (previewingIndex === index) {
				if (previewAudioRef.current) {
					previewAudioRef.current.pause();
					previewAudioRef.current = null;
				}
				setPreviewingIndex(null);
				return;
			}

			if (previewAudioRef.current) {
				previewAudioRef.current.pause();
			}

			const track = MUSIC_TRACKS[index];
			if (!track) return;

			const audio = new Audio();
			audio.src = track.srcMp3;
			audio.volume = 0.8;
			audio.loop = false;
			previewAudioRef.current = audio;

			audio.play().then(() => {
				setPreviewingIndex(index);
			});

			audio.addEventListener("ended", () => {
				setPreviewingIndex(null);
				previewAudioRef.current = null;
			});
		},
		[previewingIndex, setPreviewingIndex],
	);

	const handleSelect = useCallback(
		(index: number) => {
			if (previewAudioRef.current) {
				previewAudioRef.current.pause();
				previewAudioRef.current = null;
			}
			setPreviewingIndex(null);
			setSelectedTrackIndex(index);
		},
		[setSelectedTrackIndex, setPreviewingIndex],
	);

	const handleBack = useCallback(() => {
		if (previewAudioRef.current) {
			previewAudioRef.current.pause();
			previewAudioRef.current = null;
		}
		setPreviewingIndex(null);
		router.push("/");
	}, [router, setPreviewingIndex]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
			<Card className="w-full max-w-4xl" font="retro">
				<CardHeader>
					<CardTitle className="text-center font-jaro text-3xl">Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-muted-foreground text-sm mb-4">
						Select default music for the game
					</p>

					<div className="space-y-2">
						{MUSIC_TRACKS.map((track, index) => (
							<div
								className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 rounded-lg p-3"
								key={track.id}
							>
								<div className="flex flex-col items-center md:items-start">
									<span className="font-medium text-center md:text-left">{track.name}</span>
									{track.artist && (
										<span className="text-muted-foreground text-xs text-center md:text-left">
											{track.artist}
										</span>
									)}
									{selectedTrackIndex === index && (
										<span className="text-xs text-yellow-500 mt-1">Default</span>
									)}
								</div>

								<div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
									<Button
										className="w-full md:w-auto"
										onClick={() => handlePreview(index)}
										size="sm"
										variant={previewingIndex === index ? "default" : "outline"}
									>
										{previewingIndex === index ? "Stop" : "Preview"}
									</Button>
									<Button
										className="w-full md:w-auto"
										disabled={previewingIndex === index}
										onClick={() => handleSelect(index)}
										size="sm"
										variant={
											selectedTrackIndex === index ? "default" : "outline"
										}
									>
										{selectedTrackIndex === index ? "Selected" : "Select"}
									</Button>
								</div>
							</div>
						))}
					</div>

					<Button className="w-full" onClick={handleBack} variant="outline">
						Back to Home
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
