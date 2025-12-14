import { WeekendStats } from "@/types/github";
import { ROAST_MESSAGES } from "@/data/mockData";
import { Share2, RefreshCw, Twitter, Trophy } from "lucide-react";

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
  const roastLevel = getRoastLevel(stats.totalWeekendCommits);
  const message =
    ROAST_MESSAGES[roastLevel][
      Math.floor(Math.random() * ROAST_MESSAGES[roastLevel].length)
    ];
  const isHighScore = stats.totalWeekendCommits >= 200;
  const unlockedBadges = stats.achievements.filter((a) => a.unlocked);

  const shareText = `🎮 Weekend Warrior 2025

@${stats.username}'s Weekend Stats:
📊 Score: ${stats.totalWeekendCommits} commits
🔥 Dedication: ${stats.dedicationPercentage}%
🏆 Top ${stats.percentile}% of devs

${message}

View stats: ${window.location.origin}/stats/${encodeURIComponent(
    stats.username
  )}
Leaderboard: ${window.location.origin}/leaderboard`;

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

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
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

        {/* Score Card */}
        <div className="pixel-border bg-card p-6 md:p-8 space-y-6">
          <p className="text-xs md:text-sm font-pixel text-muted-foreground">
            FINAL SCORE
          </p>
          <div className="pixel-border bg-background p-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-arcade-yellow blink">⭐</span>
              <span className="text-4xl md:text-6xl font-pixel text-arcade-cyan">
                {stats.totalWeekendCommits}
              </span>
              <span className="text-arcade-yellow blink">⭐</span>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm md:text-base font-pixel">
            <div className="text-left">
              <span className="text-muted-foreground">SAT:</span>{" "}
              <span className="text-arcade-red">{stats.saturdayCommits}</span>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">SUN:</span>{" "}
              <span className="text-arcade-orange">{stats.sundayCommits}</span>
            </div>
          </div>

          {/* Rank */}
          <div className="pt-4 border-t-2 border-foreground/20">
            <p className="text-sm md:text-base font-pixel text-arcade-green">
              🏆 TOP {stats.percentile}% OF DEVELOPERS
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
          <p className="text-xs md:text-sm font-pixel text-arcade-cyan">
            "{message}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleTwitterShare}
              className="arcade-button flex items-center justify-center gap-2 text-xs md:text-sm font-pixel"
            >
              <Twitter className="w-4 h-4" />
              SHARE
            </button>

            <button
              onClick={handleShare}
              className="arcade-button flex items-center justify-center gap-2 bg-arcade-cyan text-xs md:text-sm font-pixel"
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
