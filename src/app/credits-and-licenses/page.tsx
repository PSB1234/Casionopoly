import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";

export default function CreditsLicensesPage() {
	return (
		<main className="flex min-h-screen flex-col items-center gap-12 px-4 pt-24 pb-12 text-white">
			<div className="w-full max-w-4xl">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="font-jaro text-3xl text-yellow-200">
							Credits & Licenses
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-center">
						<p className="text-lg text-muted-foreground leading-relaxed">
							Casionopoly was created by oshino and is highly inspired
							by the classic Board&reg; board game gameplay loop.
						</p>
						<h2 className="mt-6 font-jaro text-2xl text-yellow-200">
							Art & Assets
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Most of the aesthetic designs cover open source or public domain
							art and music are from pixelbay and itch.io.
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
