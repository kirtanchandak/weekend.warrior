import { Metadata } from "next";
import UserStatsClient from "./client";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // Fetch user stats to include in OG image
  let commits = "0";
  let dedication = "0";
  let rank = "1";

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/github-stats?username=${encodeURIComponent(decodedUsername)}`,
      { cache: "no-store" }
    );
    if (response.ok) {
      const data = await response.json();
      commits = data.stats?.totalWeekendCommits?.toString() || "0";
      dedication = data.stats?.dedicationPercentage?.toString() || "0";
      rank = data.stats?.globalRank?.toString() || "1";
    }
  } catch (error) {
    console.error("Failed to fetch stats for OG image:", error);
  }

  const ogImageUrl = `/api/og?username=${encodeURIComponent(
    decodedUsername
  )}&commits=${commits}&dedication=${dedication}&rank=${rank}`;

  return {
    title: `${decodedUsername}'s Weekend Warrior Stats - GitHub Edition`,
    description: `View ${decodedUsername}'s weekend coding statistics and achievements in this retro-style GitHub analyzer.`,
    openGraph: {
      title: `${decodedUsername}'s Weekend Warrior Stats`,
      description: `Check out ${decodedUsername}'s weekend coding patterns and achievements!`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${decodedUsername}'s Weekend Warrior Stats`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedUsername}'s Weekend Warrior Stats`,
      description: `Weekend coding statistics for ${decodedUsername}`,
      images: [ogImageUrl],
    },
  };
}

export default async function UserStatsPage({ params }: Props) {
  const { username } = await params;
  return <UserStatsClient username={decodeURIComponent(username)} />;
}
