import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Game',
	description: 'Play casionopoly, the multiplayer Board 8-bit game. Strategize, trade, and dominate the board.',
	openGraph: {
		title: 'Game | casionopoly',
		description: 'Play casionopoly, the multiplayer Board 8-bit game. Strategize, trade, and dominate the board.',
	},
};

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
