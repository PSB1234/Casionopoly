"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { toast } from "@/components/ui/8bit/toast";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { SOCKET_EVENTS } from "@/lib/socket_events";
import { useGameStore } from "@/store/game_store";
import { useSocketStore } from "@/store/socket_store";

const NameSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(20, "Name must be less than 20 characters"),
});

export default function ChangeName() {
	const username = useGameStore((state) => state.username);
	const setUsername = useGameStore((state) => state.setUsername);
	const emitEvent = useSocketStore((state) => state.emitEvent);

	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<z.infer<typeof NameSchema>>({
		resolver: zodResolver(NameSchema),
		defaultValues: {
			name: username || "",
		},
	});

	useEffect(() => {
		if (username) {
			form.reset({ name: username });
		}
	}, [username, form]);

	const onSubmit = useCallback(
		(values: z.infer<typeof NameSchema>) => {
			if (values.name === username) return;
			setIsSaving(true);

			emitEvent(
				SOCKET_EVENTS.CHANGE_NAME,
				values.name,
				(success: boolean, savedName: string) => {
					setIsSaving(false);
					if (success) {
						setUsername(savedName);
						toast("Name Updated", {
							description: `Your name is now ${savedName}`,
						});
					} else {
						toast("Error", { description: "Failed to update name" });
					}
				},
			);
		},
		[username, emitEvent, setUsername],
	);

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-col items-center text-center justify-center gap-2">
				<CardTitle>Change Name</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					className="flex flex-col gap-2"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<Controller
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Your Name</FieldLabel>
								<div className="flex w-full flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										className="flex-1 w-full"
										id={field.name}
										maxLength={20}
										placeholder="Enter new name"
									/>
									<Button
										className="w-full md:w-auto"
										disabled={
											isSaving ||
											!field.value.trim() ||
											field.value.trim() === username
										}
										type="submit"
									>
										Save
									</Button>
								</div>
								<FieldError errors={[fieldState.error]} />
							</Field>
						)}
					/>
				</form>
			</CardContent>
		</Card>
	);
}
