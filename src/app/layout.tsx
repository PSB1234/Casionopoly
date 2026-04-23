import Background from "@/components/background";
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
import { AudioProvider } from "@/components/provider/audio_provider";

export const metadata: Metadata = {
	title: "Industrial.io",
	description: "Monopoly like game",
	icons: [{ rel: "icon", url: "/app_icons/favicon.ico" }],
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
								<Navbar/>
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
