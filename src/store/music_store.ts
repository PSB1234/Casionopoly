import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MusicTrack {
	id: number;
	name: string;
	artist: string;
	srcMp3: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
	{
		id: 0,
		name: "The World of 8 Bit Games",
		artist: "Music by Krzysztof Szymanski",
		srcMp3: "/music/background/djartmusic-the-world-of-8-bit-games-301273.mp3",
	},
	{
		id: 1,
		name: "Synthwave 80s Retro",
		artist: "",
		srcMp3: "/music/background/tunetank-synthwave-80s-retro-background-music-347701.mp3",
	},
	{
		id: 2,
		name: "Best Game Console",
		artist: "",
		srcMp3: "/music/background/djartmusic-best-game-console-301284.mp3",
	},
];

export interface MusicState {
	selectedTrackIndex: number;
	previewingIndex: number | null;
}

export interface MusicActions {
	setSelectedTrackIndex: (index: number) => void;
	setPreviewingIndex: (index: number | null) => void;
}

export type MusicStore = MusicState & MusicActions;

export const useMusicStore = create<MusicStore>()(
	persist(
		(set) => ({
			selectedTrackIndex: 0,
			previewingIndex: null,
			setSelectedTrackIndex: (index) =>
				set({ selectedTrackIndex: index, previewingIndex: null }),
			setPreviewingIndex: (index) => set({ previewingIndex: index }),
		}),
		{
			name: "music-storage",
		},
	),
);