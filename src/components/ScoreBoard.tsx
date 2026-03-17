"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/game-store";

interface ScoreBoardProps {
  score: number;
  totalQuestions: number;
}

function getVerdict(
  score: number,
  total: number
): { emoji: string; text: string } {
  const ratio = score / total;
  if (ratio >= 0.9) return { emoji: "🏆", text: "Légendaire !" };
  if (ratio >= 0.7) return { emoji: "🎉", text: "Excellent !" };
  if (ratio >= 0.5) return { emoji: "👍", text: "Pas mal !" };
  if (ratio >= 0.3) return { emoji: "😅", text: "Il faut réviser..." };
  return { emoji: "💀", text: "Tu ne mérites pas ton propre anniversaire" };
}

export default function ScoreBoard({ score, totalQuestions }: ScoreBoardProps) {
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  const { emoji, text } = getVerdict(score, totalQuestions);

  function handleReplay() {
    resetGame();
    router.push("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 rounded-2xl p-10 text-center"
      style={{ background: "#1B1D35", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <span className="text-6xl">{emoji}</span>

      <div>
        <p
          className="font-black text-game-accent"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <motion.span>{rounded}</motion.span>
          <span className="text-game-accent-2">/{totalQuestions}</span>
        </p>
        <p
          className="font-bold text-game-accent mt-1"
          style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
        >
          {text}
        </p>
      </div>

      {/* Stars */}
      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
            className="text-2xl"
          >
            {i < score ? "⭐" : "☆"}
          </motion.span>
        ))}
      </div>

      <p
        className="text-game-accent-2 font-semibold text-center leading-relaxed"
        style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}
      >
        C&apos;était un petit quizz de la part de la team Malveillance, encore bon anniversaire à notre Nami de France !
      </p>

      <motion.button
        onClick={handleReplay}
        className="mt-2 rounded-xl font-bold text-white text-lg cursor-pointer"
        style={{ background: "#1368CE", padding: "0.75rem 2.5rem" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Rejouer
      </motion.button>
    </motion.div>
  );
}
