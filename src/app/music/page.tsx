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
					<CardTitle className="text-center">MUSIC</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-center text-muted-foreground text-sm">
						Select default music for the game
					</p>

					<div >
						{MUSIC_TRACKS.map((track, index) => (
							<div
								className="flex items-center justify-between rounded-lg p-3"
								key={track.id}
							>
								<div className="flex flex-col">
									<span className="font-medium">{track.name}</span>
									{track.artist && (
										<span className="text-muted-foreground text-xs">
											{track.artist}
										</span>
									)}
									{selectedTrackIndex === index && (
										<span className="text-xs text-yellow-500">Default</span>
									)}
								</div>

								<div className="flex gap-6">
									<Button
										onClick={() => handlePreview(index)}
										size="sm"
										variant={previewingIndex === index ? "default" : "outline"}
									>
										{previewingIndex === index ? "Stop" : "Preview"}
									</Button>
									<Button
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
