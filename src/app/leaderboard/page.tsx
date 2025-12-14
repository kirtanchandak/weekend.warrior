import { Metadata } from "next";
import LeaderboardClient from "./client";

export const metadata: Metadata = {
  title: "Leaderboard - Weekend Warrior GitHub Edition",
  description:
    "See the top weekend coding warriors and their GitHub statistics in this retro-style leaderboard.",
  openGraph: {
    title: "Weekend Warrior Leaderboard",
    description: "Top weekend coding warriors ranked by their GitHub activity",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekend Warrior Leaderboard",
    description: "See who are the top weekend coding warriors!",
  },
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
