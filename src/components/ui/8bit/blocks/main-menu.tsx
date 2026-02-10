"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateMenu from "@/components/createMenu";
import { Button } from "@/components/ui/8bit/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";
import { getMenuItems } from "@/lib/main_menu";
import { generateColorPair } from "@/lib/random_color";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

export default function MainMenu({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const { emitEvent } = useSocketStore();
	const { color, setColor } = useGameStore();
	const [optionsOpen, setOptionsOpen] = useState(false);
	const handleQuickJoin = () => {
		let finalColor = color;
		if (!finalColor) {
			const { original } = generateColorPair();
			finalColor = original;
			setColor(finalColor);
		}
		emitEvent(SOCKET_EVENTS.JOIN_RANDOM_ROOM, finalColor);
	};
	const menuItems = getMenuItems(router, handleQuickJoin, setOptionsOpen);
	return (
		<>
			<CreateMenu
				optionsOpen={optionsOpen}
				setOptionsOpenAction={setOptionsOpen}
			/>
			<Card className={cn(className)} {...props}>
				<CardHeader className="flex flex-col items-center justify-center gap-2">
					<CardTitle>Main Menu</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-8">
						{menuItems.map((item) => (
							<Button
								className="flex items-center gap-2"
								key={item.label}
								onClick={item.action}
							>
								<span>{item.label}</span>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>
		</>
	);
}
