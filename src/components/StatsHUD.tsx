import { WeekendStats } from "@/types/github";
import { Sword, Moon, Zap } from "lucide-react";

interface StatsHUDProps {
  stats: WeekendStats;
}

export function StatsHUD({ stats }: StatsHUDProps) {
  const saturdayPercentage = Math.round(
    (stats.saturdayCommits / stats.totalWeekendCommits) * 100
  );
  const sundayPercentage = 100 - saturdayPercentage;

  return (
    <div className="space-y-6">
      {/* Top Score Bar */}
      <div className="pixel-border bg-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 text-xs md:text-base">
          <span className="text-foreground font-pixel">WEEKEND WARRIOR</span>
          <span className="text-arcade-yellow text-xl md:text-4xl font-pixel">
            SCORE: {stats.totalWeekendCommits.toLocaleString()}
          </span>
          <span className="text-muted-foreground font-pixel text-[10px] md:text-base">
            TIME: 2025
          </span>
        </div>

        {/* Dedication Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm md:text-base">
            <span className="font-pixel text-foreground">DEDICATION</span>
            <span className="text-arcade-green font-pixel text-lg md:text-xl">
              {stats.dedicationPercentage}%
            </span>
          </div>
          <div className="h-5 bg-muted border-2 border-foreground/30">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${stats.dedicationPercentage}%`,
                background:
                  stats.dedicationPercentage > 80
                    ? "hsl(var(--arcade-red))"
                    : stats.dedicationPercentage > 50
                    ? "hsl(var(--arcade-orange))"
                    : "hsl(var(--arcade-green))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Saturday Stats */}
        <div className="pixel-border bg-card p-4 md:p-6 border-arcade-red">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sword className="w-5 h-5 md:w-7 md:h-7 text-arcade-red" />
              <h3 className="text-base md:text-xl font-pixel text-arcade-red">
                SATURDAY
              </h3>
              <Sword className="w-5 h-5 md:w-7 md:h-7 text-arcade-red" />
            </div>

            <div className="space-y-2 md:space-y-3">
              <p className="text-[10px] md:text-sm text-muted-foreground font-pixel">
                COMMITS
              </p>
              <div className="pixel-border bg-background p-4 md:p-6">
                <span className="text-3xl md:text-6xl font-pixel text-arcade-yellow">
                  {stats.saturdayCommits}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-5 bg-muted border-2 border-arcade-red/50">
                <div
                  className="h-full bg-arcade-red transition-all duration-1000"
                  style={{ width: `${saturdayPercentage}%` }}
                />
              </div>
              <p className="text-xs md:text-sm font-pixel text-arcade-red">
                {saturdayPercentage}% OF WEEKEND
              </p>
            </div>
          </div>
        </div>

        {/* Center - Total Stats */}
        <div className="pixel-border bg-card p-4 md:p-6 flex flex-col items-center justify-center border-arcade-cyan">
          <div className="text-center space-y-3 md:space-y-4">
            <p className="text-xs md:text-base font-pixel text-arcade-cyan">
              TOTAL WEEKEND
            </p>

            <div className="relative px-8">
              <Zap className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 md:w-7 md:h-7 text-arcade-yellow" />
              <span className="text-4xl md:text-7xl font-pixel text-arcade-cyan rgb-split">
                {stats.totalWeekendCommits}
              </span>
              <Zap className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 md:w-7 md:h-7 text-arcade-yellow" />
            </div>

            <p className="text-xs md:text-base font-pixel text-arcade-yellow blink">
              {stats.dedicationPercentage > 70 ? "NO DAYS OFF" : "GRIND MODE"}
            </p>

            {/* Streak Info */}
            <div className="pt-3 md:pt-4 border-t-2 border-arcade-cyan/30 space-y-2 md:space-y-3 w-full">
              <div className="flex justify-between text-[10px] md:text-sm">
                <span className="text-muted-foreground font-pixel">
                  CURRENT STREAK
                </span>
                <span className="text-arcade-orange font-pixel text-sm md:text-lg">
                  {stats.currentStreak} 🔥
                </span>
              </div>
              <div className="flex justify-between text-[10px] md:text-sm">
                <span className="text-muted-foreground font-pixel">
                  BEST STREAK
                </span>
                <span className="text-arcade-yellow font-pixel text-sm md:text-lg">
                  {stats.longestStreak} 👑
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sunday Stats */}
        <div className="pixel-border bg-card p-4 md:p-6 border-arcade-orange">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Moon className="w-5 h-5 md:w-7 md:h-7 text-arcade-orange" />
              <h3 className="text-base md:text-xl font-pixel text-arcade-orange">
                SUNDAY
              </h3>
              <Moon className="w-5 h-5 md:w-7 md:h-7 text-arcade-orange" />
            </div>

            <div className="space-y-2 md:space-y-3">
              <p className="text-[10px] md:text-sm text-muted-foreground font-pixel">
                COMMITS
              </p>
              <div className="pixel-border bg-background p-4 md:p-6">
                <span className="text-3xl md:text-6xl font-pixel text-arcade-yellow">
                  {stats.sundayCommits}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-5 bg-muted border-2 border-arcade-orange/50">
                <div
                  className="h-full bg-arcade-orange transition-all duration-1000"
                  style={{ width: `${sundayPercentage}%` }}
                />
              </div>
              <p className="text-xs md:text-sm font-pixel text-arcade-orange">
                {sundayPercentage}% OF WEEKEND
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
