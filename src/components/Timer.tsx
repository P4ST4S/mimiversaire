"use client";

import { useEffect, useRef, useCallback } from "react";

interface TimerProps {
  durationSeconds: number;
  onExpire: () => void;
  paused?: boolean;
  size?: number;
}

const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({
  durationSeconds,
  onExpire,
  paused = false,
  size = 80,
}: TimerProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const remainingRef = useRef<number>(durationSeconds);
  const lastTickRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const hasExpiredRef = useRef(false);

  const getColor = (remaining: number): string => {
    if (remaining <= 5) return "#E21B3C";
    if (remaining <= 10) return "#FFA602";
    return "#B8D0E8";
  };

  const updateDOM = useCallback(
    (remaining: number) => {
      const ratio = remaining / durationSeconds;
      const offset = CIRCUMFERENCE * (1 - ratio);
      const color = getColor(remaining);
      if (circleRef.current) {
        circleRef.current.setAttribute(
          "stroke-dashoffset",
          String(offset.toFixed(2))
        );
        circleRef.current.setAttribute("stroke", color);
      }
      if (textRef.current) {
        textRef.current.textContent = String(Math.ceil(remaining));
        textRef.current.setAttribute("fill", color);
      }
    },
    [durationSeconds]
  );

  useEffect(() => {
    remainingRef.current = durationSeconds;
    lastTickRef.current = Date.now();
    hasExpiredRef.current = false;
    updateDOM(durationSeconds);
  }, [durationSeconds, updateDOM]);

  useEffect(() => {
    if (paused) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTickRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      remainingRef.current = Math.max(0, remainingRef.current - delta);
      updateDOM(remainingRef.current);

      if (remainingRef.current <= 0) {
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpire();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, onExpire, updateDOM]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      aria-label="Timer"
      role="timer"
    >
      {/* Track */}
      <circle
        cx="40"
        cy="40"
        r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="6"
      />
      {/* Progress arc */}
      <circle
        ref={circleRef}
        cx="40"
        cy="40"
        r={RADIUS}
        fill="none"
        stroke="#B8D0E8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={String(CIRCUMFERENCE)}
        strokeDashoffset="0"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke 0.3s" }}
      />
      {/* Number */}
      <text
        ref={textRef}
        x="40"
        y="40"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#B8D0E8"
        fontSize="20"
        fontWeight="700"
        fontFamily="inherit"
      >
        {durationSeconds}
      </text>
    </svg>
  );
}
