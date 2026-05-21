type TitleProps = {
	size?: "sm" | "lg" | "xl";
};

const sizeMap = {
	sm: {
		h1: "text-3xl md:text-4xl",
		h2: "text-lg md:text-xl",
	},
	lg: {
		h1: "text-5xl md:text-6xl",
		h2: "text-xl md:text-2xl",
	},
	xl: {
		h1: "text-6xl md:text-8xl",
		h2: "text-2xl md:text-4xl",
	},
};

export default function Title({ size = "lg" }: TitleProps) {
	const { h1 } = sizeMap[size] || sizeMap.lg;
	return (
		<div className="relative">
			<h1 className={`relative z-10 font-bold font-jaro ${h1} text-yellow-200`}>
				Casionopoly
			</h1>
			<div
				className={`pointer-events-none absolute top-1 left-1 select-none font-bold font-jaro ${h1} text-black`}
			>
				Casionopoly
			</div>
		</div>
	);
}

type TitleWithSubtitleProps = TitleProps & {
	subtitle?: boolean;
};

export function TitleWithSubtitle({
	size = "lg",
	subtitle = true,
}: TitleWithSubtitleProps) {
	const { h1, h2 } = sizeMap[size] || sizeMap.lg;
	return (
		<div className="mb-10 flex h-full select-none flex-col items-center justify-center text-center">
			<div className="relative">
				<h1
					className={`relative z-10 font-bold font-jaro ${h1} text-yellow-200`}
				>
					Casionopoly
				</h1>
				<div
					className={`pointer-events-none absolute top-1 left-1 select-none font-bold font-jaro ${h1} text-black`}
				>
					Casionopoly
				</div>
			</div>
			{subtitle && (
				<h2 className={`relative font-bold font-jaro ${h2} text-yellow-200`}>
					Own.Trade.Conquer
				</h2>
			)}
		</div>
	);
}
