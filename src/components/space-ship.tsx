"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface SpaceShipProps {
	number: number | string;
	pattern: string;
	color: string;
	direction: string;
	className?: string;
	size?: number;
	fps?: number;
}

export default function SpaceShip({
	number,
	pattern,
	color,
	direction,
	size = 16,
	fps = 6,
}: SpaceShipProps) {
	const [frame, setFrame] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setFrame((prev) => (prev % 6) + 1);
		}, 1000 / fps);

		return () => clearInterval(interval);
	}, [fps]);

	// Construct the path based on the folder structure provided
	const src = `/Images/Ships/${number}/${pattern}/${color}/${direction}/${frame}.png`;

	return (
		<Image
			alt={`Space Ship ${number} ${pattern} ${color} ${direction}`}
			height={size}
			src={src}
			style={{ width: size, height: size }}
			unoptimized // Unoptimized is often better for pixel art animations to avoid blurring and save bandwidth
			width={size}
		/>
	);
}
