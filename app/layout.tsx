import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { LayoutNavigation } from "@/components/layout-navigation";

export const metadata: Metadata = {
  title: "Fitness Dashboard",
  description: "Track your fitness journey with personalized workouts and progress tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{fontFamily: 'Inter, sans-serif'}} suppressHydrationWarning>
        <Providers>
          {children}
          <LayoutNavigation />
        </Providers>
      </body>
    </html>
  );
}
