import Background from "@/components/background";
import QueryProvider from "@/components/provider/query_provider";
import SocketInit from "@/components/provider/socket_provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist, Jaro } from "next/font/google";

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
export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable}${jaro.variable} `} lang="en">
			<body>
				<QueryProvider>
					<SocketInit>
						<Background />
						{children}
						<Toaster />
					</SocketInit>
				</QueryProvider>
			</body>
		</html>
	);
}
