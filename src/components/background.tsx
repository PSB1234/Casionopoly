"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SpaceShip from "@/components/space-ship";

interface ActiveShip {
	id: number;
	number: number;
	pattern: string;
	color: string;
	direction: string;
	top: number;
	duration: number;
	size: number;
}

function SpaceshipSpawner() {
	const [ships, setShips] = useState<ActiveShip[]>([]);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		let idCounter = 0;
		let isMounted = true;

		const spawn = () => {
			if (!isMounted) return;

			setShips((prev) => {
				if (prev.length >= 4) {
					return prev;
				}

				const numbers = [1, 2, 3, 4, 5, 6];
				const patterns = ["Pattern1", "Pattern2", "Pattern3"];
				const colors = ["Blue", "Green", "Red", "Yellow"];
				const spawnLeft = Math.random() > 0.5;

				const newShip: ActiveShip = {
					id: idCounter++,
					number: numbers[Math.floor(Math.random() * numbers.length)]!,
					pattern: patterns[Math.floor(Math.random() * patterns.length)]!,
					color: colors[Math.floor(Math.random() * colors.length)]!,
					// If it spawns on the left, it travels right. Thus it should face right.
					direction: spawnLeft ? "Right" : "Left",
					top: Math.floor(Math.random() * 80) + 10,
					duration: Math.floor(Math.random() * 15) + 15,
					size: Math.floor(Math.random() * 64) + 32,
				};

				return [...prev, newShip];
			});

			timeout = setTimeout(spawn, Math.random() * 4000 + 2000);
		};

		spawn();

		return () => {
			isMounted = false;
			clearTimeout(timeout);
		};
	}, []);

	return (
		<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
			{ships.map((ship) => (
				<div
					className="absolute"
					key={ship.id}
					onAnimationEnd={() => {
						setShips((prev) => prev.filter((s) => s.id !== ship.id));
					}}
					style={{
						top: `${ship.top}%`,
						left: 0,
						animation: `moveShip${ship.direction} ${ship.duration}s linear forwards`,
					}}
				>
					<SpaceShip
						color={ship.color}
						direction={ship.direction}
						number={ship.number}
						pattern={ship.pattern}
						size={ship.size}
					/>
				</div>
			))}
			<style>{`
				@keyframes moveShipRight {
					from { transform: translateX(-300px); }
					to { transform: translateX(100vw); }
				}
				@keyframes moveShipLeft {
					from { transform: translateX(100vw); }
					to { transform: translateX(-300px); }
				}
			`}</style>
		</div>
	);
}

export default function Background() {
	return (
		<span className="fixed inset-0 -z-50">
			<Image
				alt="Night City"
				className="hidden md:block"
				fill
				quality={100}
				sizes="100vw"
				src={"/Images/back.webp"}
				style={{
					objectFit: "cover",
				}}
			/>
			<Image
				alt="Night City"
				className="block md:hidden"
				fill
				quality={100}
				sizes="100vw"
				src={"/Images/back_mobile.webp"}
				style={{
					objectFit: "cover",
				}}
			/>
			<SpaceshipSpawner />
		</span>
	);
}
