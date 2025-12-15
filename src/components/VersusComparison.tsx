import { WeekendStats } from "@/types/github";
import { Zap, Trophy } from "lucide-react";

interface VersusComparisonProps {
  stats: WeekendStats;
}

export function VersusComparison({ stats }: VersusComparisonProps) {
  // Use real global averages from database, or hide comparison if no data
  const hasGlobalData = stats.globalAverages.avgCommits > 0;

  const comparisons = [
    {
      label: "WEEKEND COMMITS",
      yours: stats.totalWeekendCommits,
      average: stats.globalAverages.avgCommits,
      unit: "",
    },
    {
      label: "DEDICATION SCORE",
      yours: stats.dedicationPercentage,
      average: stats.globalAverages.avgDedication,
      unit: "%",
    },
    {
      label: "LONGEST STREAK",
      yours: stats.longestStreak,
      average: stats.globalAverages.avgStreak,
      unit: " weeks",
    },
  ];

  // Don't show comparison if no global data available
  if (!hasGlobalData) {
    return (
      <div className="space-y-6">
        {/* Rank Display Only */}
        <div className="pixel-border bg-card p-4 md:p-6 text-center border-arcade-yellow">
          <Trophy className="w-10 h-10 md:w-12 md:h-12 mx-auto text-arcade-yellow mb-3 md:mb-4" />
          <p className="text-xs md:text-base font-pixel text-arcade-yellow">
            YOUR RANK
          </p>
          <p className="text-2xl md:text-5xl font-pixel text-foreground my-2">
            #{stats.globalRank.toLocaleString()} /{" "}
            {stats.totalPlayers.toLocaleString()}
          </p>
          <p className="text-arcade-green text-base md:text-2xl font-pixel">
            TOP {stats.percentile}% OF PLAYERS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="pixel-border bg-card p-4 text-center border-arcade-cyan">
        <div className="flex items-center justify-center gap-4">
          <span className="text-lg md:text-xl font-pixel text-arcade-red">
            YOU
          </span>
          <Zap className="w-6 h-6 text-arcade-yellow" />
          <span className="text-lg md:text-xl font-pixel text-arcade-cyan">
            ALL PLAYERS
          </span>
        </div>
      </div>

      {/* VS Split Screen */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Your Side */}
        <div className="pixel-border bg-card p-2 md:p-4 text-center border-arcade-red">
          <div className="text-2xl md:text-4xl mb-1 md:mb-2">🎮</div>
          <p className="text-[10px] md:text-sm font-pixel text-arcade-red truncate">
            @{stats.username}
          </p>
          <div className="mt-2 md:mt-4 space-y-1 md:space-y-2 text-[10px] md:text-xs font-pixel">
            <div className="flex justify-between">
              <span className="text-muted-foreground">LVL</span>
              <span className="text-arcade-yellow">
                {Math.floor(stats.totalWeekendCommits / 20)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">XP</span>
              <span className="text-arcade-cyan">
                {stats.totalWeekendCommits}
              </span>
            </div>
          </div>
        </div>

        {/* VS Center */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-pixel text-arcade-yellow rgb-split">
              VS
            </div>
            <Zap className="w-6 h-6 md:w-8 md:h-8 mx-auto text-arcade-yellow mt-1 md:mt-2" />
          </div>
        </div>

        {/* All Players Side */}
        <div className="pixel-border bg-card p-2 md:p-4 text-center border-arcade-cyan">
          <div className="text-2xl md:text-4xl mb-1 md:mb-2">👥</div>
          <p className="text-[10px] md:text-sm font-pixel text-arcade-cyan">
            ALL PLAYERS
          </p>
          <div className="mt-2 md:mt-4 space-y-1 md:space-y-2 text-[10px] md:text-xs font-pixel">
            <div className="flex justify-between">
              <span className="text-muted-foreground">AVG</span>
              <span className="text-arcade-yellow">
                {stats.globalAverages.avgCommits}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TOTAL</span>
              <span className="text-muted-foreground">
                {stats.totalPlayers.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Bars */}
      <div className="pixel-border bg-card p-4 md:p-6 space-y-4 md:space-y-6">
        {comparisons.map((comp, index) => {
          const yoursWidth = Math.min(
            (comp.yours / Math.max(comp.yours, comp.average * 2)) * 100,
            100
          );
          const avgWidth = Math.min(
            (comp.average / Math.max(comp.yours, comp.average * 2)) * 100,
            100
          );
          const winning = comp.yours > comp.average;
          const diff = Math.round(
            ((comp.yours - comp.average) / comp.average) * 100
          );

          return (
            <div
              key={comp.label}
              className="space-y-2"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-between text-[10px] md:text-sm font-pixel">
                <span className="text-foreground">{comp.label}</span>
                {winning && <span className="text-arcade-green">+{diff}%</span>}
                {!winning && <span className="text-arcade-red">{diff}%</span>}
              </div>

              {/* Your Bar */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-[8px] md:text-[10px] font-pixel text-arcade-red w-6 md:w-8">
                    YOU
                  </span>
                  <div className="flex-1 h-4 md:h-5 bg-muted border border-foreground/20 md:border-2">
                    <div
                      className="h-full bg-gradient-to-r from-arcade-red to-arcade-orange transition-all duration-1000"
                      style={{ width: `${yoursWidth}%` }}
                    />
                  </div>
                  <span className="text-[10px] md:text-xs font-pixel text-arcade-yellow w-12 md:w-16 text-right">
                    {comp.yours}
                    {comp.unit}
                  </span>
                </div>

                {/* Average Bar */}
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-[8px] md:text-[10px] font-pixel text-arcade-cyan w-6 md:w-8">
                    AVG
                  </span>
                  <div className="flex-1 h-4 md:h-5 bg-muted border border-foreground/20 md:border-2">
                    <div
                      className="h-full bg-gradient-to-r from-arcade-cyan to-arcade-green transition-all duration-1000"
                      style={{ width: `${avgWidth}%` }}
                    />
                  </div>
                  <span className="text-[10px] md:text-xs font-pixel text-muted-foreground w-12 md:w-16 text-right">
                    {comp.average}
                    {comp.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rank Display */}
      <div className="pixel-border bg-card p-4 md:p-6 text-center border-arcade-yellow">
        <Trophy className="w-10 h-10 md:w-12 md:h-12 mx-auto text-arcade-yellow mb-3 md:mb-4" />
        <p className="text-xs md:text-base font-pixel text-arcade-yellow">
          YOUR RANK
        </p>
        <p className="text-2xl md:text-5xl font-pixel text-foreground my-2">
          #{stats.globalRank.toLocaleString()} /{" "}
          {stats.totalPlayers.toLocaleString()}
        </p>
        <p className="text-arcade-green text-base md:text-2xl font-pixel">
          TOP {stats.percentile}% OF PLAYERS
        </p>
      </div>
    </div>
  );
}
