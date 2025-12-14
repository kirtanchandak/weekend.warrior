import { useState, useEffect } from "react";
import { Achievement } from "@/types/github";
import { Lock } from "lucide-react";

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const RARITY_COLORS = {
  common: "border-muted-foreground",
  rare: "border-arcade-cyan",
  epic: "border-arcade-orange",
  legendary: "border-arcade-red",
};

const RARITY_GLOW = {
  common: "",
  rare: "shadow-[0_0_20px_hsl(var(--arcade-cyan)/0.3)]",
  epic: "shadow-[0_0_20px_hsl(var(--arcade-orange)/0.3)]",
  legendary: "shadow-[0_0_30px_hsl(var(--arcade-red)/0.5)]",
};

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const [unlockedIndices, setUnlockedIndices] = useState<number[]>([]);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  useEffect(() => {
    // Animate unlocking achievements one by one
    achievements.forEach((achievement, index) => {
      if (achievement.unlocked) {
        setTimeout(() => {
          setUnlockedIndices((prev) => [...prev, index]);
        }, index * 300);
      }
    });
  }, [achievements]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="pixel-border bg-card p-4 text-center border-arcade-cyan">
        <div className="flex items-center justify-center gap-4">
          <span className="text-arcade-yellow blink">⭐</span>
          <h2 className="text-lg md:text-xl font-pixel text-foreground">
            ACHIEVEMENTS UNLOCKED
          </h2>
          <span className="text-arcade-yellow blink">⭐</span>
        </div>
        <p className="text-xs md:text-sm font-pixel text-muted-foreground mt-2">
          {unlockedCount} / {achievements.length} COLLECTED
        </p>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const isAnimatedUnlock = unlockedIndices.includes(index);
          const showAsUnlocked = achievement.unlocked && isAnimatedUnlock;

          return (
            <div
              key={achievement.id}
              className={`
                relative pixel-border bg-card p-4 transition-all duration-300
                ${
                  showAsUnlocked
                    ? RARITY_COLORS[achievement.rarity]
                    : "border-muted"
                }
                ${showAsUnlocked ? RARITY_GLOW[achievement.rarity] : ""}
              `}
            >
              {/* Badge Icon */}
              <div className="text-center space-y-3">
                <div
                  className={`
                  text-4xl transition-all duration-300
                  ${showAsUnlocked ? "" : "grayscale opacity-30"}
                `}
                >
                  {showAsUnlocked ? (
                    achievement.icon
                  ) : (
                    <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
                  )}
                </div>

                {/* Badge Name */}
                <h3
                  className={`
                  text-xs md:text-sm font-pixel leading-tight
                  ${
                    showAsUnlocked ? "text-foreground" : "text-muted-foreground"
                  }
                `}
                >
                  {showAsUnlocked ? achievement.name : "???"}
                </h3>

                {/* Description */}
                <p className="text-[10px] md:text-xs font-pixel text-muted-foreground leading-relaxed">
                  {showAsUnlocked
                    ? achievement.description
                    : achievement.requirement}
                </p>

                {/* Rarity Tag */}
                {showAsUnlocked && (
                  <span
                    className={`
                    text-[10px] font-pixel uppercase px-2 py-0.5 inline-block
                    ${
                      achievement.rarity === "legendary"
                        ? "bg-arcade-red text-foreground"
                        : ""
                    }
                    ${
                      achievement.rarity === "epic"
                        ? "bg-arcade-orange text-background"
                        : ""
                    }
                    ${
                      achievement.rarity === "rare"
                        ? "bg-arcade-cyan text-background"
                        : ""
                    }
                    ${
                      achievement.rarity === "common"
                        ? "bg-muted text-foreground"
                        : ""
                    }
                  `}
                  >
                    {achievement.rarity}
                  </span>
                )}
              </div>

              {/* Locked Overlay */}
              {!showAsUnlocked && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <span className="text-xs font-pixel text-muted-foreground">
                    🔒 LOCKED
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
