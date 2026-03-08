"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  // 0: black
  // 1: flash lines
  // 2: text1 "君の退屈は、俺たちが倒す！"
  // 3: text2 "HEROES vs BOREDOM"
  // 4: logo reveal
  // 5: fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3600),
      setTimeout(() => setPhase(5), 5000),
      setTimeout(() => onComplete(), 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-700 ${
        phase >= 5 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        }}
      />

      {/* Flash lines effect */}
      {phase >= 1 && phase < 4 && (
        <>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500 opening-flash-h" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-red-500 opening-flash-v" />
        </>
      )}

      {/* Particle burst */}
      {phase >= 1 && phase < 5 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] bg-red-500/60 opening-particle"
              style={{
                left: `${50 + (Math.random() - 0.5) * 80}%`,
                top: `${50 + (Math.random() - 0.5) * 80}%`,
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${Math.random() * 1 + 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Red corner accents */}
      {phase >= 1 && phase < 5 && (
        <>
          <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-t-2 border-l-2 border-red-600 opening-corner-tl" />
          <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-t-2 border-r-2 border-red-600 opening-corner-tr" />
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-b-2 border-l-2 border-red-600 opening-corner-bl" />
          <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-b-2 border-r-2 border-red-600 opening-corner-br" />
        </>
      )}

      {/* Main text: 君の退屈は、俺たちが倒す！ */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        {phase >= 2 && phase < 5 && (
          <div className="opening-text-reveal">
            <p
              className="font-impact text-xl sm:text-3xl md:text-4xl text-white tracking-[0.15em] text-center leading-relaxed"
              style={{
                textShadow: "0 0 30px rgba(230,0,18,0.5), 0 0 60px rgba(230,0,18,0.2)",
              }}
            >
              君の退屈は、俺たちが倒す！
            </p>
          </div>
        )}

        {/* HEROES vs BOREDOM */}
        {phase >= 3 && phase < 5 && (
          <div className="opening-text-slam">
            <p
              className="font-impact text-4xl sm:text-6xl md:text-8xl text-transparent tracking-[0.1em] text-center"
              style={{
                WebkitTextStroke: "2px #e60012",
                textShadow: "0 0 40px rgba(230,0,18,0.6), 0 0 80px rgba(230,0,18,0.3)",
                filter: "drop-shadow(0 0 20px rgba(230,0,18,0.4))",
              }}
            >
              HEROES
              <span className="text-2xl sm:text-4xl md:text-5xl mx-3 sm:mx-4 text-white/30" style={{ WebkitTextStroke: "0px" }}>
                vs
              </span>
              BOREDOM
            </p>
          </div>
        )}

        {/* Logo */}
        {phase >= 4 && (
          <div className={`mt-4 opening-logo-rise ${phase >= 5 ? "opacity-0" : ""}`}>
            <Image
              src="/thesuperboyssama_logotype_color.png"
              alt="THE超BOYS"
              width={280}
              height={70}
              className="h-12 sm:h-16 w-auto"
              priority
            />
          </div>
        )}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
}
