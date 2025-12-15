"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Medal,
  Award,
  Users,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface LeaderboardEntry {
  _id?: string;
  username: string;
  totalWeekendCommits: number;
  saturdayCommits: number;
  sundayCommits: number;
  dedicationPercentage: number;
  longestStreak: number;
  achievementsUnlocked: number;
  lastUpdated: Date;
  rank?: number;
}

interface LeaderboardScreenProps {
  onBack: () => void;
  currentUser?: string;
}

export function LeaderboardScreen({
  onBack,
  currentUser,
}: LeaderboardScreenProps) {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leaderboard?limit=50");

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setError("Failed to load leaderboard");
      console.error("Leaderboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-arcade-yellow" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-xs font-pixel text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankClass = (rank: number, username: string) => {
    const isCurrentUser = username === currentUser;
    const baseClass =
      "flex items-center gap-2 sm:gap-4 p-2 sm:p-3 border-b border-foreground/20";

    if (isCurrentUser) {
      return `${baseClass} bg-arcade-cyan/20 border-arcade-cyan`;
    }

    switch (rank) {
      case 1:
        return `${baseClass} bg-arcade-yellow/10`;
      case 2:
        return `${baseClass} bg-gray-400/10`;
      case 3:
        return `${baseClass} bg-amber-600/10`;
      default:
        return baseClass;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <TrendingUp className="w-12 h-12 text-arcade-cyan mx-auto animate-pulse" />
          <p className="text-sm text-arcade-cyan">LOADING LEADERBOARD...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-sm text-arcade-red">{error}</p>
          <button onClick={loadLeaderboard} className="arcade-button text-sm">
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={onBack}
            className="arcade-button text-xs sm:text-sm flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">BACK</span>
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-pixel text-arcade-yellow">
              LEADERBOARD
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              2025 Weekend Warriors
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">
              {leaderboard.length} Players
            </span>
            <span className="sm:hidden">{leaderboard.length}</span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="pixel-border bg-card p-2 sm:p-4 text-center">
            <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-arcade-yellow mx-auto mb-1 sm:mb-2" />
            <div className="text-sm sm:text-lg font-pixel text-foreground">
              {leaderboard[0]?.totalWeekendCommits || 0}
            </div>
            <div className="text-[8px] sm:text-xs text-muted-foreground">
              TOP SCORE
            </div>
          </div>

          <div className="pixel-border bg-card p-2 sm:p-4 text-center">
            <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-arcade-cyan mx-auto mb-1 sm:mb-2" />
            <div className="text-sm sm:text-lg font-pixel text-foreground">
              {Math.round(
                leaderboard.reduce((sum, p) => sum + p.totalWeekendCommits, 0) /
                  leaderboard.length
              ) || 0}
            </div>
            <div className="text-[8px] sm:text-xs text-muted-foreground">
              AVERAGE
            </div>
          </div>

          <div className="pixel-border bg-card p-2 sm:p-4 text-center">
            <Users className="w-5 h-5 sm:w-8 sm:h-8 text-arcade-green mx-auto mb-1 sm:mb-2" />
            <div className="text-sm sm:text-lg font-pixel text-foreground">
              {leaderboard.length}
            </div>
            <div className="text-[8px] sm:text-xs text-muted-foreground">
              PLAYERS
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="pixel-border bg-card">
          <div className="p-2 sm:p-4 border-b border-foreground/20">
            <h2 className="text-sm sm:text-lg font-pixel text-arcade-cyan">
              TOP WEEKEND WARRIORS
            </h2>
          </div>

          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto custom-scrollbar">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No players yet. Be the first!</p>
              </div>
            ) : (
              leaderboard.map((player) => (
                <div
                  key={player.username}
                  className={`${getRankClass(
                    player.rank || 0,
                    player.username
                  )} cursor-pointer hover:bg-foreground/5 transition-colors`}
                  onClick={() =>
                    router.push(`/stats/${encodeURIComponent(player.username)}`)
                  }
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getRankIcon(player.rank || 0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-pixel text-xs sm:text-sm text-foreground truncate">
                        {player.username}
                        {player.username === currentUser && (
                          <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-arcade-cyan">
                            (YOU)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {player.achievementsUnlocked} achievements •{" "}
                        {player.dedicationPercentage}% dedication
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-pixel text-sm sm:text-lg text-arcade-yellow">
                      {player.totalWeekendCommits}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      commits
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 text-[10px] sm:text-xs text-muted-foreground px-2">
          <p>Rankings based on total weekend commits in 2025</p>
          <p className="mt-1">Updated in real-time</p>
        </div>
      </div>
    </div>
  );
}
