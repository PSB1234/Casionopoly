/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useAudio } from "@/components/provider/audio_provider";
import { MUSIC_TRACKS, useMusicStore } from "@/store/music_store";

interface BackgroundMusicProps {
	delayMs?: number;
}

export default function BackgroundMusic({ delayMs = 2000 }: BackgroundMusicProps) {
	const { audioRef, isSoundOn, toggleSound } = useAudio();
	const currentIndexRef = useRef<number>(0);
	const pendingPlayRef = useRef<boolean>(false);
	const pathname = usePathname();
	const { selectedTrackIndex, previewingIndex } = useMusicStore();

	const playTrack = useCallback(
		(
			audio: HTMLAudioElement,
			index: number,
			destroyed = { current: false },
			delayMs = 0,
		) => {
			const track = MUSIC_TRACKS[index];
			if (!track) return;

			currentIndexRef.current = index;
			audio.src = track.srcMp3;
			audio.volume = 0.8;

			const attemptPlay = () => {
				if (destroyed.current) return;
				audio
					.play()
					.then(() => {
						if (destroyed.current) return;
						pendingPlayRef.current = false;
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

	const playPreview = useCallback(
		(
			audio: HTMLAudioElement,
			index: number,
			destroyed = { current: false },
		) => {
			const track = MUSIC_TRACKS[index];
			if (!track) return;

			currentIndexRef.current = index;
			audio.src = track.srcMp3;
			audio.volume = 0.8;
			audio.loop = false;
			audio.muted = !isSoundOn;

			audio
				.play()
				.then(() => {
					if (destroyed.current) return;
				})
				.catch((err: unknown) => {
					if (destroyed.current) return;
					console.error(err);
				});
		},
		[isSoundOn],
	);

	const stopPreview = useCallback((audio: HTMLAudioElement) => {
		audio.pause();
		audio.currentTime = 0;
	}, []);

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

	useEffect(() => {
		const audio = new Audio();
		audio.loop = false;
		audio.muted = !isSoundOn;
		audioRef.current = audio;

		const destroyedRef = { current: false };

		const handleEnded = () => {
			if (previewingIndex !== null) return;
			const nextIndex = (currentIndexRef.current + 1) % MUSIC_TRACKS.length;
			playTrack(audio, nextIndex, destroyedRef);
		};

		audio.addEventListener("ended", handleEnded);

		if (previewingIndex !== null) {
			playPreview(audio, previewingIndex, destroyedRef);
		} else {
			playTrack(audio, selectedTrackIndex, destroyedRef, delayMs);
		}

		return () => {
			destroyedRef.current = true;
			audio.removeEventListener("ended", handleEnded);
			stopPreview(audio);
			audioRef.current = null;
		};
	}, [selectedTrackIndex, previewingIndex, playTrack, playPreview, stopPreview, delayMs]);

	return null;
}