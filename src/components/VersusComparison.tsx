import { WeekendStats } from "@/types/github";
import { Zap, Trophy } from "lucide-react";

interface VersusComparisonProps {
  stats: WeekendStats;
}

export function VersusComparison({ stats }: VersusComparisonProps) {
  const globalAverage = 127;
  const avgDedication = 23;

  const comparisons = [
    {
      label: "WEEKEND COMMITS",
      yours: stats.totalWeekendCommits,
      average: globalAverage,
      unit: "",
    },
    {
      label: "DEDICATION SCORE",
      yours: stats.dedicationPercentage,
      average: avgDedication,
      unit: "%",
    },
    {
      label: "LONGEST STREAK",
      yours: stats.longestStreak,
      average: 4,
      unit: " weeks",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="pixel-border bg-card p-4 text-center border-arcade-cyan">
        <div className="flex items-center justify-center gap-4">
          <span className="text-arcade-red">YOU</span>
          <Zap className="w-6 h-6 text-arcade-yellow" />
          <span className="text-arcade-cyan">THE WORLD</span>
        </div>
      </div>

      {/* VS Split Screen */}
      <div className="grid grid-cols-3 gap-4">
        {/* Your Side */}
        <div className="pixel-border bg-card p-4 text-center border-arcade-red">
          <div className="text-4xl mb-2">🎮</div>
          <p className="text-xs text-arcade-red">@{stats.username}</p>
          <div className="mt-4 space-y-2 text-[10px]">
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
            <div className="text-3xl font-pixel text-arcade-yellow rgb-split">
              VS
            </div>
            <Zap className="w-8 h-8 mx-auto text-arcade-yellow mt-2" />
          </div>
        </div>

        {/* Global Side */}
        <div className="pixel-border bg-card p-4 text-center border-arcade-cyan">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-xs text-arcade-cyan">EVERYONE ELSE</p>
          <div className="mt-4 space-y-2 text-[10px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">AVG</span>
              <span className="text-arcade-yellow">{globalAverage}</span>
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
      <div className="pixel-border bg-card p-6 space-y-6">
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
              <div className="flex justify-between text-[10px]">
                <span className="text-foreground">{comp.label}</span>
                {winning && <span className="text-arcade-green">+{diff}%</span>}
                {!winning && <span className="text-arcade-red">{diff}%</span>}
              </div>

              {/* Your Bar */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-arcade-red w-8">YOU</span>
                  <div className="flex-1 h-4 bg-muted border border-foreground/20">
                    <div
                      className="h-full bg-gradient-to-r from-arcade-red to-arcade-orange transition-all duration-1000"
                      style={{ width: `${yoursWidth}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-arcade-yellow w-16 text-right">
                    {comp.yours}
                    {comp.unit}
                  </span>
                </div>

                {/* Average Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-arcade-cyan w-8">AVG</span>
                  <div className="flex-1 h-4 bg-muted border border-foreground/20">
                    <div
                      className="h-full bg-gradient-to-r from-arcade-cyan to-arcade-green transition-all duration-1000"
                      style={{ width: `${avgWidth}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-16 text-right">
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
      <div className="pixel-border bg-card p-6 text-center border-arcade-yellow">
        <Trophy className="w-12 h-12 mx-auto text-arcade-yellow mb-4" />
        <p className="text-sm text-arcade-yellow">GLOBAL RANK</p>
        <p className="text-3xl text-foreground my-2">
          #{stats.globalRank.toLocaleString()} /{" "}
          {stats.totalPlayers.toLocaleString()}
        </p>
        <p className="text-arcade-green text-lg">
          TOP {stats.percentile}% OF ALL PLAYERS
        </p>
      </div>
    </div>
  );
}
