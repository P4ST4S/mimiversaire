"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Trophy, PartyPopper, ThumbsUp, Brain, Skull, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SenkaimonTransition from "./SenkaimonTransition";

interface ScoreBoardProps {
  score: number;
  totalQuestions: number;
}

function getVerdict(
  score: number,
  total: number,
): { Icon: LucideIcon; color: string; text: string } {
  const ratio = score / total;
  if (ratio >= 0.9) return { Icon: Trophy,      color: "#f59e0b", text: "Légendaire !" };
  if (ratio >= 0.7) return { Icon: PartyPopper, color: "#88a2ee", text: "Excellent !" };
  if (ratio >= 0.5) return { Icon: ThumbsUp,    color: "#26890C", text: "Pas mal !" };
  if (ratio >= 0.3) return { Icon: Brain,        color: "#f97316", text: "Il faut réviser..." };
  return           { Icon: Skull,        color: "#E21B3C", text: "Tu ne mérites pas ton propre anniversaire" };
}

export default function ScoreBoard({ score, totalQuestions }: ScoreBoardProps) {
  const [transitioning, setTransitioning] = useState(false);

  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  const { Icon, color, text } = getVerdict(score, totalQuestions);

  function handleSuivant() {
    setTransitioning(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 rounded-2xl text-center"
      style={{
        background: "#1B1D35",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "3.5rem 2rem",
      }}
    >
      <Icon size={64} color={color} strokeWidth={1.5} />

      <p
        className="font-bold text-game-accent mt-1"
        style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
      >
        {text}
      </p>

      {/* Stars */}
      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
          >
            <Star
              size={24}
              fill={i < score ? "#f59e0b" : "none"}
              color={i < score ? "#f59e0b" : "#4b5563"}
              strokeWidth={1.5}
            />
          </motion.span>
        ))}
      </div>

      <p
        className="text-game-accent font-semibold text-center leading-relaxed"
        style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}
      >
        C&apos;était un petit quizz de la part de la team Malveillance, encore
        bon anniversaire à notre Nami de France !
        <br />
        <span className="text-game-accent-2" style={{ fontSize: "0.9rem" }}>
          (Tu peux me donner 10k exp stp, ça serait sympa)
        </span>
      </p>

      <motion.button
        onClick={handleSuivant}
        disabled={transitioning}
        className="mt-2 rounded-xl font-bold text-white text-lg cursor-pointer"
        style={{
          background: transitioning ? "#5a6ea0" : "#88a2ee",
          padding: "0.75rem 2.5rem",
        }}
        whileHover={transitioning ? {} : { scale: 1.04 }}
        whileTap={transitioning ? {} : { scale: 0.97 }}
      >
        Suivant →
      </motion.button>

      <SenkaimonTransition isActive={transitioning} />
    </motion.div>
  );
}
