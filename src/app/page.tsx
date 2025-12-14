"use client";

import { useRouter } from "next/navigation";
import { CRTOverlay } from "@/components/CRTOverlay";
import { TitleScreen } from "@/components/TitleScreen";

export default function Home() {
  const router = useRouter();

  const handleStart = async (username: string) => {
    // Navigate to the user's stats page
    router.push(`/stats/${encodeURIComponent(username)}`);
  };

  const handleShowLeaderboard = () => {
    // Navigate to the leaderboard page
    router.push("/leaderboard");
  };

  return (
    <CRTOverlay>
      <TitleScreen
        onStart={handleStart}
        onShowLeaderboard={handleShowLeaderboard}
      />
    </CRTOverlay>
  );
}
