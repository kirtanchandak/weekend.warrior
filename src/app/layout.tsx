import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weekend Warrior - GitHub Edition",
  description:
    "A retro-style game that analyzes your GitHub weekend coding activity",
  keywords: ["github", "coding", "weekend", "stats", "retro", "game"],
  authors: [{ name: "Weekend Warrior Team" }],
  openGraph: {
    title: "Weekend Warrior - GitHub Edition",
    description:
      "Discover your weekend coding patterns with this retro-style GitHub analyzer",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
