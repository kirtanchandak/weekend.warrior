import Link from "next/link";
import { CRTOverlay } from "@/components/CRTOverlay";
import { Home, Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <CRTOverlay>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md">
          {/* 404 Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-pixel text-arcade-red rgb-split">
              404
            </h1>
            <h2 className="text-xl font-pixel text-arcade-yellow">GAME OVER</h2>
            <p className="text-sm text-muted-foreground">
              This page doesn&apos;t exist in our arcade!
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-4">
            <Link
              href="/"
              className="arcade-button w-full flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              MAIN MENU
            </Link>

            <Link
              href="/leaderboard"
              className="arcade-button w-full flex items-center justify-center gap-2 bg-muted"
            >
              <Trophy className="w-4 h-4" />
              LEADERBOARD
            </Link>
          </div>

          {/* Retro Message */}
          <p className="text-xs text-arcade-cyan blink">
            INSERT COIN TO CONTINUE
          </p>
        </div>
      </div>
    </CRTOverlay>
  );
}
