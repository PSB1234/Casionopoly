"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/8bit/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/8bit/dialog";
import { Input } from "@/components/ui/8bit/input";
import { toast } from "@/components/ui/8bit/toast";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";
import { generateColorPair } from "@/lib/random_color";
import { generatePassword } from "@/lib/random_password_generator";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { cn } from "@/lib/utils";
import { createRoomSchema, roomKeyDataSchema } from "@/lib/zod";
import { useGameStore } from "@/store/game_store";
import useSocketStore from "@/store/socket_store";

export default function CreateMenu({
	optionsOpen,
	setOptionsOpenAction,
}: {
	optionsOpen: boolean;
	setOptionsOpenAction: (open: boolean) => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const { emitEvent } = useSocketStore();
	const router = useRouter();
	const defaultValues: z.infer<typeof createRoomSchema> = {
		roomName: "",
		type: "public",
		password: "",
	};
	const form = useForm<z.infer<typeof createRoomSchema>>({
		resolver: zodResolver(createRoomSchema),
		defaultValues,
	});

	const roomType = form.watch("type");

	useEffect(() => {
		if (roomType === "private") {
			form.register("password");
		} else {
			form.unregister("password");
		}
	}, [roomType, form]);

	async function onSubmit(values: z.infer<typeof createRoomSchema>) {
		try {
			setIsLoading(true);

			const formattedValues = createRoomSchema.safeParse(values);
			if (!formattedValues.success) {
				setIsLoading(false);
				console.error("Validation errors:", formattedValues.error.issues);
				toast("Validation failed. Please check your inputs.", {
					description: undefined,
				});
				return;
			}
			if (
				formattedValues.data.type === "private" &&
				!formattedValues.data.password
			) {
				setIsLoading(false);
				toast("Password is required for private rooms.", {
					description: undefined,
				});
				return;
			}
			toast("Creating room...", { description: undefined });
			const { color, setColor } = useGameStore.getState();
			let finalColor = color;
			if (!finalColor) {
				const { original } = generateColorPair();
				finalColor = original;
				setColor(finalColor);
			}
			emitEvent(
				SOCKET_EVENTS.CREATE_ROOM,
				formattedValues.data,
				finalColor,
				(roomkey, _player) => {
					setIsLoading(false);
					const { success, data, error } = roomKeyDataSchema.safeParse(roomkey);
					if (error) {
						toast("Failed to create room. Please try again.", {
							description: undefined,
						});
						return;
					}
					if (success) {
						setOptionsOpenAction(false);
						useGameStore.getState().setIsNavigating(true);
						router.push(`/room/${data}`);
						router.refresh();
					}
				},
			);
		} catch (error) {
			setIsLoading(false);
			console.error("Form submission error", error);
			toast("Failed to submit the form. Please try again.", {
				description: undefined,
			});
		}
	}
	return (
		<Dialog onOpenChange={setOptionsOpenAction} open={optionsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Room</DialogTitle>
					<DialogDescription>Write Details For The Room.</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden p-3"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FieldGroup>
						<Field
							className="p-4"
							data-invalid={!!form.formState.errors.roomName}
						>
							<FieldLabel htmlFor="roomName">Game Name</FieldLabel>
							<Input
								{...form.register("roomName")}
								aria-invalid={!!form.formState.errors.roomName}
								id="roomName"
								placeholder="Board Game"
							/>
							<FieldDescription>
								Write a name for your game session.
							</FieldDescription>
							{form.formState.errors.roomName && (
								<FieldError>
									{form.formState.errors.roomName.message}
								</FieldError>
							)}
						</Field>

						<Controller
							control={form.control}
							name="type"
							render={({ field, fieldState }) => (
								<Field
									className="flex w-full px-4"
									data-invalid={fieldState.invalid}
								>
									<FieldLabel htmlFor={field.name}>Choose Room Type</FieldLabel>
									<Tabs
										className="w-full mt-2"
										onValueChange={field.onChange}
										value={field.value}
									>
										<TabsList className="flex w-full bg-card p-1">
											<TabsTrigger className="flex-1 font-jaro text-lg" value="public">
												Public
											</TabsTrigger>
											<TabsTrigger className="flex-1 font-jaro text-lg" value="private">
												Private
											</TabsTrigger>
										</TabsList>
									</Tabs>
									{fieldState.invalid && (
										<FieldError>{fieldState.error?.message}</FieldError>
									)}
								</Field>
							)}
						/>
						{roomType === "private" && (
							<Field
								className="p-4"
								data-invalid={!!form.formState.errors.password}
							>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<div className="flex w-full flex-row items-center justify-between gap-2">
									<Input
										{...form.register("password")}
										aria-invalid={!!form.formState.errors.password}
										disabled={isLoading}
										id="password"
										placeholder="Enter password"
									/>
									<Button
										className="m-2"
										disabled={isLoading}
										onClick={() =>
											form.setValue("password", generatePassword())
										}
										type="button"
									>
										<Image
											alt="random button"
											height={30}
											src="/icons/dice-random.svg"
											width={30}
										/>
									</Button>
								</div>
								<FieldDescription>
									Set a password for the room.
								</FieldDescription>
								{form.formState.errors.password && (
									<FieldError>
										{form.formState.errors.password.message}
									</FieldError>
								)}
							</Field>
						)}
					</FieldGroup>
				</form>
				<DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
					<Button className="w-full sm:w-auto" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
						{isLoading ? "Creating..." : "Create"}
					</Button>
					<Button
						className="w-full sm:w-auto"
						disabled={isLoading}
						onClick={() => setOptionsOpenAction(false)}
						variant="outline"
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
