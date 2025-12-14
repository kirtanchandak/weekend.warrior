"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CRTOverlay } from "@/components/CRTOverlay";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatsScreen } from "@/components/StatsScreen";
import { ShareScreen } from "@/components/ShareScreen";
import { ErrorScreen } from "@/components/ErrorScreen";
import { WeekendStats, GameScreen } from "@/types/github";

interface UserStatsClientProps {
  username: string;
}

export default function UserStatsClient({ username }: UserStatsClientProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<GameScreen>("loading");
  const [stats, setStats] = useState<WeekendStats | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (username) {
      fetchUserStats(username);
    }
  }, [username]);

  const fetchUserStats = async (user: string) => {
    setScreen("loading");
    setError("");

    try {
      const response = await fetch("/api/github-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch GitHub stats");
      }

      const realStats = await response.json();
      setStats(realStats);
      setScreen("stats");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.warn("Failed to fetch GitHub data:", errorMessage);
      setError(errorMessage);
      setScreen("error");
    }
  };

  const handleLoadingComplete = () => {
    setScreen("stats");
  };

  const handleFinish = () => {
    setScreen("gameover");
  };

  const handlePlayAgain = () => {
    router.push("/");
  };

  const handleShowLeaderboard = () => {
    router.push("/leaderboard");
  };

  const handleRetry = () => {
    if (username) {
      fetchUserStats(username);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <CRTOverlay>
      {screen === "loading" && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {screen === "stats" && stats && (
        <StatsScreen stats={stats} onFinish={handleFinish} />
      )}

      {screen === "gameover" && stats && (
        <ShareScreen
          stats={stats}
          onPlayAgain={handlePlayAgain}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}

      {screen === "error" && (
        <ErrorScreen
          error={error}
          onRetry={handleRetry}
          onHome={handleBackToHome}
        />
      )}
    </CRTOverlay>
  );
}
