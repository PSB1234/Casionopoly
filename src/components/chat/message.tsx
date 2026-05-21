import { cn } from "@/lib/utils";

export default function Message({
	name,
	message,
	isOwn,
}: {
	name: string;
	message: string;
	isOwn?: boolean;
}) {
	return (
		<div
			className={cn(
				"mb-3 flex flex-col font-sans max-w-[85%]",
				isOwn ? "ml-auto items-end" : "mr-auto items-start"
			)}
		>
			<span className="text-[10px] opacity-70 mb-0.5 px-1 font-retro">{name}</span>
			<div
				className={cn(
					"rounded-lg px-3 py-2 text-sm text-white",
					isOwn 
						? "bg-primary rounded-br-sm" 
						: "bg-muted rounded-bl-sm"
				)}
			>
				{message}
			</div>
		</div>
	);
}
