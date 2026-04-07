"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  openingUrl: string;
  messageUrl: string;
  ostUrl: string;
}

type Phase = "opening" | "loading" | "message";

export default function BonAnniversaireClient({
  openingUrl,
  messageUrl,
  ostUrl,
}: Props) {
  const [phase, setPhase] = useState<Phase>("opening");
  const [volume, setVolume] = useState(0.2);
  const [muted, setMuted] = useState(false);
  const openingRef = useRef<HTMLVideoElement>(null);
  const messageRef = useRef<HTMLVideoElement>(null);
  const ostRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (ostRef.current) {
      ostRef.current.volume = 0.2;
      ostRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (ostRef.current) {
      ostRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (openingRef.current) {
      openingRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (phase === "loading") {
      const timer = setTimeout(() => setPhase("message"), 5000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "message" && messageRef.current) {
      messageRef.current.play().catch(() => {});
    }
  }, [phase]);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0A0A0F" }}
    >
      {/* Background OST */}
      <audio ref={ostRef} src={ostUrl} loop />

      {/* Volume control */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(14,20,32,0.85)",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: "2px",
          padding: "8px 14px",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={() => setMuted((m) => !m)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#C9A84C",
            fontSize: "1.1rem",
            lineHeight: 1,
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
          aria-label={muted ? "Activer le son" : "Couper le son"}
        >
          {muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (v > 0 && muted) setMuted(false);
          }}
          style={{
            width: "90px",
            accentColor: "#C9A84C",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Kanji watermark */}
      <span
        aria-hidden
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-cinzel, serif)",
          fontSize: "clamp(200px, 35vw, 480px)",
          color: "#C9A84C",
          opacity: 0.04,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          lineHeight: 1,
          zIndex: 0,
          userSelect: "none",
        }}
      >
        魂
      </span>

      {/* Top ornamental line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8D5A3 50%, #C9A84C 70%, transparent 100%)",
          opacity: 0.6,
          zIndex: 1,
        }}
      />
      {/* Bottom ornamental line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8D5A3 50%, #C9A84C 70%, transparent 100%)",
          opacity: 0.6,
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-3xl px-4"
      >
        {/* Title block */}
        <div className="flex flex-col items-center gap-3">
          {/* Division label */}
          <p
            style={{
              fontFamily: "var(--font-cinzel, serif)",
              color: "#C9A84C",
              fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            センさん、ありがとう — Palais du Roi des Âmes
          </p>

          {/* Horizontal divider */}
          <div
            style={{
              width: "clamp(160px, 30vw, 280px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #C9A84C 40%, #C9A84C 60%, transparent)",
              opacity: 0.5,
            }}
          />

          {/* Main title */}
          <h1
            style={{
              fontFamily: "var(--font-cinzel, serif)",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              color: "#C9A84C",
              textShadow:
                "0 0 20px rgba(201,168,76,0.45), 0 0 40px rgba(201,168,76,0.2), 0 0 80px rgba(201,168,76,0.08)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            ミミちゃん
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-cinzel, serif)",
              color: "#E8D5A3",
              fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
              letterSpacing: "0.15em",
              opacity: 0.75,
              textAlign: "center",
            }}
          >
            Un message des Ombres te parvient depuis le Seireitei
          </p>

          {/* Horizontal divider */}
          <div
            style={{
              width: "clamp(160px, 30vw, 280px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #C9A84C 40%, #C9A84C 60%, transparent)",
              opacity: 0.5,
            }}
          />
        </div>

        {/* Video container */}
        <div
          className="relative w-full"
          style={{
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "2px",
            overflow: "hidden",
            boxShadow:
              "0 0 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(201,168,76,0.1)",
          }}
        >
          {/* Corner accents */}
          <CornerAccents />

          <AnimatePresence mode="wait">
            {phase === "opening" && (
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <video
                  ref={openingRef}
                  src={openingUrl}
                  loop
                  muted
                  playsInline
                  autoPlay
                  className="w-full"
                  style={{
                    display: "block",
                    maxHeight: "65vh",
                    objectFit: "contain",
                    background: "#000",
                  }}
                />
              </motion.div>
            )}
            {phase === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  minHeight: "30vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.5rem",
                  padding: "3rem 2rem",
                  background: "#000",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cinzel, serif)",
                    color: "#C9A84C",
                    fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    textShadow: "0 0 12px rgba(201,168,76,0.4)",
                  }}
                >
                  Transmission du Seireitei...
                </p>

                {/* Track */}
                <div
                  style={{
                    width: "clamp(200px, 50vw, 420px)",
                    height: "4px",
                    background: "rgba(201,168,76,0.15)",
                    borderRadius: "2px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Corner marks on track */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #A07830, #C9A84C, #E8D5A3, #C9A84C)",
                      boxShadow:
                        "0 0 8px rgba(201,168,76,0.7), 0 0 20px rgba(201,168,76,0.3)",
                      borderRadius: "2px",
                    }}
                  />
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-cinzel, serif)",
                    color: "#E8D5A3",
                    fontSize: "clamp(0.65rem, 1.2vw, 0.78rem)",
                    letterSpacing: "0.2em",
                    opacity: 0.5,
                  }}
                >
                  センさん、ありがとう — Transmission en cours
                </p>
              </motion.div>
            )}
            {phase === "message" && (
              <motion.div
                key="message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <video
                  ref={messageRef}
                  src={messageUrl}
                  controls
                  playsInline
                  autoPlay
                  className="w-full"
                  style={{
                    display: "block",
                    maxHeight: "65vh",
                    objectFit: "contain",
                    background: "#000",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA button */}
        <AnimatePresence>
          {phase === "opening" && (
            <motion.button
              key="btn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              onClick={() => setPhase("loading")}
              whileHover={{
                scale: 1.04,
                boxShadow:
                  "0 0 24px rgba(201,168,76,0.5), 0 0 48px rgba(201,168,76,0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "transparent",
                border: "1px solid rgba(201,168,76,0.7)",
                color: "#E8D5A3",
                fontFamily: "var(--font-cinzel, serif)",
                fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                letterSpacing: "0.12em",
                padding: "0.85rem 2.8rem",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
            >
              Ouvrir le message
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function CornerAccents() {
  const cornerStyle = (pos: "tl" | "tr" | "bl" | "br") => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 16,
      height: 16,
      borderColor: "#C9A84C",
      borderStyle: "solid",
      opacity: 0.6,
      zIndex: 2,
    };
    const positions: Record<string, React.CSSProperties> = {
      tl: { top: -1, left: -1, borderWidth: "2px 0 0 2px" },
      tr: { top: -1, right: -1, borderWidth: "2px 2px 0 0" },
      bl: { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" },
      br: { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" },
    };
    return { ...base, ...positions[pos] };
  };

  return (
    <>
      <span style={cornerStyle("tl")} />
      <span style={cornerStyle("tr")} />
      <span style={cornerStyle("bl")} />
      <span style={cornerStyle("br")} />
    </>
  );
}
