"use client";
import type React from "react";
import {
	createContext,
	type RefObject,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

interface AudioContextType {
	audioRef: RefObject<HTMLAudioElement | null>; // ← mutable, assignable
	isSoundOn: boolean;
	toggleSound: () => void;
	isMusicSuppressed: boolean;
	setMusicSuppressed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isSoundOn, setIsSoundOn] = useState(false);
	const [isMusicSuppressed, setMusicSuppressed] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("isSoundOn");
		if (stored !== null) {
			const parsed = stored === "true";
			setIsSoundOn(parsed);
			if (audioRef.current) {
				audioRef.current.muted = !parsed;
				if (!parsed) {
					audioRef.current.pause();
				}
			}
		}
	}, []);

	const toggleSound = useCallback(() => {
		setIsSoundOn((prev) => {
			const next = !prev;
			localStorage.setItem("isSoundOn", String(next));

			if (audioRef.current) {
				if (next) {
					audioRef.current.muted = false;
					if (!isMusicSuppressed) {
						audioRef.current.play().catch(console.error);
					}
				} else {
					audioRef.current.muted = true;
					audioRef.current.pause();
				}
			}

			return next;
		});
	}, [isMusicSuppressed]);

	return (
		<AudioContext.Provider
			value={{
				audioRef,
				isSoundOn,
				toggleSound,
				isMusicSuppressed,
				setMusicSuppressed,
			}}
		>
			{children}
		</AudioContext.Provider>
	);
};

export function useAudio() {
	const ctx = useContext(AudioContext);
	if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
	return ctx;
}
