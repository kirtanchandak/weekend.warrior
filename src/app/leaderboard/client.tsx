"use client";

import { useRouter } from "next/navigation";
import { CRTOverlay } from "@/components/CRTOverlay";
import { LeaderboardScreen } from "@/components/LeaderboardScreen";

export default function LeaderboardClient() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <CRTOverlay>
      <LeaderboardScreen onBack={handleBack} />
    </CRTOverlay>
  );
}
