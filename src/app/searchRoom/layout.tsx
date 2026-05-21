import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Search Room',
	description: 'Find and join an active Casionopoly game room. Start your Board journey now!',
	openGraph: {
		title: 'Search Room | Casionopoly',
		description: 'Find and join an active Casionopoly game room. Start your Board journey now!',
		images: [{ url: '/app_icons/og-image-search.webp', width: 1200, height: 630, alt: 'Casionopoly Search Room' }],
	},
};

export default function SearchRoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
