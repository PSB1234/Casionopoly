"use client";

import { cn } from "@/lib/utils";
import "./styles/retro.css";

interface TimerProps {
	seconds: number;
	className?: string;
}

export function Timer({ seconds, className }: TimerProps) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

	// Color states: green > 60s, yellow 30-60s, red < 30s
	const getColorClass = () => {
		if (seconds > 60) return "text-green-500";
		if (seconds > 30) return "text-yellow-500";
		return "text-red-500";
	};

	// Pulse animation when < 30 seconds
	const getPulseClass = () => {
		return seconds <= 30 && seconds > 0 ? "animate-pulse" : "";
	};

	if (seconds <= 0) return null;

	return (
		<div
			className={cn(
				"relative flex items-center justify-center border-foreground border-y-6 bg-card px-6 py-3 dark:border-ring",
				className,
			)}
		>
			<div className="retro flex flex-col items-center gap-1">
				<span className="text-muted-foreground text-xs uppercase">
					Time Remaining
				</span>
				<span
					className={cn(
						"font-bold text-3xl transition-colors",
						getColorClass(),
						getPulseClass(),
					)}
				>
					{formattedTime}
				</span>
			</div>

			{/* Pixelated borders on sides */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -mx-1.5 border-foreground border-x-6 dark:border-ring"
			/>
		</div>
	);
}
