"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

export default function SalamSticker() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Chaque propriété a sa propre durée → désynchronisées, organiques
      gsap.to(ref.current, {
        y: -14,
        duration: 3.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(ref.current, {
        x: 6,
        duration: 4.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(ref.current, {
        rotate: 3,
        duration: 5.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      style={{ display: "inline-block", cursor: "default" }}
    >
      <Image
        src="/salam.webp"
        alt="Salam !"
        width={160}
        height={160}
        priority
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }}
      />
    </div>
  );
}
