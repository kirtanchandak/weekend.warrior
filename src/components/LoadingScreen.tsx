import { useState, useEffect } from "react";
import { LOADING_MESSAGES } from "@/data/mockData";

interface LoadingScreenProps {
  onComplete: () => void;
  isDataReady: boolean;
}

export function LoadingScreen({ onComplete, isDataReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Progress bar animation - slows down near the end if data isn't ready
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Cap at 100%
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }

        // If we're past 90% and data isn't ready, slow down dramatically
        if (prev >= 90 && !isDataReady) {
          return Math.min(prev + 0.5, 100); // Very slow progress, but never exceed 100
        }

        // Normal progress speed
        return Math.min(prev + 2, 100); // Never exceed 100
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onComplete, isDataReady]);

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      setDisplayedText("");
    }, 1500);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    // Typewriter effect for current message
    const message = LOADING_MESSAGES[messageIndex];
    if (displayedText.length < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(message.slice(0, displayedText.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, messageIndex]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Spinning Loader */}
        <div className="flex justify-center">
          <div
            className="w-16 h-16 border-4 border-arcade-cyan border-t-transparent animate-spin"
            style={{ animationDuration: "1s" }}
          />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="pixel-border bg-background p-1">
            <div
              className="h-6 bg-gradient-to-r from-arcade-green to-arcade-cyan transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs md:text-sm font-pixel">
            <span className="text-muted-foreground">LOADING</span>
            <span className="text-arcade-yellow">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="h-16 flex items-center justify-center">
          <p className="text-sm md:text-base font-pixel text-arcade-cyan">
            {displayedText}
            <span className="blink">█</span>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 ${
                i < Math.floor(progress / 12.5) ? "bg-arcade-green" : "bg-muted"
              }`}
              style={{ transition: "background-color 0.2s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
