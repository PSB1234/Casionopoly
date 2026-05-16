"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/8bit/button";
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

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";
import { MUSIC_TRACKS, useMusicStore } from "@/store/music_store";

export default function MusicPage() {
	const router = useRouter();
	const {
		selectedTrackIndex,
		previewingIndex,
		setSelectedTrackIndex,
		setPreviewingIndex,
	} = useMusicStore();
	const previewAudioRef = useRef<HTMLAudioElement | null>(null);

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

	const handlePreview = useCallback(
		(index: number) => {
			if (previewingIndex === index) {
				if (previewAudioRef.current) {
					previewAudioRef.current.pause();
					previewAudioRef.current = null;
				}
				setPreviewingIndex(null);
				return;
			}

			if (previewAudioRef.current) {
				previewAudioRef.current.pause();
			}

			const track = MUSIC_TRACKS[index];
			if (!track) return;

			const audio = new Audio();
			audio.src = track.srcMp3;
			audio.volume = 0.8;
			audio.loop = false;
			previewAudioRef.current = audio;

			audio.play().then(() => {
				setPreviewingIndex(index);
			});

			audio.addEventListener("ended", () => {
				setPreviewingIndex(null);
				previewAudioRef.current = null;
			});
		},
		[previewingIndex, setPreviewingIndex],
	);

	const handleSelect = useCallback(
		(index: number) => {
			if (previewAudioRef.current) {
				previewAudioRef.current.pause();
				previewAudioRef.current = null;
			}
			setPreviewingIndex(null);
			setSelectedTrackIndex(index);
		},
		[setSelectedTrackIndex, setPreviewingIndex],
	);

	const handleBack = useCallback(() => {
		if (previewAudioRef.current) {
			previewAudioRef.current.pause();
			previewAudioRef.current = null;
		}
		setPreviewingIndex(null);
		router.push("/");
	}, [router, setPreviewingIndex]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
			<Card className="w-full max-w-4xl" font="retro">
				<CardHeader>
					<CardTitle className="text-center font-jaro text-3xl">Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<Tabs defaultValue="basic">
						<TabsList className="flex !h-auto w-full flex-wrap gap-1 bg-muted/50 p-1">
							<TabsTrigger className="font-jaro text-base md:text-lg !h-auto py-2" value="basic">
								Basic
							</TabsTrigger>
							<TabsTrigger className="font-jaro text-base md:text-lg !h-auto py-2" value="music">
								Music
							</TabsTrigger>
						</TabsList>
						
						<TabsContent value="basic" className="pt-6">
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
						</TabsContent>

						<TabsContent value="music" className="pt-6">
							<p className="text-center text-muted-foreground text-sm mb-4">
								Select default music for the game
							</p>

							<div className="space-y-2">
								{MUSIC_TRACKS.map((track, index) => (
									<div
										className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 rounded-lg p-3"
										key={track.id}
									>
										<div className="flex flex-col items-center md:items-start">
											<span className="font-medium text-center md:text-left">{track.name}</span>
											{track.artist && (
												<span className="text-muted-foreground text-xs text-center md:text-left">
													{track.artist}
												</span>
											)}
											{selectedTrackIndex === index && (
												<span className="text-xs text-yellow-500 mt-1">Default</span>
											)}
										</div>

										<div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
											<Button
												className="w-full md:w-auto"
												onClick={() => handlePreview(index)}
												size="sm"
												variant={previewingIndex === index ? "default" : "outline"}
											>
												{previewingIndex === index ? "Stop" : "Preview"}
											</Button>
											<Button
												className="w-full md:w-auto"
												disabled={previewingIndex === index}
												onClick={() => handleSelect(index)}
												size="sm"
												variant={
													selectedTrackIndex === index ? "default" : "outline"
												}
											>
												{selectedTrackIndex === index ? "Selected" : "Select"}
											</Button>
										</div>
									</div>
								))}
							</div>
						</TabsContent>
					</Tabs>

					<Button className="w-full" onClick={handleBack} variant="outline">
						Back to Home
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
