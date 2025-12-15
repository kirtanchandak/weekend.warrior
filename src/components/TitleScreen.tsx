import { useState } from "react";
import {
  Gamepad2,
  Coffee,
  Calendar,
  Clock,
  Github,
  Trophy,
} from "lucide-react";

interface TitleScreenProps {
  onStart: (username: string) => void | Promise<void>;
  onShowLeaderboard?: () => void;
}

export function TitleScreen({ onStart, onShowLeaderboard }: TitleScreenProps) {
  const [username, setUsername] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await onStart(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Top HUD */}
      <div className="absolute top-6 left-6 right-6 flex justify-center text-xs font-pixel text-muted-foreground">
        <span className="text-arcade-yellow">WEEKEND WARRIOR</span>
      </div>

      {/* Main Title Area */}
      <div className="text-center space-y-8 max-w-2xl">
        {/* Pixel Art Decorations */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="float" style={{ animationDelay: "0s" }}>
            <Gamepad2 className="w-8 h-8 text-arcade-red" />
          </div>
          <div className="float" style={{ animationDelay: "0.5s" }}>
            <Coffee className="w-8 h-8 text-arcade-orange" />
          </div>
          <div className="float" style={{ animationDelay: "1s" }}>
            <Github className="w-8 h-8 text-foreground" />
          </div>
          <div className="float" style={{ animationDelay: "1.5s" }}>
            <Calendar className="w-8 h-8 text-arcade-cyan" />
          </div>
          <div className="float" style={{ animationDelay: "2s" }}>
            <Clock className="w-8 h-8 text-arcade-yellow" />
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-pixel text-foreground rgb-split leading-relaxed">
            WEEKEND
          </h1>
          <h1 className="text-3xl md:text-5xl font-pixel text-arcade-red leading-relaxed">
            WARRIOR
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-[2px] bg-arcade-cyan" />
            <span className="text-xs font-pixel text-arcade-cyan">
              GITHUB EDITION
            </span>
            <div className="w-8 h-[2px] bg-arcade-cyan" />
          </div>
          <p className="text-[10px] font-pixel text-muted-foreground mt-2">
            © 2025
          </p>
        </div>

        {/* Username Input */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-12">
          <div className="pixel-border bg-card p-6 space-y-4">
            <label className="text-xs font-pixel text-arcade-yellow block text-left">
              ENTER GITHUB USERNAME:
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-background border-2 border-foreground/50 px-4 py-3 font-pixel text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-arcade-cyan"
                maxLength={39}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-arcade-cyan blink">
                █
              </span>
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            disabled={!username.trim()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              arcade-button w-full text-sm font-pixel
              ${!username.trim() ? "opacity-50 cursor-not-allowed" : ""}
              ${isHovered && username.trim() ? "shake" : ""}
            `}
          >
            ▶ START GAME
          </button>
        </form>

        {/* Leaderboard Button */}
        {onShowLeaderboard && (
          <button
            onClick={onShowLeaderboard}
            className="arcade-button w-full max-w-md text-sm font-pixel bg-muted flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            LEADERBOARD
          </button>
        )}

        {/* Blinking Prompt */}
        <p className="text-xs font-pixel text-arcade-yellow blink mt-8">
          PRESS START TO CONTINUE
        </p>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-center text-[10px] font-pixel text-muted-foreground">
        <span>© 2025 WEEKEND WARRIOR</span>
      </div>
    </div>
  );
}
