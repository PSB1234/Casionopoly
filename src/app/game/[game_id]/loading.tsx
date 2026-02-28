import { Skeleton } from "@/components/ui/8bit/skeleton";

export default function Loading() {
	return (
		<div className="flex h-screen max-h-screen max-w-screen items-center justify-center gap-5 px-5">
			{/* Left Column */}
			<div className="flex h-full max-h-screen w-full max-w-sm flex-col justify-between gap-5 py-5">
				{/* Title and Sounds */}
				<div className="flex flex-row items-center justify-between">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-10 w-10" />
				</div>
				{/* Trade */}
				<Skeleton className="h-20 w-full" />
				{/* Chat */}
				<Skeleton className="h-full w-full" />
			</div>

			{/* Middle Column - Board */}
			<div className="my-4 max-h-fit max-w-3xl">
				<Skeleton className="h-[600px] w-[600px]" />
			</div>

			{/* Right Column */}
			<div className="flex h-full max-h-screen w-full max-w-sm flex-col gap-5 py-5">
				{/* Playerlist */}
				<Skeleton className="h-64 w-full" />
				{/* Buttons */}
				<div className="flex justify-between gap-2">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-32" />
				</div>
				{/* Properties */}
				<Skeleton className="h-full w-full" />
			</div>
		</div>
	);
}
