import { create } from "zustand";

// Store state
export type ChatStoreState = {
	messagesList: Array<{ messages: string; name: string }>;
};

// Store actions
export type ChatStoreActions = {
	setMessages: (messageObject: { messages: string; name: string }) => void;
	setHistory: (history: Array<{ message: string; username: string }>) => void;
};

export type ChatStore = ChatStoreState & ChatStoreActions;

// Frontend store
export const useChatStore = create<ChatStore>()((set, _get) => ({
	messagesList: [],
	setMessages: (message) =>
		set((state) => {
			const updated = [...state.messagesList, message];
			return {
				messagesList: updated.slice(-10),
			};
		}),
	setHistory: (history) =>
		set(() => ({
			messagesList: history.map((h) => ({
				messages: h.message,
				name: h.username,
			})).slice(-10),
		})),
}));
