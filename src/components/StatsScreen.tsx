import { WeekendStats } from "@/types/github";
import { StatsHUD } from "./StatsHUD";
import { AchievementBadges } from "./AchievementBadges";
import { WeekendHeatmap } from "./WeekendHeatmap";
import { VersusComparison } from "./VersusComparison";
import { ChevronDown } from "lucide-react";

interface StatsScreenProps {
  stats: WeekendStats;
  onFinish: () => void;
}

export function StatsScreen({ stats, onFinish }: StatsScreenProps) {
  return (
    <div className="min-h-screen p-4 md:p-8 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">PLAYER STATS FOR</p>
        <h1 className="text-xl md:text-2xl text-arcade-cyan">
          @{stats.username}
        </h1>
      </div>

      {/* Main Stats HUD */}
      <section className="animate-fade-in-up">
        <StatsHUD stats={stats} />
      </section>

      {/* Scroll Indicator */}
      <div className="flex justify-center">
        <ChevronDown className="w-8 h-8 text-arcade-cyan animate-bounce" />
      </div>

      {/* Achievements */}
      <section
        className="animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <AchievementBadges achievements={stats.achievements} />
      </section>

      {/* Heatmap */}
      <section
        className="animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <WeekendHeatmap stats={stats} />
      </section>

      {/* VS Comparison */}
      <section
        className="animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <VersusComparison stats={stats} />
      </section>

      {/* Finish Button */}
      <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto">
        <button onClick={onFinish} className="arcade-button w-full text-sm">
          ▶ VIEW FINAL RESULTS
        </button>
      </div>
    </div>
  );
}
