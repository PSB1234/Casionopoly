import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { tag } = await request.json();

		if (!tag) {
			return NextResponse.json({ error: "Missing tag" }, { status: 400 });
		}

		// In Next 16 with useCache enabled, we need to pass the profile argument.
		// "max" or "minutes" are built-in profiles.
		revalidateTag(tag, "max");

		return NextResponse.json({ revalidated: true, now: Date.now() });
	} catch (_err) {
		return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
	}
}
