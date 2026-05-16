import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Room',
	description: 'Join an Industrial.io game room. Wait for your friends to join and start trading and building your Board!',
	openGraph: {
		title: 'Room | Industrial.io',
		description: 'Join an Industrial.io game room. Wait for your friends to join and start trading and building your Board!',
	},
};

export default function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
