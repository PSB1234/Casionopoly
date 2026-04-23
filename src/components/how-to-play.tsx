import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";

const gameRules = [
	{
		id: "objective",
		label: "Objective",
		content:
			"Become the wealthiest player by buying, trading, and developing properties. The last player remaining (not bankrupt) wins the game!",
	},
	
	{
		id: "movement",
		label: "Movement",
		content:
			"On your turn, roll dice. If you roll doubles, take another turn after completing your move. you can do all your stuff during your turn only",
	},
	{
		id: "properties",
		label: "Properties",
		content:
			"When you land on an unowned property, you must buy it at the listed price. Own all properties of a country group to start building hotels.",
	},
	{
		id: "rent",
		label: "Rent",
		content:
			"Landing on another player's property means you owe them rent. Rent increases when they own all properties of a country group, and increases further with houses and hotels built on them.",
	},
	{
		id: "jail",
		label: "Jail",
		content:
			"You go to Jail by landing on 'Go to Jail'. To get out: roll six or wait 3 turns.",
	},
	{
		id: "bankruptcy",
		label: "Bankruptcy",
		content:
			"If you owe more than you can pay, you are bankrupt and eliminated. Your assets go to the creditor. The last player remaining wins the game!",
	},
];

export default function HowToPlay() {
	return (
		<section className="mx-auto mt-16 w-full max-w-4xl px-4">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="font-jaro text-3xl text-yellow-200">
						How to Play
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs className="mt-6" defaultValue="objective">
						<TabsList className="flex h-auto w-full flex-wrap gap-1 bg-muted/50 p-1">
							{gameRules.map((rule) => (
								<TabsTrigger
									className="font-jaro text-md"
									key={rule.id}
									value={rule.id}
								>
									{rule.label}
								</TabsTrigger>
							))}
						</TabsList>

						{gameRules.map((rule) => (
							<TabsContent key={rule.id} value={rule.id}>
								<div className="flex flex-col items-center gap-8 border-border/50 pt-6 md:flex-row">
									<div className="flex-1 space-y-2 text-left">
										<h3 className="font-jaro text-2xl text-primary">
											{rule.label}
										</h3>
										<p className="text-lg text-muted-foreground leading-relaxed">
											{rule.content}
										</p>
									</div>
									<div className="flex h-48 w-full items-center justify-center border-2 border-muted-foreground border-dashed bg-muted/50 md:w-1/2">
										<span className="font-jaro text-muted-foreground tracking-wider">
											Image Placeholder
										</span>
									</div>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>
		</section>
	);
}
