import { env } from "@/env";
import { SearchRoomClient } from "./components/search-room-client";

async function getPublicRooms() {
	"use cache";
	try {
		// The explicit type is needed because fetch returns any by default
		const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/rooms`, {
			// Use cacheTag directly or fallback to passing the old Next.js tag config
			next: { tags: ["rooms"] },
		});

		if (!res.ok) {
			return [];
		}

		const json = await res.json();
		return json.data || [];
	} catch (error) {
		console.error("Failed to fetch public rooms during build/render:", error);
		return [];
	}
}

export default async function SearchPage() {
	const initialRooms = await getPublicRooms();

	return <SearchRoomClient initialRooms={initialRooms} />;
}
