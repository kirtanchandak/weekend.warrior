"use client";

import { WeekendStats } from "@/types/github";
import { ROAST_MESSAGES } from "@/data/mockData";
import { Share2, RefreshCw, X, Trophy, Download } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ShareScreenProps {
  stats: WeekendStats;
  onPlayAgain: () => void;
  onShowLeaderboard?: () => void;
}

function getRoastLevel(commits: number): keyof typeof ROAST_MESSAGES {
  if (commits < 50) return "low";
  if (commits < 200) return "medium";
  if (commits < 500) return "high";
  return "extreme";
}

export function ShareScreen({
  stats,
  onPlayAgain,
  onShowLeaderboard,
}: ShareScreenProps) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [shareText, setShareText] = useState("");
  const roastLevel = getRoastLevel(stats.totalWeekendCommits);

  // Use a deterministic message based on username to avoid hydration mismatch
  const messageIndex =
    stats.username.charCodeAt(0) % ROAST_MESSAGES[roastLevel].length;
  const message = ROAST_MESSAGES[roastLevel][messageIndex];

  const isHighScore = stats.totalWeekendCommits >= 200;
  const unlockedBadges = stats.achievements.filter((a) => a.unlocked);

  // Generate share text on client side only to avoid hydration mismatch
  useEffect(() => {
    const text = `🎮 Weekend Warrior 2025

@${stats.username}'s Weekend Stats:
📊 Score: ${stats.totalWeekendCommits} commits
🔥 Dedication: ${stats.dedicationPercentage}%
🏆 Top ${stats.percentile}% of devs

${message}

View stats: ${window.location.origin}/stats/${encodeURIComponent(
      stats.username
    )}
Leaderboard: ${window.location.origin}/leaderboard`;
    setShareText(text);
  }, [stats, message]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Weekend Warrior",
        text: shareText,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  const handleTwitterShare = async () => {
    // Try to download and share the image
    try {
      await handleDownloadImage();
      // Open Twitter with text
      const tweetText = encodeURIComponent(shareText);
      window.open(
        `https://twitter.com/intent/tweet?text=${tweetText}`,
        "_blank"
      );
    } catch {
      // Fallback to just text
      const tweetText = encodeURIComponent(shareText);
      window.open(
        `https://twitter.com/intent/tweet?text=${tweetText}`,
        "_blank"
      );
    }
  };

  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
        logging: false,
        useCORS: false, // Images are now from same origin via proxy
        allowTaint: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `weekend-warrior-${stats.username}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Failed to generate image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Victory/Game Over Header */}
        <div
          className={`text-4xl md:text-5xl font-pixel ${
            isHighScore ? "text-arcade-yellow" : "text-arcade-red"
          } rgb-split blink`}
        >
          {isHighScore ? "YOU WIN!" : "GAME OVER"}
        </div>

        {/* Score Card - Shareable */}
        <div
          ref={shareCardRef}
          className="pixel-border bg-card p-6 md:p-8 space-y-6"
        >
          {/* User Header with Avatar */}
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="relative flex-shrink-0">
              <div className="pixel-border p-1 bg-background">
                <div className="w-14 h-14 md:w-20 md:h-20 overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={`/api/avatar?username=${stats.username}`}
                    alt={stats.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl md:text-2xl font-pixel text-arcade-cyan">${stats.username[0].toUpperCase()}</div>`;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-[10px] md:text-sm font-pixel text-muted-foreground">
                PLAYER
              </p>
              <h2 className="text-base md:text-2xl font-pixel text-arcade-cyan truncate">
                @{stats.username}
              </h2>
            </div>
          </div>

          <p className="text-[10px] md:text-sm font-pixel text-muted-foreground text-center">
            FINAL SCORE
          </p>
          <div className="pixel-border bg-background p-4 md:p-6">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <span className="text-arcade-yellow blink text-xl md:text-2xl">
                ⭐
              </span>
              <span className="text-3xl md:text-6xl font-pixel text-arcade-cyan">
                {stats.totalWeekendCommits}
              </span>
              <span className="text-arcade-yellow blink text-xl md:text-2xl">
                ⭐
              </span>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 text-sm md:text-base font-pixel">
            <div className="text-center">
              <p className="text-[8px] md:text-xs text-muted-foreground">SAT</p>
              <p className="text-arcade-red text-base md:text-xl">
                {stats.saturdayCommits}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] md:text-xs text-muted-foreground">SUN</p>
              <p className="text-arcade-orange text-base md:text-xl">
                {stats.sundayCommits}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] md:text-xs text-muted-foreground">
                STREAK
              </p>
              <p className="text-arcade-yellow text-base md:text-xl">
                {stats.longestStreak}
              </p>
            </div>
          </div>

          {/* Rank */}
          <div className="pt-3 md:pt-4 border-t-2 border-foreground/20">
            <p className="text-xs md:text-base font-pixel text-arcade-green">
              🏆 RANK #{stats.globalRank.toLocaleString()} • TOP{" "}
              {stats.percentile}%
            </p>
          </div>

          {/* Top Achievement */}
          {unlockedBadges.length > 0 && (
            <div className="pt-4 border-t-2 border-foreground/20">
              <p className="text-xs md:text-sm font-pixel text-muted-foreground mb-2">
                TOP ACHIEVEMENT
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl md:text-3xl">
                  {unlockedBadges[0].icon}
                </span>
                <span className="text-sm md:text-base font-pixel text-arcade-yellow">
                  {unlockedBadges[0].name}
                </span>
              </div>
            </div>
          )}

          {/* Roast Message */}
          <p className="text-xs md:text-sm font-pixel text-arcade-cyan text-center">
            &quot;{message}&quot;
          </p>

          {/* Branding */}
          <div className="pt-4 border-t-2 border-foreground/20">
            <p className="text-[10px] md:text-xs font-pixel text-muted-foreground text-center">
              WEEKEND WARRIOR • 2025
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleDownloadImage}
              className="arcade-button flex items-center justify-center gap-1 text-xs font-pixel"
            >
              <Download className="w-4 h-4" />
              SAVE
            </button>

            <button
              onClick={handleTwitterShare}
              className="arcade-button flex items-center justify-center gap-1 text-xs font-pixel"
            >
              <X className="w-4 h-4" />
              POST
            </button>

            <button
              onClick={handleShare}
              className="arcade-button flex items-center justify-center gap-1 bg-arcade-cyan text-xs font-pixel"
            >
              <Share2 className="w-4 h-4" />
              COPY
            </button>
          </div>

          {/* Leaderboard Button */}
          {onShowLeaderboard && (
            <button
              onClick={onShowLeaderboard}
              className="arcade-button w-full flex items-center justify-center gap-2 bg-arcade-yellow text-background text-sm md:text-base font-pixel"
            >
              <Trophy className="w-4 h-4" />
              VIEW LEADERBOARD
            </button>
          )}

          {/* Play Again Button */}
          <button
            onClick={onPlayAgain}
            className="arcade-button w-full flex items-center justify-center gap-2 bg-arcade-green text-sm md:text-base font-pixel"
          >
            <RefreshCw className="w-4 h-4" />
            PLAY AGAIN
          </button>
        </div>

        {/* Credits */}
        <p className="text-[10px] md:text-xs font-pixel text-muted-foreground">
          weekendwarrior.dev • 2025
        </p>
      </div>
    </div>
  );
}
