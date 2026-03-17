"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ClipPlayerProps {
  clipUrl: string;
  onContinue: () => void;
}

export default function ClipPlayer({ clipUrl, onContinue }: ClipPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      void videoRef.current.play().catch(() => {
        // Autoplay may be blocked — user can press play via controls
      });
    }
  }, [clipUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4"
    >
      <div className="w-full rounded-2xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={clipUrl}
          controls
          playsInline
          preload="metadata"
          className="w-full max-h-[60vh] object-contain"
        />
      </div>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
        onClick={onContinue}
        className="mt-2 rounded-xl font-bold text-white text-lg cursor-pointer"
        style={{ background: "#26890C", padding: "0.75rem 2.5rem" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Continuer →
      </motion.button>
    </motion.div>
  );
}
