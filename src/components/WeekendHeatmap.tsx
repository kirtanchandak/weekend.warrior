import { WeekendStats } from "@/types/github";
import { useState } from "react";

interface WeekendHeatmapProps {
  stats: WeekendStats;
}

function getCommitLevel(commits: number): { bg: string; label: string } {
  if (commits === 0) return { bg: "bg-muted", label: "REST DAY" };
  if (commits <= 5) return { bg: "bg-arcade-green/30", label: "LIGHT WORK" };
  if (commits <= 15)
    return { bg: "bg-arcade-green/60", label: "SOLID SESSION" };
  if (commits <= 30) return { bg: "bg-arcade-yellow/70", label: "GOING HARD" };
  if (commits <= 50)
    return { bg: "bg-arcade-orange/80", label: "BINGE CODING" };
  return { bg: "bg-arcade-red", label: "TOUCH GRASS!" };
}

export function WeekendHeatmap({ stats }: WeekendHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="pixel-border bg-card p-4 text-center border-arcade-cyan">
        <div className="flex items-center justify-center gap-4">
          <span className="text-arcade-cyan">📅</span>
          <h2 className="text-lg text-foreground">WEEKEND MISSION LOG</h2>
          <span className="text-arcade-cyan">📅</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">JAN - DEC 2025</p>
      </div>

      {/* Heatmap Grid */}
      <div className="pixel-border bg-card p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Month Labels */}
          <div className="flex mb-2">
            <div className="w-12" /> {/* Spacer for row labels */}
            {stats.weekendsByMonth.map((month) => (
              <div
                key={month.month}
                className="flex-1 text-center text-[8px] text-muted-foreground"
              >
                {month.month}
              </div>
            ))}
          </div>

          {/* Saturday Row */}
          <div className="flex items-center mb-1">
            <div className="w-12 text-[8px] text-muted-foreground">SAT</div>
            <div className="flex-1 flex gap-1">
              {stats.weekendsByMonth.map((month) =>
                month.weeks.map((week) => {
                  const level = getCommitLevel(week.saturday.commits);
                  return (
                    <div
                      key={`sat-${week.weekNumber}`}
                      className={`
                        w-3 h-3 md:w-4 md:h-4 border border-foreground/20 cursor-pointer
                        transition-transform hover:scale-150 hover:z-10 relative
                        ${level.bg}
                      `}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left,
                          y: rect.top - 60,
                          content: `SAT ${week.saturday.date}\n${week.saturday.commits} COMMITS\n"${level.label}"`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Sunday Row */}
          <div className="flex items-center">
            <div className="w-12 text-[8px] text-muted-foreground">SUN</div>
            <div className="flex-1 flex gap-1">
              {stats.weekendsByMonth.map((month) =>
                month.weeks.map((week) => {
                  const level = getCommitLevel(week.sunday.commits);
                  return (
                    <div
                      key={`sun-${week.weekNumber}`}
                      className={`
                        w-3 h-3 md:w-4 md:h-4 border border-foreground/20 cursor-pointer
                        transition-transform hover:scale-150 hover:z-10 relative
                        ${level.bg}
                      `}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left,
                          y: rect.top - 60,
                          content: `SUN ${week.sunday.date}\n${week.sunday.commits} COMMITS\n"${level.label}"`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[8px] flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted border border-foreground/20" />
            <span className="text-muted-foreground">ZERO</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-arcade-green/30 border border-foreground/20" />
            <span className="text-muted-foreground">LOW</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-arcade-yellow/70 border border-foreground/20" />
            <span className="text-muted-foreground">MEDIUM</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-arcade-orange/80 border border-foreground/20" />
            <span className="text-muted-foreground">HIGH</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-arcade-red border border-foreground/20" />
            <span className="text-muted-foreground">INSANE</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pixel-border bg-background p-2 text-[8px] whitespace-pre-line pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
