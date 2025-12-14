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
      <div className="pixel-border bg-card p-4">
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-foreground">WEEKEND WARRIOR</span>
          <span className="text-arcade-yellow text-lg md:text-2xl">
            SCORE: {stats.totalWeekendCommits.toLocaleString()}
          </span>
          <span className="text-muted-foreground">TIME: 2025</span>
        </div>

        {/* Dedication Bar */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[10px]">
            <span>DEDICATION</span>
            <span className="text-arcade-green">
              {stats.dedicationPercentage}%
            </span>
          </div>
          <div className="h-3 bg-muted border border-foreground/30">
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
        <div className="pixel-border bg-card p-6 border-arcade-red">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sword className="w-5 h-5 text-arcade-red" />
              <h3 className="text-sm text-arcade-red">SATURDAY</h3>
              <Sword className="w-5 h-5 text-arcade-red" />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground">COMMITS</p>
              <div className="pixel-border bg-background p-4">
                <span className="text-3xl md:text-4xl text-arcade-yellow">
                  {stats.saturdayCommits}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-4 bg-muted border border-arcade-red/50">
                <div
                  className="h-full bg-arcade-red transition-all duration-1000"
                  style={{ width: `${saturdayPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-arcade-red">
                {saturdayPercentage}% OF WEEKEND
              </p>
            </div>
          </div>
        </div>

        {/* Center - Total Stats */}
        <div className="pixel-border bg-card p-6 flex flex-col items-center justify-center border-arcade-cyan">
          <div className="text-center space-y-4">
            <p className="text-xs text-arcade-cyan">TOTAL WEEKEND</p>

            <div className="relative">
              <Zap className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-arcade-yellow" />
              <span className="text-4xl md:text-5xl text-arcade-cyan rgb-split">
                {stats.totalWeekendCommits}
              </span>
              <Zap className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-arcade-yellow" />
            </div>

            <p className="text-[10px] text-arcade-yellow blink">
              {stats.dedicationPercentage > 70 ? "NO DAYS OFF" : "GRIND MODE"}
            </p>

            {/* Streak Info */}
            <div className="pt-4 border-t border-arcade-cyan/30 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">CURRENT STREAK</span>
                <span className="text-arcade-orange">
                  {stats.currentStreak} 🔥
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">BEST STREAK</span>
                <span className="text-arcade-yellow">
                  {stats.longestStreak} 👑
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sunday Stats */}
        <div className="pixel-border bg-card p-6 border-arcade-orange">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Moon className="w-5 h-5 text-arcade-orange" />
              <h3 className="text-sm text-arcade-orange">SUNDAY</h3>
              <Moon className="w-5 h-5 text-arcade-orange" />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground">COMMITS</p>
              <div className="pixel-border bg-background p-4">
                <span className="text-3xl md:text-4xl text-arcade-yellow">
                  {stats.sundayCommits}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-4 bg-muted border border-arcade-orange/50">
                <div
                  className="h-full bg-arcade-orange transition-all duration-1000"
                  style={{ width: `${sundayPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-arcade-orange">
                {sundayPercentage}% OF WEEKEND
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
