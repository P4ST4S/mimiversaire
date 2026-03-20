"use client";

import { motion } from "framer-motion";

export type AnswerLabel = "A" | "B" | "C" | "D";
export type AnswerState = "idle" | "selected" | "correct" | "wrong" | "reveal";

interface AnswerButtonProps {
  label: AnswerLabel;
  text: string;
  onClick: () => void;
  disabled: boolean;
  state: AnswerState;
  delay?: number;
}

const ICONS: Record<AnswerLabel, string> = {
  A: "△",
  B: "◯",
  C: "□",
  D: "✕",
};

const BG_COLORS: Record<AnswerLabel, string> = {
  A: "#E21B3C",
  B: "#88a2ee",
  C: "#26890C",
  D: "#FFA602",
};

type AnimateProps = {
  opacity: number;
  y: number;
  x?: number[];
  scale?: number[];
};

function getAnimateProps(state: AnswerState): AnimateProps {
  const base: AnimateProps = {
    opacity: state === "wrong" ? 0.5 : 1,
    y: 0,
  };
  if (state === "wrong") return { ...base, x: [0, -8, 8, -8, 8, 0] };
  if (state === "correct") return { ...base, scale: [1, 1.05, 1] };
  return base;
}

function getBoxShadow(state: AnswerState): string {
  if (state === "correct") return "0 0 0 4px #26890C";
  if (state === "reveal") return "0 0 0 3px #26890C";
  return "none";
}

export default function AnswerButton({
  label,
  text,
  onClick,
  disabled,
  state,
  delay = 0,
}: AnswerButtonProps) {
  const bgColor = BG_COLORS[label];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={getAnimateProps(state)}
      transition={{
        opacity: { delay, duration: 0.25 },
        y: { delay, duration: 0.25 },
      }}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className="relative flex items-center gap-5 w-full rounded-xl px-6 py-5 text-white font-bold cursor-pointer disabled:cursor-default border-2 border-transparent"
      style={{ backgroundColor: bgColor, boxShadow: getBoxShadow(state) }}
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-black/20 text-lg flex-shrink-0"
        aria-hidden="true"
      >
        {ICONS[label]}
      </span>
      <span
        className="text-left leading-snug py-1"
        style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)" }}
      >
        {text}
      </span>
    </motion.button>
  );
}
