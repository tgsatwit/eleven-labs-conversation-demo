"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Play, HelpCircle, RefreshCw } from "lucide-react";

export default function Home() {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-16 lg:-mt-12">
        <div className="mb-6">
          <Image
            src="/logo512.png"
            alt="Gestalt Language Assistant Logo"
            width={128}
            height={128}
            className="rounded-xl"
          />
        </div>
        <h1 className="text-3xl text-center font-bold mb-4">
          Gestalts Language Coach Demo
        </h1>
        <p
          className={`text-center max-w-2xl mb-16 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          This demo showcases the AI-powered features of our platform. Try out
          the Language Coach for real-time guidance or the Play Analyzer for
          session feedback. For a full overview of the complete applications
          capabilities, visit our overview page.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Link href="/coach" className="group h-full">
            <div
              className={`cursor-pointer rounded-lg p-6 transition-all duration-200 h-full flex flex-col items-center justify-center
              ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50 shadow-md"
              }`}
            >
              <HelpCircle className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-300" />
              <h2 className="text-xl font-semibold mb-4">Language Coach</h2>
              <p
                className={`text-sm mb-2 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                Have a real-time conversation with an AI-powered
                Gestalt Language Processing. Get instant feedback and
                suggestions for supporting your childs language development.
              </p>
            </div>
          </Link>

          <Link href="/analyzer" className="group h-full">
            <div
              className={`cursor-pointer rounded-lg p-6 transition-all duration-200 h-full flex flex-col items-center justify-center
              ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50 shadow-md"
              }`}
            >
              <RefreshCw className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-300" />
              <h2 className="text-xl font-semibold mb-4">Play Analyzer</h2>
              <p
                className={`text-sm mb-2 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                Live record or upload recordings of play sessions for detailed
                analysis. Receive structured feedback on interaction patterns
                and language development opportunities.
              </p>
            </div>
          </Link>

          <div
            onClick={toggleModal}
            className={`cursor-pointer rounded-lg p-6 transition-all duration-200 h-full flex flex-col items-center justify-center
            ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50 shadow-md"
            }`}
          >
            <Play className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-300" />
            <h2 className="text-xl font-semibold mb-4">Watch Overview</h2>
            <p
              className={`text-sm mb-2 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Watch a brief video overview of the Gestalt Language Coach to
              understand its features and benefits.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-2">
            NB: Users are required to login to manage token usage.
          </p>
          <Link
            href="/overview"
            className={`text-sm underline transition-colors
              ${
                theme === "dark"
                  ? "text-gray-300 hover:text-gray-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Learn More: Full Application Overview →
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden relative max-w-3xl w-full">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 z-10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              &times;
            </button>
            <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1920/1080' }}>
              <iframe 
                src="https://share.synthesia.io/embeds/videos/1724e132-d5cc-43cf-844a-f45264040848?autoplay=1" 
                loading="lazy" 
                title="Synthesia video player - Supporting Parents Beyond Therapy Sessions" 
                allowFullScreen 
                allow="encrypted-media; fullscreen;" 
                style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, overflow: 'hidden' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
