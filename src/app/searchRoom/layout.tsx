import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Search Room',
	description: 'Find and join an active Industrial.io game room. Start your Board journey now!',
	openGraph: {
		title: 'Search Room | Industrial.io',
		description: 'Find and join an active Industrial.io game room. Start your Board journey now!',
	},
};

export default function SearchRoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
