import Background from "@/components/background/background";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import LoadingProvider from "@/components/provider/loading_provider";
import QueryProvider from "@/components/provider/query_provider";
import SocketInit from "@/components/provider/socket_provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Jaro } from "next/font/google";
import localFont from "next/font/local";
import BackgroundMusic from "@/components/music/background-music";
import { AudioProvider } from "@/components/provider/audio_provider";

export const metadata: Metadata = {
	metadataBase: new URL("https://casionopoly.me"),
	title: {
		default: "Casionopoly | The Ultimate 8-Bit Board Game Experience",
		template: "%s | Casionopoly",
	},
	description: "Dive into Casionopoly, a multiplayer board game with a retro 8-bit aesthetic. Trade, build, and conquer the board with your friends!",
	keywords: ["monopoly", "board game", "multiplayer", "8-bit", "retro", "trading", "property game", "Casionopoly","casionopoly.me"],
	authors: [{ name: "Oshino" }],
	creator: "Oshino Team",
	publisher: "Oshino",
	icons: [
		{ rel: "icon", url: "/app_icons/favicon.ico" },
		{ rel: "apple-touch-icon", url: "/app_icons/apple-touch-icon.png" }
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://casionopoly.me",
		title: "Casionopoly | The Ultimate 8-Bit Board Experience",
		description: "Dive into Casionopoly, a multiplayer Board game with a retro 8-bit aesthetic. Trade, build, and conquer the board with your friends!",
		siteName: "casionopoly",
		images: [
			{
				url: "/app_icons/og-image.webp",
				width: 1200,
				height: 630,
				alt: "Casionopoly Gameplay",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Casionopoly | The Ultimate 8-Bit Board Experience",
		description: "Dive into Casionopoly, a multiplayer Board game with a retro 8-bit aesthetic. Trade, build, and conquer the board with your friends!",
		images: ["/app_icons/og-image.webp"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});
const jaro = Jaro({
	subsets: ["latin"],
	variable: "--font-jaro",
});
const vt323 = localFont({
	src: "../../public/font/vt323/VT323-Regular.ttf",
	variable: "--font-vt323",
});
export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={`${geist.variable} ${jaro.variable} ${vt323.variable} bg-[#281E50]`}
			lang="en"
		>
			<body>
				<AudioProvider>
					<QueryProvider>
						<SocketInit>
							<LoadingProvider>
								<Navbar />
								<BackgroundMusic delayMs={1 * 1000} />
								<Background />
								{children}
								<Footer />
								<Toaster />
							</LoadingProvider>
						</SocketInit>
					</QueryProvider>
				</AudioProvider>
			</body>
		</html>
	);
}
