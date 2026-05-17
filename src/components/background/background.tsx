"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SpaceShip from "@/components/background/space-ship";

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
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const pathname = usePathname();
	const isHomepage = pathname === "/";

	useEffect(() => {
		if (!isHomepage) return;

		const handleMouseMove = (e: MouseEvent) => {
			const x = (e.clientX / window.innerWidth - 0.5) * 0.3;
			const y = (e.clientY / window.innerHeight - 0.5) * 0.3;
			setMousePos({ x, y });
		};
		window.addEventListener("mousemove", handleMouseMove, { capture: true });
		return () => window.removeEventListener("mousemove", handleMouseMove, { capture: true });
	}, [isHomepage]);

	return (
		<div className="fixed inset-0 -z-50 overflow-hidden bg-[#281E50]">
			{/* Backup/Fallback Image - Always render behind */}
			<Image
				alt="Night City Backup"
				className="absolute top-0 left-0 h-full w-full object-cover"
				fill
				quality={100}
				src="/Images/back.webp"
				style={{ imageRendering: "pixelated" }}
				unoptimized
			/>
			{isHomepage && (
				<>
					{/* Layer 1: Back */}
					<div
						className="absolute inset-0 transition-transform duration-200 ease-out"
						style={{
							transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -5}px) scale(1.02)`,
						}}
					>
						<Image
							alt="Background Back Layer"
							className="absolute top-0 left-0 h-full w-full object-cover"
							fill
							priority
							quality={100}
							src="/Images/Layers/back.webp"
							style={{ imageRendering: "pixelated" }}
							unoptimized
						/>
					
					</div>

					{/* Layer 2: Buildings */}
					<div
						className="absolute inset-0 transition-transform duration-200 ease-out"
						style={{
							transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) scale(1.02)`,
						}}
					>
						<Image
							alt="Buildings Shadow"
							className="absolute top-0 left-0 h-full w-full object-cover translate-x-[4px] translate-y-[4px] brightness-0 md:translate-x-[8px] md:translate-y-[8px]"
							fill
							priority
							quality={100}
							src="/Images/Layers/buildings.webp"
							style={{ imageRendering: "pixelated" }}
							unoptimized
						/>
						<Image
							alt="Buildings Layer"
							className="absolute top-0 left-0 h-full w-full object-cover"
							fill
							priority
							quality={100}
							src="/Images/Layers/buildings.webp"
							style={{ imageRendering: "pixelated" }}
							unoptimized
						/>
					</div>

					{/* Layer 3: Front */}
					<div
						className="absolute inset-0  transition-transform duration-200 ease-out"
						style={{
							transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px) scale(1.02)`,
						}}
					>
						<Image
							alt="Front Shadow"
							className="absolute top-0 left-0 h-full w-full object-cover translate-x-[4px] translate-y-[4px] brightness-0 md:translate-x-[8px] md:translate-y-[8px]"
							fill
							priority
							quality={100}
							src="/Images/Layers/front.webp"
							style={{ imageRendering: "pixelated" }}
							unoptimized
						/>
						<Image
							alt="Front Layer"
							className="absolute top-0 left-0 h-full w-full object-cover"
							fill
							priority
							quality={100}
							src="/Images/Layers/front.webp"
							style={{ imageRendering: "pixelated" }}
							unoptimized
						/>
					</div>
				</>
			)}

			<SpaceshipSpawner />
		</div>
	);
}
