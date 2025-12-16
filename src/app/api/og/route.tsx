import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "User";
    const commits = searchParams.get("commits") || "0";
    const dedication = searchParams.get("dedication") || "0";
    const rank = searchParams.get("rank") || "1";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "40px",
          }}
        >
          {/* Border */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "8px solid #00ff00",
              borderRadius: "0",
              padding: "60px",
              backgroundColor: "#0a0a0a",
              boxShadow: "0 0 40px rgba(0, 255, 0, 0.3)",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 48,
                fontWeight: "bold",
                color: "#ffff00",
                marginBottom: "20px",
                textShadow: "4px 4px 0px #ff0000, 8px 8px 0px #00ffff",
                letterSpacing: "4px",
              }}
            >
              WEEKEND WARRIOR
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: 64,
                fontWeight: "bold",
                color: "#00ffff",
                marginBottom: "40px",
                letterSpacing: "2px",
              }}
            >
              @{username}
            </div>

            {/* Stats Grid */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginBottom: "40px",
              }}
            >
              {/* Commits */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "4px solid #00ff00",
                  padding: "30px 40px",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    color: "#888",
                    marginBottom: "10px",
                  }}
                >
                  COMMITS
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: "bold",
                    color: "#ffff00",
                  }}
                >
                  {commits}
                </div>
              </div>

              {/* Dedication */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "4px solid #00ff00",
                  padding: "30px 40px",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    color: "#888",
                    marginBottom: "10px",
                  }}
                >
                  DEDICATION
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: "bold",
                    color: "#ff6b00",
                  }}
                >
                  {dedication}%
                </div>
              </div>
            </div>

            {/* Rank */}
            <div
              style={{
                fontSize: 32,
                color: "#00ff00",
                marginTop: "20px",
              }}
            >
              🏆 RANK #{rank}
            </div>

            {/* Footer */}
            <div
              style={{
                fontSize: 20,
                color: "#666",
                marginTop: "40px",
                letterSpacing: "2px",
              }}
            >
              WEEKENDWARRIOR.DEV • 2025
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Error generating OG image:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
