/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useAudio } from "@/components/provider/audio_provider";
import { toast } from "@/components/ui/8bit/toast";

interface Track {
	name: string;
	artist: string;
	srcMp3: string;
	srcOgg?: string;
}

const TRACKS: Track[] = [
	{
		name: "The world of 8 bit games",
		artist: "Music by Krzysztof Szymanski",
		srcMp3: "/music/background/djartmusic-the-world-of-8-bit-games-301273.mp3",
	},
];

interface BackgroundMusicProps {
	trackIndex?: number;
	delayMs?: number;
}

export default function BackgroundMusic({
	trackIndex = 0,
	delayMs = 2000,
}: BackgroundMusicProps) {
	const { audioRef, isSoundOn, toggleSound } = useAudio();
	const currentIndexRef = useRef<number>(trackIndex);
	const pendingPlayRef = useRef<boolean>(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleInteraction = () => {
			if (pathname === "/" && pendingPlayRef.current && !isSoundOn) {
				pendingPlayRef.current = false;
				toggleSound();
			}
		};

		document.addEventListener("click", handleInteraction);
		return () => document.removeEventListener("click", handleInteraction);
	}, [pathname, isSoundOn, toggleSound]);

	const playTrack = useCallback(
		(
			audio: HTMLAudioElement,
			index: number,
			destroyed = { current: false },
			delayMs = 0,
		) => {
			const track = TRACKS[index];
			if (!track) return;

			currentIndexRef.current = index;
			audio.src = track.srcOgg || track.srcMp3;
			audio.volume = 0.8;

			const attemptPlay = () => {
				if (destroyed.current) return;
				audio
					.play()
					.then(() => {
						if (destroyed.current) return; // ← component gone, skip side effects
						pendingPlayRef.current = false;
						toast(track.name, { description: track.artist });
					})
					.catch((err: unknown) => {
						if (destroyed.current) return;
						if (err instanceof DOMException && err.name === "NotAllowedError") {
							pendingPlayRef.current = true;
							if (isSoundOn) toggleSound();
						} else {
							console.error(err);
						}
					});
			};

			if (delayMs > 0) {
				setTimeout(attemptPlay, delayMs);
			} else {
				attemptPlay();
			}
		},
		[isSoundOn, toggleSound],
	);

	useEffect(() => {
		const audio = new Audio();
		audio.loop = false;
		audio.muted = !isSoundOn;
		audioRef.current = audio;

		const destroyedRef = { current: false };

		const handleEnded = () => {
			const nextIndex = (currentIndexRef.current + 1) % TRACKS.length;
			playTrack(audio, nextIndex, destroyedRef);
		};

		audio.addEventListener("ended", handleEnded);
		playTrack(audio, trackIndex, destroyedRef, 2000);

		return () => {
			destroyedRef.current = true; // ← flip on cleanup
			audio.removeEventListener("ended", handleEnded);

			const pauseSafely = () => {
				audio.pause();
				audioRef.current = null;
			};

			if (audio.readyState === 0 || audio.paused) {
				pauseSafely();
			} else {
				audio
					.play()
					.then(() => {
						if (destroyedRef.current) pauseSafely();
					})
					.catch(() => {
						if (destroyedRef.current) pauseSafely();
					});
			}
		};
	}, [trackIndex, playTrack]);

	return null;
}
