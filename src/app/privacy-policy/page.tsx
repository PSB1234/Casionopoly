import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";

export default function PrivacyPolicyPage() {
	return (
		<main className="flex min-h-screen flex-col items-center gap-12 px-4 pt-24 pb-12 text-white">
			<div className="w-full max-w-4xl">
				<Card className="border-4 border-foreground bg-card/90">
					<CardHeader className="text-center">
						<CardTitle className="font-jaro text-3xl text-yellow-200">
							Privacy Policy
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-center">
						<p className="text-lg text-muted-foreground leading-relaxed">
							Welcome to Casionopoly. This Privacy Policy explains how we
							collect, use, and protect your information when you use our
							website.
						</p>
						<h2 className="mt-6 font-jaro text-2xl text-yellow-200">
							Information we collect
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							We do not collect any personal information when you play
							casionopoly. Any game state is temporarily handled via sessions
							or web sockets.
						</p>
						<h2 className="mt-6 font-jaro text-2xl text-yellow-200">Cookies</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							We may use local storage/cookies to save your basic preferences to
							improve your gameplay experience.
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
