import { Card, CardContent, CardTitle } from "./ui/8bit/card";

export default function Option({room_id}: {room_id: string}) {
	return (
		<Card>
			<CardTitle className="px-5 ">Option</CardTitle>
			<CardContent className="px-5 w-full h-full flex">
				<p className="w-full flex h-full">Room ID: {room_id}</p>
			</CardContent>
		</Card>
	);
}
