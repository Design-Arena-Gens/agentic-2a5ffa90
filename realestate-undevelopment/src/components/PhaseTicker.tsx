"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PHASES, TIMELINE_DURATION } from "@/lib/timeline";

export const PhaseTicker = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const tick = () => {
      const elapsed = performance.now() / 1000;
      const loop = (elapsed % TIMELINE_DURATION) / TIMELINE_DURATION;
      setProgress(loop);
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const phase = useMemo(() => {
    return (
      PHASES.find((candidate) => progress >= candidate.start && progress < candidate.end) ??
      PHASES[PHASES.length - 1]
    );
  }, [progress]);

  const phaseProgress = useMemo(() => {
    const span = Math.max(phase.end - phase.start, 0.0001);
    const raw = (progress - phase.start) / span;
    return Math.min(1, Math.max(0, raw));
  }, [phase, progress]);

  return (
    <div className="inline-flex w-full max-w-2xl flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm uppercase tracking-[0.4em] text-slate-200/70">
          Development Timeline
        </span>
        <span className="text-sm text-slate-200/70">
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <motion.span
            key={phase.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-lg font-semibold text-white"
          >
            {phase.label}
          </motion.span>
          <motion.span
            key={`${phase.label}-description`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm text-slate-200/70"
          >
            {phase.description}
          </motion.span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
          <motion.span
            initial={false}
            animate={{ width: `${Math.min(100, Math.max(0, phaseProgress * 100))}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 via-sky-300 to-emerald-300 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
          />
        </div>
      </div>
    </div>
  );
};
