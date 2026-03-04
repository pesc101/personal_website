import { NextResponse } from "next/server";
import { fetchScholarStats } from "@/lib/google-scholar";

// Replace with your own Google Scholar user ID
const SCHOLAR_USER_ID = "ZOV6IUEAAAAJ";

export async function GET() {
    try {
        const stats = await fetchScholarStats(SCHOLAR_USER_ID);
        return NextResponse.json(stats);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
