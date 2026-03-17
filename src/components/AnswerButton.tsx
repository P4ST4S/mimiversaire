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
  B: "#1368CE",
  C: "#26890C",
  D: "#FFA602",
};

function getAnimateProps(state: AnswerState) {
  if (state === "wrong") {
    return { x: [0, -8, 8, -8, 8, 0] };
  }
  if (state === "correct") {
    return { scale: [1, 1.05, 1] };
  }
  return {};
}

function getTransitionProps(state: AnswerState) {
  if (state === "wrong") return { duration: 0.4 };
  if (state === "correct") return { duration: 0.4, repeat: 1 };
  return {};
}

function getOverlayStyle(state: AnswerState): React.CSSProperties {
  if (state === "correct") return { boxShadow: "0 0 0 4px #26890C" };
  if (state === "reveal") return { boxShadow: "0 0 0 3px #26890C" };
  if (state === "wrong") return { opacity: 0.5 };
  return {};
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
      animate={{
        opacity: state === "wrong" ? 0.5 : 1,
        y: 0,
        ...getAnimateProps(state),
      }}
      transition={{
        opacity: { delay, duration: 0.25 },
        y: { delay, duration: 0.25 },
        ...getTransitionProps(state),
      }}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: bgColor,
        ...getOverlayStyle(state),
      }}
      className="relative flex items-center gap-3 w-full rounded-xl px-4 py-4 text-white font-bold cursor-pointer disabled:cursor-default border-2 border-transparent"
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-black/20 text-lg flex-shrink-0"
        aria-hidden="true"
      >
        {ICONS[label]}
      </span>
      <span
        className="text-left leading-tight"
        style={{ fontSize: "clamp(0.9rem, 2vw, 1.2rem)" }}
      >
        {text}
      </span>
    </motion.button>
  );
}
