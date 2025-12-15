import { MongoClient, Db, Collection } from "mongodb";

export interface LeaderboardEntry {
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

class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private leaderboardCollection: Collection<LeaderboardEntry> | null = null;

  async connect(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn(
        "MongoDB URI not configured - leaderboard features disabled"
      );
      throw new Error(
        "MongoDB URI not configured. Please add MONGODB_URI to your environment variables."
      );
    }

    try {
      this.client = new MongoClient(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 3000,
      });
      await this.client.connect();
      this.db = this.client.db("weekend-warrior");
      this.leaderboardCollection =
        this.db.collection<LeaderboardEntry>("leaderboard");

      // Create indexes for better performance (ignore errors if they already exist)
      try {
        await this.leaderboardCollection.createIndex(
          { username: 1 },
          { unique: true }
        );
        await this.leaderboardCollection.createIndex({
          totalWeekendCommits: -1,
        });
        await this.leaderboardCollection.createIndex({ lastUpdated: -1 });
      } catch (indexError) {
        // Indexes might already exist, which is fine
        console.log("Indexes already exist or failed to create:", indexError);
      }

      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      // Clean up on connection failure
      this.client = null;
      this.db = null;
      this.leaderboardCollection = null;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.leaderboardCollection = null;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.leaderboardCollection) {
      await this.connect();
    }
  }

  async saveUserStats(stats: {
    username: string;
    totalWeekendCommits: number;
    saturdayCommits: number;
    sundayCommits: number;
    dedicationPercentage: number;
    longestStreak: number;
    achievements: Array<{ unlocked: boolean }>;
  }): Promise<LeaderboardEntry> {
    await this.ensureConnection();

    const achievementsUnlocked = stats.achievements.filter(
      (a) => a.unlocked
    ).length;

    const entry: LeaderboardEntry = {
      username: stats.username,
      totalWeekendCommits: stats.totalWeekendCommits,
      saturdayCommits: stats.saturdayCommits,
      sundayCommits: stats.sundayCommits,
      dedicationPercentage: stats.dedicationPercentage,
      longestStreak: stats.longestStreak,
      achievementsUnlocked,
      lastUpdated: new Date(),
    };

    // Upsert the user's stats
    await this.leaderboardCollection!.replaceOne(
      { username: stats.username },
      entry,
      { upsert: true }
    );

    return entry;
  }

  async getUserRank(
    username: string
  ): Promise<{ rank: number; totalPlayers: number } | null> {
    await this.ensureConnection();

    const user = await this.leaderboardCollection!.findOne({ username });
    if (!user) return null;

    const rank =
      (await this.leaderboardCollection!.countDocuments({
        totalWeekendCommits: { $gt: user.totalWeekendCommits },
      })) + 1;

    const totalPlayers = await this.leaderboardCollection!.countDocuments();

    return { rank, totalPlayers };
  }

  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    await this.ensureConnection();

    const leaderboard = await this.leaderboardCollection!.find({})
      .sort({ totalWeekendCommits: -1 })
      .limit(limit)
      .toArray();

    // Add rank to each entry
    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  async getUserPercentile(username: string): Promise<number | null> {
    await this.ensureConnection();

    const user = await this.leaderboardCollection!.findOne({ username });
    if (!user) return null;

    const totalPlayers = await this.leaderboardCollection!.countDocuments();
    const playersBelow = await this.leaderboardCollection!.countDocuments({
      totalWeekendCommits: { $lt: user.totalWeekendCommits },
    });

    return Math.round((playersBelow / totalPlayers) * 100);
  }

  async getGlobalAverages(): Promise<{
    avgCommits: number;
    avgDedication: number;
    avgStreak: number;
  }> {
    await this.ensureConnection();

    const result = await this.leaderboardCollection!.aggregate([
      {
        $group: {
          _id: null,
          avgCommits: { $avg: "$totalWeekendCommits" },
          avgDedication: { $avg: "$dedicationPercentage" },
          avgStreak: { $avg: "$longestStreak" },
        },
      },
    ]).toArray();

    if (result.length === 0) {
      return { avgCommits: 0, avgDedication: 0, avgStreak: 0 };
    }

    return {
      avgCommits: Math.round(result[0].avgCommits || 0),
      avgDedication: Math.round(result[0].avgDedication || 0),
      avgStreak: Math.round(result[0].avgStreak || 0),
    };
  }
}

// Singleton instance
export const databaseService = new DatabaseService();

// Helper functions for easier usage
export async function saveUserToLeaderboard(stats: any): Promise<{
  rank: number;
  totalPlayers: number;
  percentile: number;
  globalAverages: {
    avgCommits: number;
    avgDedication: number;
    avgStreak: number;
  };
}> {
  try {
    // Connection is handled by ensureConnection() in each method

    // Save user stats
    await databaseService.saveUserStats(stats);

    // Get user rank and percentile
    const rankInfo = await databaseService.getUserRank(stats.username);
    const percentile = await databaseService.getUserPercentile(stats.username);
    const globalAverages = await databaseService.getGlobalAverages();

    return {
      rank: rankInfo?.rank || 1,
      totalPlayers: rankInfo?.totalPlayers || 1,
      percentile: percentile || 1,
      globalAverages,
    };
  } catch (error) {
    console.error("Failed to save user to leaderboard:", error);
    // Return minimal data if database fails
    return {
      rank: 1,
      totalPlayers: 1,
      percentile: 100,
      globalAverages: {
        avgCommits: 0,
        avgDedication: 0,
        avgStreak: 0,
      },
    };
  }
}

export async function getLeaderboard(
  limit: number = 100
): Promise<LeaderboardEntry[]> {
  try {
    // Connection is handled by ensureConnection() in each method
    const leaderboard = await databaseService.getLeaderboard(limit);
    return leaderboard;
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
}
