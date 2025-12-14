import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github-api";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Validate username format (basic GitHub username validation)
    const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Invalid GitHub username format" },
        { status: 400 }
      );
    }

    const stats = await fetchGitHubStats(username);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GitHub API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Return appropriate status codes based on error type
    if (errorMessage.includes("not found")) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (errorMessage.includes("rate limit")) {
      return NextResponse.json(
        { error: "GitHub API rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    if (errorMessage.includes("token")) {
      return NextResponse.json(
        { error: "GitHub API configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
