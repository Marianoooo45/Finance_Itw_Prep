import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finance Interview Prep | Master Your Finance Career",
  description: "Ace your finance interviews with our comprehensive revision sheets, quizzes, and practice materials. Track your progress and build your daily streak.",
  keywords: "finance interview, investment banking, financial modeling, interview prep, finance quiz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
