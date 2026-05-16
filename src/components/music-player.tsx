"use client";

import Image from "next/image";
import { useAudio } from "@/components/provider/audio_provider";

export default function VolumeControl() {
	const { isSoundOn, toggleSound } = useAudio();

	return (
		<div className="relative flex w-full flex-col items-end justify-center">
			<button
				className="flex items-center justify-center"
				onClick={toggleSound}
				type="button"
			>
				<Image
					alt={isSoundOn ? "Volume" : "Volume muted"}
					className="pixelated cursor-pointer"
					height={36}
					src={
						isSoundOn
							? "/icons/sound-on-solid-foreground.svg"
							: "/icons/sound-mute-solid-foreground.svg"
					}
					style={{ width: 30, height: 36 }}
					width={30}
				/>
			</button>
		</div>
	);
}
