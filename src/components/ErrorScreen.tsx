import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
  onHome: () => void;
}

export function ErrorScreen({ error, onRetry, onHome }: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Error Icon */}
        <div className="flex justify-center">
          <AlertTriangle className="w-16 h-16 text-arcade-red blink" />
        </div>

        {/* Error Title */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-pixel text-arcade-red">
            GAME OVER
          </h1>
          <p className="text-xs text-arcade-yellow">CONNECTION ERROR</p>
        </div>

        {/* Error Message */}
        <div className="pixel-border bg-card p-4">
          <p className="text-xs text-muted-foreground text-left font-mono">
            {error}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button onClick={onRetry} className="arcade-button w-full text-sm">
            <RefreshCw className="w-4 h-4 inline mr-2" />
            RETRY
          </button>

          <button
            onClick={onHome}
            className="arcade-button w-full text-sm bg-muted"
          >
            <Home className="w-4 h-4 inline mr-2" />
            MAIN MENU
          </button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-2">
          <p>Common issues:</p>
          <ul className="text-left space-y-1">
            <li>• GitHub token not configured</li>
            <li>• Username doesn't exist</li>
            <li>• Rate limit exceeded</li>
            <li>• Network connection issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
