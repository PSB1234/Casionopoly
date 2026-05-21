import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Room',
	description: 'Join an Casionopoly game room. Wait for your friends to join and start trading and building your Board!',
	openGraph: {
		title: 'Room | Casionopoly',
		description: 'Join an Casionopoly game room. Wait for your friends to join and start trading and building your Board!',
		images: [{ url: '/app_icons/og-image.webp', width: 1200, height: 630, alt: 'Casionopoly Game Room' }],
	},
};

export default function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
