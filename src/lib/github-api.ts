import {
  WeekendStats,
  Achievement,
  LanguageStat,
  RepoStat,
} from "@/types/github";
import { ACHIEVEMENTS } from "@/data/mockData";
import { saveUserToLeaderboard } from "@/lib/database";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

interface GitHubGraphQLResponse {
  data: {
    user: {
      login: string;
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
              weekday: number;
            }>;
          }>;
        };
      };
      repositories: {
        nodes: Array<{
          name: string;
          primaryLanguage?: {
            name: string;
            color: string;
          };
          defaultBranchRef?: {
            target: {
              history: {
                totalCount: number;
                nodes: Array<{
                  committedDate: string;
                  author: {
                    user?: {
                      login: string;
                    };
                  };
                }>;
              };
            };
          };
        }>;
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

const GITHUB_QUERY = `
  query UserContributions($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
      repositories(first: 20, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: OWNER) {
        nodes {
          name
          primaryLanguage {
            name
            color
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 100, author: {id: null}) {
                  totalCount
                  nodes {
                    committedDate
                    author {
                      user {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchGitHubStats(
  username: string
): Promise<WeekendStats> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error(
      "GitHub token missing. Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("GITHUB"))
    );
    throw new Error(
      "GitHub token not configured on server. Please add GITHUB_TOKEN to environment variables."
    );
  }

  // Get data for 2025 only
  const from = new Date("2025-01-01T00:00:00Z");
  const to = new Date("2025-12-31T23:59:59Z");

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Weekend-Warrior-App/1.0",
    },
    body: JSON.stringify({
      query: GITHUB_QUERY,
      variables: {
        username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("GitHub API authentication failed. Invalid token.");
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded or access forbidden.");
    }
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const result: GitHubGraphQLResponse = await response.json();

  if (result.errors) {
    const error = result.errors[0];
    if (error.message.includes("Could not resolve to a User")) {
      throw new Error(`User "${username}" not found`);
    }
    throw new Error(`GitHub GraphQL error: ${error.message}`);
  }

  if (!result.data.user) {
    throw new Error(`User "${username}" not found`);
  }

  return await processGitHubData(result.data.user, username);
}

async function processGitHubData(
  userData: any,
  username: string
): Promise<WeekendStats> {
  const { contributionsCollection, repositories } = userData;
  const { weeks } = contributionsCollection.contributionCalendar;

  if (!weeks || !Array.isArray(weeks)) {
    throw new Error("Invalid GitHub API response: missing contribution data");
  }

  // Process weekend contributions for 2025 only
  let saturdayCommits = 0;
  let sundayCommits = 0;
  let weekendCommitsByHour: { [hour: number]: number } = {};
  let longestStreak = 0;
  let currentStreak = 0;
  let busiestDay = { date: "", commits: 0 };

  const weekendsByMonth: any[] = [];
  const monthlyData: { [key: string]: any } = {};

  // Initialize hourly commits
  for (let i = 0; i < 24; i++) {
    weekendCommitsByHour[i] = 0;
  }

  weeks.forEach((week: any) => {
    let weekHasWeekendCommits = false;

    week.contributionDays.forEach((day: any) => {
      const dayOfWeek = day.weekday;
      const commits = day.contributionCount;
      const dayDate = new Date(day.date);

      // Only process 2025 data and weekend days (Saturday = 6, Sunday = 0)
      if (
        dayDate.getFullYear() === 2025 &&
        (dayOfWeek === 6 || dayOfWeek === 0)
      ) {
        if (dayOfWeek === 6) saturdayCommits += commits;
        if (dayOfWeek === 0) sundayCommits += commits;

        if (commits > 0) {
          weekHasWeekendCommits = true;

          // Track busiest day
          if (commits > busiestDay.commits) {
            busiestDay = { date: day.date, commits };
          }

          // Simulate hourly distribution (since GraphQL doesn't provide this)
          const hourDistribution = generateHourlyDistribution(commits);
          Object.entries(hourDistribution).forEach(([hour, count]) => {
            weekendCommitsByHour[parseInt(hour)] += count;
          });
        }

        // Group by month for heatmap
        const monthKey = dayDate
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase();

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, weeks: [] };
        }
      }
    });

    // Update streaks
    if (weekHasWeekendCommits) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Convert monthly data to required format
  Object.values(monthlyData).forEach((monthData: any) => {
    weekendsByMonth.push(monthData);
  });

  // Process repositories for language and repo stats (2025 weekend commits only)
  const languageStats: { [key: string]: { commits: number; color: string } } =
    {};
  const repoStats: RepoStat[] = [];

  if (repositories?.nodes && Array.isArray(repositories.nodes)) {
    repositories.nodes.forEach((repo: any) => {
      if (repo.defaultBranchRef?.target?.history) {
        const repoCommits = repo.defaultBranchRef.target.history.nodes.filter(
          (commit: any) => {
            const date = new Date(commit.committedDate);
            const dayOfWeek = date.getDay();
            return (
              date.getFullYear() === 2025 &&
              (dayOfWeek === 0 || dayOfWeek === 6) &&
              commit.author.user?.login === username
            );
          }
        ).length;

        if (repoCommits > 0) {
          repoStats.push({ name: repo.name, commits: repoCommits });

          if (repo.primaryLanguage) {
            const lang = repo.primaryLanguage.name;
            if (!languageStats[lang]) {
              languageStats[lang] = {
                commits: 0,
                color: repo.primaryLanguage.color || "#808080",
              };
            }
            languageStats[lang].commits += repoCommits;
          }
        }
      }
    });
  }

  // Convert to required format
  const totalWeekendCommits = saturdayCommits + sundayCommits;
  const topLanguages: LanguageStat[] = Object.entries(languageStats)
    .map(([name, data]) => ({
      name,
      commits: data.commits,
      percentage:
        totalWeekendCommits > 0
          ? Math.round((data.commits / totalWeekendCommits) * 100)
          : 0,
      color: data.color,
    }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 5);

  const topRepos = repoStats.sort((a, b) => b.commits - a.commits).slice(0, 5);

  // Convert hourly data to required format
  const commitsByHour = Object.entries(weekendCommitsByHour).map(
    ([hour, commits]) => ({
      hour: parseInt(hour),
      commits,
    })
  );

  // Calculate achievements
  const achievements = calculateAchievements(
    totalWeekendCommits,
    longestStreak,
    commitsByHour,
    topLanguages.length,
    weeks.length
  );

  // Calculate dedication percentage (weekends with commits / total weekends in 2025)
  const weekendsWithCommits = weeks.filter((week: any) =>
    week.contributionDays.some((day: any) => {
      const dayDate = new Date(day.date);
      return (
        dayDate.getFullYear() === 2025 &&
        (day.weekday === 0 || day.weekday === 6) &&
        day.contributionCount > 0
      );
    })
  ).length;

  // Calculate total weekends in 2025 (approximately 52)
  const totalWeekends2025 = 52;
  const dedicationPercentage = Math.round(
    (weekendsWithCommits / totalWeekends2025) * 100
  );

  // Save to leaderboard and get real rank data
  const leaderboardData = await saveUserToLeaderboard({
    username,
    totalWeekendCommits,
    saturdayCommits,
    sundayCommits,
    dedicationPercentage,
    longestStreak,
    achievements,
  });

  return {
    username,
    totalWeekendCommits,
    saturdayCommits,
    sundayCommits,
    dedicationPercentage,
    longestStreak,
    currentStreak,
    busiestDay,
    weekendsByMonth,
    commitsByHour,
    topLanguages,
    topRepos,
    achievements,
    globalRank: leaderboardData.rank,
    totalPlayers: leaderboardData.totalPlayers,
    percentile: leaderboardData.percentile,
    globalAverages: leaderboardData.globalAverages,
  };
}

function generateHourlyDistribution(totalCommits: number): {
  [hour: number]: number;
} {
  const distribution: { [hour: number]: number } = {};

  // Weekend coding patterns - more likely in evening/night
  const hourWeights = {
    0: 0.08,
    1: 0.06,
    2: 0.04,
    3: 0.02,
    4: 0.01,
    5: 0.01,
    6: 0.02,
    7: 0.03,
    8: 0.04,
    9: 0.06,
    10: 0.08,
    11: 0.09,
    12: 0.07,
    13: 0.06,
    14: 0.08,
    15: 0.09,
    16: 0.1,
    17: 0.08,
    18: 0.07,
    19: 0.08,
    20: 0.09,
    21: 0.1,
    22: 0.12,
    23: 0.1,
  };

  Object.entries(hourWeights).forEach(([hour, weight]) => {
    distribution[parseInt(hour)] = Math.floor(totalCommits * weight);
  });

  return distribution;
}

function calculateAchievements(
  totalCommits: number,
  longestStreak: number,
  commitsByHour: any[],
  languageCount: number,
  totalWeeks: number
): Achievement[] {
  const nightCommits = commitsByHour
    .filter((h) => h.hour >= 22 || h.hour <= 2)
    .reduce((sum, h) => sum + h.commits, 0);

  const earlyCommits = commitsByHour
    .filter((h) => h.hour >= 5 && h.hour <= 8)
    .reduce((sum, h) => sum + h.commits, 0);

  const graveyardCommits = commitsByHour
    .filter((h) => h.hour >= 2 && h.hour <= 6)
    .reduce((sum, h) => sum + h.commits, 0);

  return ACHIEVEMENTS.map((achievement) => {
    let unlocked = false;

    switch (achievement.id) {
      case "weekend-warrior":
        unlocked = totalWeeks >= 20 && totalCommits > 0; // Reduced from 40 to 20
        break;
      case "night-owl":
        unlocked = nightCommits >= 20; // Reduced from 50 to 20
        break;
      case "early-bird":
        unlocked = earlyCommits >= 20; // Reduced from 50 to 20
        break;
      case "streak-master":
        unlocked = longestStreak >= 8; // Reduced from 15 to 8
        break;
      case "binge-coder":
        unlocked = totalCommits > 200; // Reduced from 500 to 200
        break;
      case "no-life":
        unlocked = totalCommits / Math.max(totalWeeks, 1) > 5; // Reduced from 10 to 5
        break;
      case "polyglot":
        unlocked = languageCount >= 3; // Reduced from 5 to 3
        break;
      case "coffee-powered":
        unlocked = graveyardCommits >= 10; // Reduced from 20 to 10
        break;
      case "legend":
        unlocked = totalCommits > 500; // Reduced from 1000 to 500
        break;
    }

    return { ...achievement, unlocked };
  });
}
