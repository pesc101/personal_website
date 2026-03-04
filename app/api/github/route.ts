import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

const GITHUB_USERNAME = "pesc101";

export async function GET() {
    try {
        const stats = await fetchGitHubStats(GITHUB_USERNAME);
        return NextResponse.json(stats);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
