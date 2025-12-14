import { Metadata } from "next";
import UserStatsClient from "./client";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  return {
    title: `${decodedUsername}'s Weekend Warrior Stats - GitHub Edition`,
    description: `View ${decodedUsername}'s weekend coding statistics and achievements in this retro-style GitHub analyzer.`,
    openGraph: {
      title: `${decodedUsername}'s Weekend Warrior Stats`,
      description: `Check out ${decodedUsername}'s weekend coding patterns and achievements!`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedUsername}'s Weekend Warrior Stats`,
      description: `Weekend coding statistics for ${decodedUsername}`,
    },
  };
}

export default async function UserStatsPage({ params }: Props) {
  const { username } = await params;
  return <UserStatsClient username={decodeURIComponent(username)} />;
}
