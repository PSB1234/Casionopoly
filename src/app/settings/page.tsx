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
				{" "}
				<CardHeader>
					<CardTitle className="text-center">Basic</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
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
									<div className="flex w-full gap-6 justify-center items-center flex-row">
										<Input
											{...field}
											aria-invalid={fieldState.invalid}
											className="flex-1"
											id={field.name}
											maxLength={20}
											placeholder="Enter new name"
										/>
										<Button
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
			<Card className="w-full max-w-4xl" font="retro">
				<CardHeader>
					<CardTitle className="text-center">MUSIC</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-center text-muted-foreground text-sm">
						Select default music for the game
					</p>

					<div>
						{MUSIC_TRACKS.map((track, index) => (
							<div
								className="flex items-center justify-between rounded-lg p-3"
								key={track.id}
							>
								<div className="flex flex-col">
									<span className="font-medium">{track.name}</span>
									{track.artist && (
										<span className="text-muted-foreground text-xs">
											{track.artist}
										</span>
									)}
									{selectedTrackIndex === index && (
										<span className="text-xs text-yellow-500">Default</span>
									)}
								</div>

								<div className="flex gap-6">
									<Button
										onClick={() => handlePreview(index)}
										size="sm"
										variant={previewingIndex === index ? "default" : "outline"}
									>
										{previewingIndex === index ? "Stop" : "Preview"}
									</Button>
									<Button
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

					<Button className="w-full" onClick={handleBack} variant="outline">
						Back to Home
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
