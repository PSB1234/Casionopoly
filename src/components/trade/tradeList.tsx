import { Checkbox } from "@/components/ui/8bit/checkbox";
import { Input } from "@/components/ui/8bit/input";
import { Slider } from "@/components/ui/8bit/slider";
import { toast } from "@/components/ui/8bit/toast";
import { getNameOfPropertyById } from "@/lib/tiledata";
import type { Player } from "@/lib/type";
import { Card, CardContent, CardHeader } from "../ui/8bit/card";

export interface TradeData {
	amount: number;
	properties: number[];
}

export default function TradeList({
	player,
	data,
	onDataChange,
}: {
	player: Player;
	data: TradeData;
	onDataChange: (data: TradeData) => void;
}) {
	const ourProperties = player.properties ?? [];

	const handleAmountChange = (value: string, maxAmount: number) => {
		const numValue = parseInt(value, 10) || 0;
		if (numValue < 0) {
			toast("Invalid Amount", {
				description: "Amount cannot be negative.",
			});
			return;
		}

		if (numValue > maxAmount) {
			toast("Invalid Amount", {
				description: `Amount cannot exceed $${maxAmount}.`,
			});
			return;
		}

		onDataChange({ ...data, amount: numValue });
	};

	const handleSliderChange = (value: number[]) => {
		onDataChange({ ...data, amount: value[0] ?? 0 });
	};

	const handlePropertyChange = (property: number, checked: boolean) => {
		const newProperties = checked
			? [...data.properties, property]
			: data.properties.filter((p) => p !== property);
		onDataChange({ ...data, properties: newProperties });
	};

	return (
		<Card>
			<CardHeader>{player.username} Properties</CardHeader>
			<CardContent>
				<ul className="my-2">
				<li className="my-2">
					<p>Amount:</p>
					<div className="mb-3">
						<Input
							disabled={player.money <= 0}
							onChange={(e) => handleAmountChange(e.target.value, player.money)}
							placeholder="Select the Amount"
							type="number"
							value={data.amount}
						/>
					</div>
					<Slider
						className="mb-3"
						disabled={player.money <= 0}
						max={player.money}
						min={0}
						onValueChange={handleSliderChange}
						value={[data.amount]}
					/>
				</li>
				{ourProperties.map((property) => (
					<li
						className="my-2 flex w-full flex-row items-center justify-start gap-4 text-left"
						key={property.id}
					>
						<Checkbox
							checked={data.properties.includes(property.id)}
							onCheckedChange={(checked) =>
								handlePropertyChange(property.id, checked === true)
							}
						/>
						<p className="flex-1 break-words">{getNameOfPropertyById(property.id)}</p>
					</li>
				))}
			</ul>
			</CardContent>
		</Card>
	);
}
