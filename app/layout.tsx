import type { Metadata } from "next";
import "./globals.css";
import "./revamp.css";
import "./fieldwork.css";
import "./threshold.css";
import "./motion.css";
import "./identity.css";

export const metadata: Metadata = {
  title: "NoakPL | A place to begin",
  description: "A student-built place to explore finance roles and prepare for the conversations ahead.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
