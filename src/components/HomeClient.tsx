"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/game-store";
import { initGameSession } from "@/lib/actions/game";

export default function HomeClient() {
  const router = useRouter();
  const initSession = useGameStore((s) => s.initSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setLoading(true);
    setError(null);
    const result = await initGameSession({});
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }
    initSession(result.data.sessionId, result.data.totalQuestions);
    router.push("/quiz");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={() => void handleStart()}
        disabled={loading}
        className="px-10 py-4 rounded-2xl font-black text-white text-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "#1368CE", fontSize: "clamp(1rem, 2.5vw, 1.4rem)" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        {loading ? "Chargement..." : "Démarrer le quiz 🎉"}
      </motion.button>
      {error && (
        <p className="text-sm text-red-400 font-semibold">
          Erreur : {error}
        </p>
      )}
    </div>
  );
}
