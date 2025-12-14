import { ReactNode } from "react";

interface CRTOverlayProps {
  children: ReactNode;
}

export function CRTOverlay({ children }: CRTOverlayProps) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 starfield opacity-30" />

      {/* Main Content with CRT Effect */}
      <div className="relative crt-screen screen-glow min-h-screen">
        {children}
      </div>

      {/* Corner Decorations - Arcade Cabinet Feel */}
      <div className="fixed top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-foreground/30 pointer-events-none" />
      <div className="fixed top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-foreground/30 pointer-events-none" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-foreground/30 pointer-events-none" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-foreground/30 pointer-events-none" />
    </div>
  );
}
