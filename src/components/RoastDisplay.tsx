"use client";

import { motion } from "framer-motion";

interface RoastDisplayProps {
  roastText: string;
  correctAnswer: string;
  onContinue: () => void;
}

export default function RoastDisplay({
  roastText,
  correctAnswer,
  onContinue,
}: RoastDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, rotate: -4 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5 rounded-2xl px-8 py-14 text-center"
      style={{ background: "#E21B3C", border: "1px solid rgba(255,255,255,0.2)" }}
    >
      <span className="text-5xl mt-4">💀</span>
      <p
        className="font-bold text-white leading-snug"
        style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)" }}
      >
        {roastText}
      </p>
<motion.button
        onClick={onContinue}
        className="mt-2 mb-4 rounded-xl font-bold text-white text-lg bg-white/20 cursor-pointer"
        style={{ padding: "0.75rem 2.5rem" }}
        whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.3)" }}
        whileTap={{ scale: 0.97 }}
      >
        Réessaie →
      </motion.button>
    </motion.div>
  );
}
