"use client"
import type React from "react";
import {
	createContext, type RefObject,
	useCallback,
	useContext,
	useRef,
	useState
} from "react";

interface AudioContextType {
	audioRef: RefObject<HTMLAudioElement | null>; // ← mutable, assignable
	isSoundOn: boolean;
	toggleSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isSoundOn, setIsSoundOn] = useState(true);

	
	const toggleSound = useCallback(() => {
	  setIsSoundOn((prev) => {
		const next = !prev;
  
		if (audioRef.current) {
		  if (next) {
			audioRef.current.muted = false;
			audioRef.current.play().catch(console.error);
		  } else {
			audioRef.current.muted = true;
			audioRef.current.pause();
		  }
		}
  
		return next;
	  });
	}, []);
  

	return (
		<AudioContext.Provider value={{ audioRef, isSoundOn, toggleSound }}>
			{children}
		</AudioContext.Provider>
	);
};

export function useAudio() {
	const ctx = useContext(AudioContext);
	if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
	return ctx;
}
