import z from "zod";

const createRoomSchema = z.object({
	roomName: z.string().min(3).max(20),
	type: z.enum(["public", "private"]),
	password: z.string().min(4).max(20).optional(),
});
const ChatSchema = z.object({
	message: z.string().nonempty({ message: "Message shouldn't be empty" }),
});
const roomKeyDataSchema = z.string();

export { createRoomSchema, roomKeyDataSchema, ChatSchema };
