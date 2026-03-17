"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TextInputQuestionProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export default function TextInputQuestion({
  onSubmit,
  disabled,
}: TextInputQuestionProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 w-full"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Ta réponse..."
        autoFocus
        className="w-full max-w-md rounded-xl px-6 py-4 text-white font-bold text-center bg-game-surface border border-white/20 outline-none focus:border-game-accent-2 placeholder:text-white/30 disabled:opacity-50"
        style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)" }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-xl font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "#1368CE",
          padding: "0.75rem 2.5rem",
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
        }}
      >
        Valider →
      </button>
    </motion.form>
  );
}
