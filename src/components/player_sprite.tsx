import { useId } from "react";

interface PlayerSpriteProps {
	color: string;
	className?: string;
}

export default function PlayerSprite({ color, className }: PlayerSpriteProps) {
	const clipId = useId();

	return (
		<svg
			className={className}
			height="100%"
			style={
				{
					"--color": color,
				} as React.CSSProperties
			}
			version="1.1"
			viewBox="0 0 32 32"
			width="100%"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>player</title>
			<defs>
				<clipPath id={clipId}>
					<rect height="2" width="12" x="10" y="0" />
					<rect height="2" width="20" x="6" y="2" />
					<rect height="2" width="24" x="4" y="4" />
					<rect height="4" width="28" x="2" y="6" />
					<rect height="12" width="32" x="0" y="10" />
					<rect height="4" width="28" x="2" y="22" />
					<rect height="2" width="24" x="4" y="26" />
					<rect height="2" width="20" x="6" y="28" />
					<rect height="2" width="12" x="10" y="30" />
				</clipPath>
			</defs>

			{/* Background Layer with Clip */}
			<g clipPath={`url(#${clipId})`}>
				<rect fill="var(--color)" height="32" width="32" x="0" y="0" />
				{/* Highlight */}
				<g fill="var(--color)" fillOpacity="0.2">
					<rect height="2" width="8" x="12" y="4" />
					<rect height="2" width="2" x="8" y="6" />
					<rect height="12" width="2" x="6" y="8" />
				</g>
			</g>

			{/* Black Outline */}
			<g fill="black" strokeWidth={2}>
				{/* Top Area */}
				<rect height="4" width="12" x="10" y="0" />
				<rect height="2" width="20" x="6" y="2" />
				<rect height="2" width="4" x="4" y="4" />
				<rect height="2" width="4" x="24" y="4" />

				{/* Sides */}
				<rect height="4" width="4" x="2" y="6" />
				<rect height="4" width="4" x="26" y="6" />
				<rect height="12" width="4" x="0" y="10" />
				<rect height="12" width="4" x="28" y="10" />
				<rect height="4" width="4" x="2" y="22" />
				<rect height="4" width="4" x="26" y="22" />

				{/* Bottom Area */}
				<rect height="2" width="4" x="4" y="26" />
				<rect height="2" width="4" x="24" y="26" />
				<rect height="2" width="20" x="6" y="28" />
				<rect height="2" width="12" x="10" y="30" />
			</g>
		</svg>
	);
}
