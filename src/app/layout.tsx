import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Assistant",
  description: "ElevenLabs Voice Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
