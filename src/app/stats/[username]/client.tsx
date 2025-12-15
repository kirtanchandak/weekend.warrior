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
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserStats(username);
    }
  }, [username]);

  const fetchUserStats = async (user: string) => {
    setScreen("loading");
    setError("");
    setIsDataReady(false);

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
      setIsDataReady(true);
      // Don't change screen here - let loading animation complete first
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.warn("Failed to fetch GitHub data:", errorMessage);
      setError(errorMessage);
      setScreen("error");
    }
  };

  const handleLoadingComplete = () => {
    // Only transition to stats screen if data is ready
    if (isDataReady && stats) {
      setScreen("stats");
    }
    // If data isn't ready yet, loading screen will keep showing
  };

  // When data becomes ready and we're still on loading screen, check if animation is done
  useEffect(() => {
    if (isDataReady && stats && screen === "loading") {
      // Data is ready, but we need to wait for loading animation
      // The LoadingScreen will call handleLoadingComplete when done
    }
  }, [isDataReady, stats, screen]);

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
        <LoadingScreen
          onComplete={handleLoadingComplete}
          isDataReady={isDataReady}
        />
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
