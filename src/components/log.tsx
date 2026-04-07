"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import { useGameStore } from "@/store/game_store";

const formatTimestamp = (timestamp: number) => {
	return new Date(timestamp).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

export default function Log() {
	const logs = useGameStore((state) => state.logs);
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const root = scrollAreaRef.current;
		if (!root) return;

		const viewport = root.querySelector<HTMLElement>(
			'[data-slot="scroll-area-viewport"]',
		);
		if (!viewport) return;

		viewport.scrollTop = viewport.scrollHeight;
	}, [logs.length]);

	return (
		<div className="h-[22cqmin] min-h-36 w-full max-h-56 overflow-hidden bg-card/95 p-2">
			<ScrollArea className="h-full w-full p-2" ref={scrollAreaRef}>
				{logs.length === 0 ? (
					<p className="text-muted-foreground text-xs sm:text-sm">
						No game logs yet.
					</p>
				) : (
					<ul className="space-y-1.5">
						{logs.map((log) => (
							<li className="text-xs leading-relaxed sm:text-sm" key={log.id}>
								<span className="mr-2 text-muted-foreground/80">
									[{formatTimestamp(log.timestamp)}]
								</span>
								<span>{log.message}</span>
							</li>
						))}
					</ul>
				)}
			</ScrollArea>
		</div>
	);
}