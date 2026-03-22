"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import AnswerButton from "./AnswerButton";
import type { AnswerLabel, AnswerState } from "./AnswerButton";

const LABELS: AnswerLabel[] = ["A", "B", "C", "D"];
const DELAYS = [0, 0.08, 0.16, 0.24];

interface EscapedPos {
  top: number;
  left: number;
}

interface TrollAnswerGridProps {
  options: Array<{ label: string; text: string }>;
  correctIndex: number;
  onAnswer: (index: number) => void;
  answerStates: AnswerState[];
  isLocked: boolean;
}

function randomPos(): EscapedPos {
  const margin = 80;
  const w = typeof window !== "undefined" ? window.innerWidth : 800;
  const h = typeof window !== "undefined" ? window.innerHeight : 600;
  const btnWidth = Math.min(Math.max(240, w * 0.5 - 24), 362);
  const btnHeight = 76;
  return {
    top: margin + Math.random() * (h - margin * 2 - btnHeight),
    left: margin + Math.random() * (w - margin * 2 - btnWidth),
  };
}

export default function TrollAnswerGrid({
  options,
  correctIndex,
  onAnswer,
  answerStates,
  isLocked,
}: TrollAnswerGridProps) {
  const [escaped, setEscaped] = useState<Record<number, EscapedPos>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  // Force all cells to the exact same height as the tallest one
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cells = Array.from(grid.children) as HTMLElement[];
    // Reset first to measure natural heights
    cells.forEach((c) => (c.style.height = ""));
    const max = Math.max(...cells.map((c) => c.offsetHeight));
    // Explicit height (not minHeight) so children can resolve height: 100%
    cells.forEach((c) => (c.style.height = `${max}px`));
  }, [options]);

  function handleClick(index: number) {
    if (isLocked) return;
    if (index === correctIndex) {
      onAnswer(index);
    } else {
      setEscaped((prev) => ({ ...prev, [index]: randomPos() }));
    }
  }

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-2 gap-3">
        {options.map((option, index) => {
          const label = LABELS[index];
          const state = answerStates[index] ?? "idle";
          if (!label) return null;

          const isEscaped = !!escaped[index];

          return (
            // Invisible placeholder keeps grid layout intact when button escapes
            <div
              key={index}
              style={{
                display: "grid",
                ...(isEscaped ? { visibility: "hidden", pointerEvents: "none" } : {}),
              }}
            >
              <AnswerButton
                label={label}
                text={option.text}
                onClick={() => handleClick(index)}
                disabled={isLocked}
                state={state}
                delay={DELAYS[index] ?? 0}
              />
            </div>
          );
        })}
      </div>

      {/* Escaped buttons rendered at fixed positions */}
      {Object.entries(escaped).map(([idxStr, pos]) => {
        const index = Number(idxStr);
        const option = options[index];
        const label = LABELS[index];
        if (!option || !label) return null;

        return (
          <motion.div
            key={`troll-${index}`}
            style={{
              position: "fixed",
              width: "clamp(240px, calc(50vw - 1.5rem), 362px)",
              zIndex: 100,
            }}
            initial={{ top: pos.top, left: pos.left, scale: 0, opacity: 0 }}
            animate={{ top: pos.top, left: pos.left, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 22 }}
          >
            <AnswerButton
              label={label}
              text={option.text}
              onClick={() =>
                setEscaped((prev) => ({ ...prev, [index]: randomPos() }))
              }
              disabled={false}
              state="idle"
              delay={0}
            />
          </motion.div>
        );
      })}
    </>
  );
}
