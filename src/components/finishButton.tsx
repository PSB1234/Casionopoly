"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/8bit/button";

export default function FinishButton({ game_id }: { game_id: string }) {
	const router = useRouter();

	const handleFinish = () => {
		router.push(`/game/${game_id}/result`);
	};

	return (
		<Button
			onClick={handleFinish}
			className="bg-red-600 hover:bg-red-700"
			size="sm"
		>
			Finish
		</Button>
	);
}