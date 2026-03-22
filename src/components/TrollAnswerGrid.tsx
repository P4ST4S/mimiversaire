"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import AnswerButton from "./AnswerButton";
import type { AnswerLabel, AnswerState } from "./AnswerButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [nemesisClicks, setNemesisClicks] = useState(0);
  const [showNemesisPopup, setShowNemesisPopup] = useState(false);
  const [nemesisVanished, setNemesisVanished] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const NEMESIS_INDEX = 3;

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
    } else if (index === NEMESIS_INDEX) {
      const newCount = nemesisClicks + 1;
      setNemesisClicks(newCount);
      if (newCount >= 5) {
        setShowNemesisPopup(true);
      } else {
        setEscaped((prev) => ({ ...prev, [index]: randomPos() }));
      }
    } else {
      setEscaped((prev) => ({ ...prev, [index]: randomPos() }));
    }
  }

  function handleNemesisOui() {
    setShowNemesisPopup(false);
    setEscaped((prev) => ({ ...prev, [NEMESIS_INDEX]: randomPos() }));
  }

  function handleNemesisNon() {
    setShowNemesisPopup(false);
    setNemesisVanished(true);
    setEscaped((prev) => {
      const next = { ...prev };
      delete next[NEMESIS_INDEX];
      return next;
    });
  }

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-2 gap-3">
        {options.map((option, index) => {
          const label = LABELS[index];
          const state = answerStates[index] ?? "idle";
          if (!label) return null;

          const isEscaped = !!escaped[index];
          const isVanished = index === NEMESIS_INDEX && nemesisVanished;

          return (
            // Invisible placeholder keeps grid layout intact when button escapes/vanishes
            <div
              key={index}
              style={{
                display: "grid",
                ...(isEscaped || isVanished
                  ? { visibility: "hidden", pointerEvents: "none" }
                  : {}),
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

      {/* Nemesis popup after 5 clicks */}
      <Dialog open={showNemesisPopup} onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          className="bg-game-surface border-white/10 text-game-accent p-0 overflow-hidden"
        >
          <div
            style={{
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <DialogHeader className="gap-4">
              <DialogTitle className="text-game-accent text-lg">
                Conditions d&apos;accès requises
              </DialogTitle>
              <DialogDescription className="text-game-accent-2 leading-relaxed text-sm">
                Si tu veux choisir cette réponse, tu acceptes d&apos;abord de
                goûter un des plats de Aziz de la question précédente.
              </DialogDescription>
            </DialogHeader>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
            >
              <button
                onClick={handleNemesisNon}
                style={{ padding: "0.75rem 2rem" }}
                className="rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
              >
                Non merci
              </button>
              <button
                onClick={handleNemesisOui}
                style={{ padding: "0.75rem 2rem" }}
                className="rounded-lg font-bold text-white bg-green-700 hover:bg-green-800 transition-colors cursor-pointer"
              >
                Oui j&apos;accepte
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              onClick={() => handleClick(index)}
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
