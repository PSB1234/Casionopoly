import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Game',
	description: 'Play Casionopoly, the multiplayer Board 8-bit game. Strategize, trade, and dominate the board.',
	openGraph: {
		title: 'Game | Casionopoly',
		description: 'Play Casionopoly, the multiplayer Board 8-bit game. Strategize, trade, and dominate the board.',
	},
};

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
