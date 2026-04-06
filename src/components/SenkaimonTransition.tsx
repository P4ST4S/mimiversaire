"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SenkaimonTransitionProps {
  isActive: boolean;
}

/**
 * Senkaimon (穿界門) gate transition — Bleach-themed fullscreen overlay.
 * Opens the gate between the Human World and Soul Society before navigating
 * to /bon-anniversaire.
 */
export default function SenkaimonTransition({
  isActive,
}: SenkaimonTransitionProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<
    "idle" | "darken" | "gate" | "open" | "flash" | "done"
  >("idle");

  useEffect(() => {
    if (!isActive) return;

    // Sequence: darken → gate appears → doors open → flash → navigate
    setPhase("darken");

    const t1 = setTimeout(() => setPhase("gate"), 400);
    const t2 = setTimeout(() => setPhase("open"), 1000);
    const t3 = setTimeout(() => setPhase("flash"), 2200);
    const t4 = setTimeout(() => {
      setPhase("done");
      router.push("/bon-anniversaire");
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isActive, router]);

  return (
    <AnimatePresence>
      {isActive && phase !== "idle" && (
        <motion.div
          key="senkaimon-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#000",
            }}
          />

          {/* Reiatsu particles */}
          <ReitatsuParticles visible={true} />

          {/* Spiritual pressure screen shake */}
          <motion.div
            animate={
              phase === "darken" || phase === "gate"
                ? {
                    x: [0, -2, 3, -1, 2, -3, 1, 0],
                    y: [0, 1, -2, 3, -1, 2, -2, 0],
                  }
                : { x: 0, y: 0 }
            }
            transition={{
              duration: 0.6,
              repeat: phase === "darken" || phase === "gate" ? Infinity : 0,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Senkaimon gate frame */}
            <AnimatePresence>
              {(phase === "gate" || phase === "open" || phase === "flash") && (
                <motion.div
                  key="gate-frame"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{
                    opacity: phase === "flash" ? 0 : 1,
                    scaleY: 1,
                  }}
                  transition={{
                    opacity: { duration: phase === "flash" ? 0.3 : 0.5 },
                    scaleY: {
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  style={{
                    position: "relative",
                    width: "min(80vw, 500px)",
                    height: "min(85vh, 700px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Outer frame — ornate gold border */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "3px solid #C9A84C",
                      boxShadow:
                        "0 0 30px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.15), inset 0 0 30px rgba(201,168,76,0.1)",
                    }}
                  />

                  {/* Inner frame accent */}
                  <div
                    style={{
                      position: "absolute",
                      inset: "8px",
                      border: "1px solid rgba(201,168,76,0.4)",
                    }}
                  />

                  {/* Corner ornaments */}
                  <GateCorners />

                  {/* Top kanji label */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    style={{
                      position: "absolute",
                      top: "-60px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        color: "#C9A84C",
                        fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                        fontWeight: 700,
                        letterSpacing: "0.3em",
                        textShadow:
                          "0 0 20px rgba(201,168,76,0.6), 0 0 40px rgba(201,168,76,0.3)",
                      }}
                    >
                      誕生日
                    </span>
                    <span
                      style={{
                        color: "#E8D5A3",
                        fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                        letterSpacing: "0.25em",
                        opacity: 0.7,
                        textTransform: "uppercase",
                      }}
                    >
                      Senkaimon
                    </span>
                  </motion.div>

                  {/* Gate interior — the light behind the doors */}
                  <div
                    style={{
                      position: "absolute",
                      inset: "12px",
                      overflow: "hidden",
                      background: "#000",
                    }}
                  >
                    {/* Bright light visible as doors open */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity:
                          phase === "open" ? 0.8 : phase === "flash" ? 1 : 0.1,
                      }}
                      transition={{ duration: 0.8 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "radial-gradient(ellipse at center, #fff 0%, rgba(201,168,76,0.6) 30%, rgba(201,168,76,0.2) 60%, transparent 80%)",
                      }}
                    />

                    {/* Left door */}
                    <motion.div
                      initial={{ x: "0%" }}
                      animate={{
                        x:
                          phase === "open" || phase === "flash"
                            ? "-100%"
                            : "0%",
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "50%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, #0E1420 0%, #1C2340 80%, #2a3060 100%)",
                        borderRight: "1px solid rgba(201,168,76,0.3)",
                        zIndex: 1,
                      }}
                    >
                      <DoorPanel side="left" />
                    </motion.div>

                    {/* Right door */}
                    <motion.div
                      initial={{ x: "0%" }}
                      animate={{
                        x:
                          phase === "open" || phase === "flash" ? "100%" : "0%",
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "50%",
                        height: "100%",
                        background:
                          "linear-gradient(270deg, #0E1420 0%, #1C2340 80%, #2a3060 100%)",
                        borderLeft: "1px solid rgba(201,168,76,0.3)",
                        zIndex: 1,
                      }}
                    >
                      <DoorPanel side="right" />
                    </motion.div>

                    {/* Center seam glow (visible before doors open) */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity:
                          phase === "gate" ? 0.8 : phase === "open" ? 0.3 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "4px",
                        height: "100%",
                        background:
                          "linear-gradient(180deg, transparent, #C9A84C, #E8D5A3, #C9A84C, transparent)",
                        boxShadow: "0 0 20px rgba(201,168,76,0.8)",
                        zIndex: 2,
                      }}
                    />
                  </div>

                  {/* Bottom label */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === "flash" ? 0 : 0.6 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    style={{
                      position: "absolute",
                      bottom: "-32px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "#E8D5A3",
                      fontSize: "clamp(0.5rem, 1vw, 0.65rem)",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Passage vers la Soul Society
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Full-screen white flash before navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "flash" || phase === "done" ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, #fff, rgba(232,213,163,0.8))",
              zIndex: 10,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

/** Decorative panels on each door half */
function DoorPanel({ side }: { side: "left" | "right" }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(12px, 3vh, 24px)",
        padding: "10%",
      }}
    >
      {/* Vertical ornamental line */}
      <div
        style={{
          width: "1px",
          height: "30%",
          background:
            "linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)",
        }}
      />
      {/* Door kanji */}
      <span
        style={{
          color: "rgba(201,168,76,0.2)",
          fontSize: "clamp(2rem, 6vw, 4rem)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {side === "left" ? "魂" : "界"}
      </span>
      {/* Vertical ornamental line */}
      <div
        style={{
          width: "1px",
          height: "30%",
          background:
            "linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent)",
        }}
      />
    </div>
  );
}

/** Ornate corner pieces for the gate frame */
function GateCorners() {
  const size = 28;
  const positions = [
    { top: -2, left: -2, bw: "3px 0 0 3px" },
    { top: -2, right: -2, bw: "3px 3px 0 0" },
    { bottom: -2, left: -2, bw: "0 0 3px 3px" },
    { bottom: -2, right: -2, bw: "0 3px 3px 0" },
  ] as const;

  return (
    <>
      {positions.map((pos, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderColor: "#E8D5A3",
            borderStyle: "solid",
            borderWidth: pos.bw,
            zIndex: 3,
            ...Object.fromEntries(
              Object.entries(pos).filter(([k]) => k !== "bw"),
            ),
          }}
        />
      ))}
    </>
  );
}

/** Floating spiritual energy particles */
function ReitatsuParticles({ visible }: { visible: boolean }) {
  // Generate deterministic particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    size: 2 + (i % 4),
    delay: (i * 0.15) % 2,
    duration: 2 + (i % 3),
  }));

  if (!visible) return null;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -60 - p.size * 10],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#C9A84C",
            boxShadow: `0 0 ${p.size * 3}px rgba(201,168,76,0.6)`,
          }}
        />
      ))}
    </div>
  );
}
