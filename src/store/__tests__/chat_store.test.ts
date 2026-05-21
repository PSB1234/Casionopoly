import { beforeEach, describe, expect, it } from "vitest";
import { useChatStore } from "@/store/chat_store";

describe("useChatStore", () => {
	beforeEach(() => {
		useChatStore.setState({ messagesList: [] });
	});

	it("initial messagesList is empty", () => {
		expect(useChatStore.getState().messagesList).toEqual([]);
	});

	it("setMessages adds a message", () => {
		useChatStore.getState().setMessages({ messages: "hello", name: "Alice" });
		expect(useChatStore.getState().messagesList).toHaveLength(1);
		expect(useChatStore.getState().messagesList[0]).toEqual({
			messages: "hello",
			name: "Alice",
		});
	});

	it("setMessages caps at 8 messages", () => {
		const store = useChatStore.getState();
		for (let i = 0; i < 10; i++) {
			store.setMessages({ messages: `msg${i}`, name: "User" });
		}
		const list = useChatStore.getState().messagesList;
		expect(list).toHaveLength(8);
		// Should keep the last 8 (msg2..msg9)
		expect(list[0]?.messages).toBe("msg2");
		expect(list[7]?.messages).toBe("msg9");
	});

	it("setHistory loads and maps field names", () => {
		useChatStore.getState().setHistory([
			{ message: "hi", username: "Bob" },
			{ message: "hey", username: "Eve" },
		]);
		const list = useChatStore.getState().messagesList;
		expect(list).toHaveLength(2);
		expect(list[0]).toEqual({ messages: "hi", name: "Bob" });
		expect(list[1]).toEqual({ messages: "hey", name: "Eve" });
	});
});
