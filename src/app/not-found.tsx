"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";

export default function NotFound() {
	const router = useRouter();
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden p-4">
			<div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
			<Card className="z-10 w-full max-w-2xl">
				<div className="flex w-full flex-col items-center gap-6 p-8">
					<h1 className="retro text-center text-6xl [-webkit-text-stroke:2px_white]  text-red-500  md:text-8xl">
						404
					</h1>
					<p className="retro text-center text-white/80 text-xl md:text-2xl">
						PAGE NOT FOUND
					</p>
					<Button
						className="mt-8 w-full max-w-md bg-red-700 py-6 text-lg hover:bg-red-600"
						onClick={() => router.replace("/")}
					>
						BACK TO HOME
					</Button>
				</div>
			</Card>
		</div>
	);
}
