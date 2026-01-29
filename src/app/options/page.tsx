"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardTitle } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/8bit/select";
import { Switch } from "@/components/ui/8bit/switch";
import { toast } from "@/components/ui/8bit/toast";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { env } from "@/env";
import { generateColorPair } from "@/lib/random_color";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { OptionSchema, roomKeyDataSchema } from "@/lib/zod";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

const defaultValues: z.infer<typeof OptionSchema> = {
	allowChat: true,
	allowMortgagingProperties: true,
	allowPlayersToJoinMidGame: false,
	allowTrading: true,
	auctionProperties: true,
	autoRollDiceAfterTimeout: false,
	bankruptcyHandling: "strict",
	parkingMoneyAmount: false,
	gameEndsWhenOnlyOnePlayerRemains: false,
	numberOfPlayers: 4,
	passGoMoneyAmount: 200,
	speedUpGameMode: false,
	startingMoney: 1500,
	turnTimeLimit: "30",
};

export default function Options() {
	const router = useRouter();
	const { emitEvent } = useSocketStore();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof OptionSchema>>({
		resolver: zodResolver(OptionSchema),
		defaultValues,
	});

	async function onSubmit(values: z.infer<typeof OptionSchema>) {
		try {
			setIsLoading(true);
			const formattedValues = OptionSchema.safeParse(values);
			if (!formattedValues.success) {
				console.error("Validation errors:", formattedValues.error.errors);
				toast("Validation failed. Please check your inputs.", {
					description: undefined,
				});
				return;
			}
			const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/options`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formattedValues.data),
			});
			if (!response.ok) {
				toast("Network response was not ok", { description: undefined });
				setIsLoading(false);
				return;
			}
			toast("Form submitted successfully!", { description: undefined });
			toast("Form submitted successfully!", { description: undefined });
			setIsLoading(false);
			const { color, setColor } = useGameStore.getState();
			let finalColor = color;
			if (!finalColor) {
				const { original } = generateColorPair();
				finalColor = original;
				setColor(finalColor);
			}
			emitEvent(
				SOCKET_EVENTS.CREATE_ROOM,
				true,
				finalColor,
				(roomkey, player) => {
					const { success, data, error } = roomKeyDataSchema.safeParse(roomkey);
					if (error) {
						toast("Failed to create room. Please try again.", {
							description: undefined,
						});
						return;
					}
					if (success) {
						router.push(`/room/${data}`);
						router.refresh();
					}
				},
			);
			console.log("Form submission response:", response);
		} catch (error) {
			console.error("Form submission error", error);
			toast("Failed to submit the form. Please try again.", {
				description: undefined,
			});
		}
	}

	return (
		<div className="fixed inset-0 w-full p-4 md:p-6 lg:p-8">
			<Card className="mx-auto flex h-full max-w-4xl flex-col p-4 md:p-6 lg:p-8">
				<CardTitle className="mb-6 text-lg md:text-xl lg:text-2xl">
					Game Options
				</CardTitle>
				<form
					className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden p-5"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<section>
						<h3 className="mb-4 border-black border-b-4 pb-2 font-bold text-base md:text-lg lg:text-xl">
							Game Rules
						</h3>
						<FieldGroup>
							<Controller
								control={form.control}
								name="passGoMoneyAmount"
								render={({ field, fieldState }) => (
									<Field className="p-4" data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Pass Go Money Amount
										</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											id={field.name}
											onChange={(e) => field.onChange(Number(e.target.value))}
											placeholder="200"
										/>
										<FieldDescription>
											Set the amount of money to be given to players when they
											pass through start/go tile.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="parkingMoneyAmount"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												Parking Money Amount
											</FieldLabel>
											<FieldDescription>
												Set if player who landed on parking spot should get
												money.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="allowTrading"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												Allow Trading
											</FieldLabel>
											<FieldDescription>
												A trade is a transaction wherein a player may exchange
												owned assets with another player.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="allowMortgagingProperties"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												Allow Mortgaging Properties.
											</FieldLabel>
											<FieldDescription>
												Mortgaging a property is a way to get money when you're
												low on cash.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="auctionProperties"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												Allow Auctioning Properties.
											</FieldLabel>
											<FieldDescription>
												A process of buying and selling properties by offering
												them up for bids.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="speedUpGameMode"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												speedUpGameMode.
											</FieldLabel>
											<FieldDescription>
												Timers run out faster,Games last for shorter durations.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>
					<section>
						<h3 className="mb-4 border-black border-b-4 pb-2 font-bold text-base md:text-lg lg:text-xl">
							Player Settings
						</h3>
						<FieldGroup>
							<Controller
								control={form.control}
								name="numberOfPlayers"
								render={({ field, fieldState }) => (
									<Field className="p-4" data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Number of Players
										</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											id={field.name}
											max={8}
											min={2}
											onChange={(e) => field.onChange(Number(e.target.value))}
											placeholder="4"
										/>
										<FieldDescription>
											Total players allowed in the game.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="startingMoney"
								render={({ field, fieldState }) => (
									<Field className="p-4" data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Starting money.
										</FieldLabel>
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											id={field.name}
											onChange={(e) => field.onChange(Number(e.target.value))}
											placeholder="1500"
										/>
										<FieldDescription>
											Sets the amount of money each player starts with.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="allowPlayersToJoinMidGame"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												Allow Players To Join Mid-Game.
											</FieldLabel>
											<FieldDescription>
												Allow players to join the game after it has started.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>
					<section>
						<h3 className="mb-4 border-black border-b-4 pb-2 font-bold text-base md:text-lg lg:text-xl">
							Game Speed
						</h3>
						<FieldGroup>
							<Controller
								control={form.control}
								name="turnTimeLimit"
								render={({ field, fieldState }) => (
									<Field className="p-4" data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Turn Time Limit
										</FieldLabel>
										<Select
											name={field.name}
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger
												aria-invalid={fieldState.invalid}
												id={field.name}
											>
												<SelectValue placeholder="Select a turn time limit" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="30">30 seconds</SelectItem>
												<SelectItem value="60">60 seconds</SelectItem>
												<SelectItem value="unlimited">Unlimited</SelectItem>
											</SelectContent>
										</Select>
										<FieldDescription>
											Sets the maximum time allowed for a player's turn.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="autoRollDiceAfterTimeout"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												Auto Roll Dice After Timeout
											</FieldLabel>
											<FieldDescription>
												Automatically roll the dice if a player does not take
												their turn within the time limit.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>
					<section>
						<h3 className="mb-4 border-black border-b-4 pb-2 font-bold text-base md:text-lg lg:text-xl">
							Winning Condition
						</h3>
						<FieldGroup>
							<Controller
								control={form.control}
								name="gameEndsWhenOnlyOnePlayerRemains"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>
												Game Ends When Only One Player Remains
											</FieldLabel>
											<FieldDescription>
												The game ends when only one player remains.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="bankruptcyHandling"
								render={({ field, fieldState }) => (
									<Field className="p-4" data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Bankruptcy Handling
										</FieldLabel>
										<Select
											name={field.name}
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger
												aria-invalid={fieldState.invalid}
												id={field.name}
											>
												<SelectValue placeholder="strict" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="strict">Strict</SelectItem>
												<SelectItem value="forgiving">Forgiving</SelectItem>
											</SelectContent>
										</Select>
										<FieldDescription>
											Sets how bankruptcy is handled in the game.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>
					{/* Other Section */}
					<section>
						<h3 className="mb-4 border-black border-b-4 pb-2 font-bold text-base md:text-lg lg:text-xl">
							Other Settings
						</h3>
						<FieldGroup>
							<Controller
								control={form.control}
								name="allowChat"
								render={({ field, fieldState }) => (
									<Field
										className="flex flex-row p-4"
										data-invalid={fieldState.invalid}
									>
										<div className="space-y-0.5">
											<FieldLabel htmlFor={field.name}>Allow Chat</FieldLabel>
											<FieldDescription>
												Enable or disable chat functionality in the game.
											</FieldDescription>
										</div>
										<div className="flex justify-end">
											<Switch
												aria-invalid={fieldState.invalid}
												checked={field.value}
												id={field.name}
												name={field.name}
												onCheckedChange={field.onChange}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError>{fieldState.error?.message}</FieldError>
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>
					<Button className="w-full md:w-auto" type="submit">
						Submit
					</Button>
				</form>
			</Card>
		</div>
	);
}
