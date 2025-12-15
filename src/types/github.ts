export interface WeekendStats {
  username: string;
  totalWeekendCommits: number;
  saturdayCommits: number;
  sundayCommits: number;
  dedicationPercentage: number;
  longestStreak: number;
  currentStreak: number;
  busiestDay: {
    date: string;
    commits: number;
  };
  weekendsByMonth: WeekendMonth[];
  commitsByHour: HourlyCommits[];
  topLanguages: LanguageStat[];
  topRepos: RepoStat[];
  achievements: Achievement[];
  globalRank: number;
  totalPlayers: number;
  percentile: number;
  globalAverages: {
    avgCommits: number;
    avgDedication: number;
    avgStreak: number;
  };
}

export interface WeekendMonth {
  month: string;
  weeks: WeekendWeek[];
}

export interface WeekendWeek {
  weekNumber: number;
  saturday: DayStats;
  sunday: DayStats;
}

export interface DayStats {
  date: string;
  commits: number;
}

export interface HourlyCommits {
  hour: number;
  commits: number;
}

export interface LanguageStat {
  name: string;
  commits: number;
  percentage: number;
  color: string;
}

export interface RepoStat {
  name: string;
  commits: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  requirement: string;
}

export type GameScreen =
  | "title"
  | "loading"
  | "stats"
  | "gameover"
  | "error"
  | "leaderboard";
