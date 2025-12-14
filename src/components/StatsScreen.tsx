import { WeekendStats } from "@/types/github";
import { StatsHUD } from "./StatsHUD";
import { AchievementBadges } from "./AchievementBadges";
import { WeekendHeatmap } from "./WeekendHeatmap";
import { VersusComparison } from "./VersusComparison";
import { ChevronDown, Github } from "lucide-react";
import Image from "next/image";

interface StatsScreenProps {
  stats: WeekendStats;
  onFinish: () => void;
}

export function StatsScreen({ stats, onFinish }: StatsScreenProps) {
  return (
    <div className="min-h-screen p-4 md:p-8 space-y-12 pb-24">
      {/* Header with Avatar */}
      <div className="text-center space-y-6">
        <p className="text-sm md:text-base text-arcade-yellow font-pixel tracking-wider">
          PLAYER STATS FOR
        </p>

        {/* User Avatar and Name */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="pixel-border p-1 bg-card">
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                <Image
                  src={`https://github.com/${stats.username}.png`}
                  alt={`${stats.username}'s avatar`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-arcade-cyan p-2 pixel-border">
              <Github className="w-4 h-4 md:w-5 md:h-5 text-background" />
            </div>
          </div>

          <h1 className="text-2xl md:text-5xl font-pixel text-arcade-cyan rgb-split leading-relaxed">
            @{stats.username}
          </h1>

          <div className="flex items-center gap-2">
            <div className="w-12 h-[2px] bg-arcade-red" />
            <span className="text-xs md:text-sm text-arcade-red font-pixel">
              WEEKEND WARRIOR
            </span>
            <div className="w-12 h-[2px] bg-arcade-red" />
          </div>
        </div>
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
      <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto z-10">
        <button
          onClick={onFinish}
          className="arcade-button w-full text-xs md:text-sm font-pixel"
        >
          ▶ VIEW FINAL RESULTS
        </button>
      </div>
    </div>
  );
}
