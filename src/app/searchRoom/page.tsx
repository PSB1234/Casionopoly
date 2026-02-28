import { SearchRoomClient } from "./components/search-room-client";

async function getPublicRooms() {
	"use cache";
	// The explicit type is needed because fetch returns any by default
	const res = await fetch("http://localhost:8080/api/rooms", {
		// Use cacheTag directly or fallback to passing the old Next.js tag config
		next: { tags: ["rooms"] },
	});

	if (!res.ok) {
		return [];
	}

	const json = await res.json();
	return json.data || [];
}

export default async function SearchPage() {
	const initialRooms = await getPublicRooms();

	return <SearchRoomClient initialRooms={initialRooms} />;
}
