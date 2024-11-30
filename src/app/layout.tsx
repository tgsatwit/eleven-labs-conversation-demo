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
    <html lang="en" className="dark">
      <body className="antialiased bg-custom-dark min-h-screen">{children}</body>
    </html>
  )
}
