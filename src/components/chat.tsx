import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/8bit/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Field } from "@/components/ui/field";
import { SOCKET_EVENTS } from "@/lib/socket_events";
import { ChatSchema } from "@/lib/zod";
import { useChatStore } from "@/store/chat_store";
import useSocketStore from "@/store/socket_store";
import Message from "./message";
import { ScrollArea } from "./ui/8bit/scroll-area";

export default function Chat() {
	const { socket, emitEvent } = useSocketStore();
	const [message, setMessage] = useState<string>("");
	const { game_id } = useParams<{ game_id: string }>();
	const { setMessages, setHistory } = useChatStore();
	const messages = useChatStore((state) => state.messagesList);


	const form = useForm<z.infer<typeof ChatSchema>>({
		resolver: zodResolver(ChatSchema),
		defaultValues: {
			message: "",
		},
	});
	// Set up socket listener only once
	useEffect(() => {
		if (!socket) return;
		const handleReceiveMessage = (message: string, username: string) => {
			setMessages({ messages: message, name: username });
		};
		const handleChatHistory = (
			history: Array<{ message: string; username: string }>,
		) => {
			setHistory(history);
		};
		socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
		socket.on(SOCKET_EVENTS.CHAT_HISTORY, handleChatHistory);
		// Cleanup: remove listener when component unmounts
		return () => {
			socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
			socket.off(SOCKET_EVENTS.CHAT_HISTORY, handleChatHistory);
		};
	}, [socket, setMessages, setHistory]); // Add dependencies
	// Send message when state changes
	useEffect(() => {
		if (message && game_id) {
			emitEvent(SOCKET_EVENTS.SEND_MESSAGE, message, game_id);
		}
	}, [message, game_id, emitEvent]);
	function onSubmit(values: z.infer<typeof ChatSchema>) {
		setMessage(values.message);
		form.reset(); // Reset form after submission
	}
	return (
		<Card className="flex h-full min-h-0 flex-col lg:flex-1">
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<CardTitle>Chat</CardTitle>
				
			</CardHeader>
			<CardContent className="flex min-h-0 flex-1 flex-col">
				<Card className="flex min-h-0 flex-1 flex-col">
					<CardContent className="flex min-h-0 flex-1 flex-col">
						<ScrollArea className="flex-1 w-full h-full min-h-48 lg:min-h-0">
							{messages.map((msg, index) => (
								<Message
									key={`${msg}${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										index
									}`}
									message={msg.messages}
									name={msg.name}
								/>
							))}
						</ScrollArea>
					</CardContent>
				</Card>
			</CardContent>
			<CardFooter>
				<form
					className="flex w-full flex-col gap-3 "
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<Controller
						control={form.control}
						name="message"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<Input
									{...field}
									aria-invalid={fieldState.invalid}
									id={field.name}
									placeholder="hello"
								/>
							</Field>
						)}
					/>
					<Button size="sm" type="submit">
						Submit
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
}
