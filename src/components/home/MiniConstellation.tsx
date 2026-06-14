"use client";

import { motion, useReducedMotion } from "motion/react";
import { parks } from "@/data/parks";

/**
 * A stylized scatter of every park projected (equirectangular) onto a panel —
 * a "constellation" of the cable circuit. Not a real map; that lives at /map.
 */
export function MiniConstellation() {
  const reduce = useReducedMotion();
  const W = 100;
  const H = 50;

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-shoal/60 bg-[radial-gradient(120%_120%_at_30%_10%,#0c2a36,#06141b)]">
      {/* faint lat/long grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="none" viewBox="0 0 100 50">
        {[10, 20, 30, 40].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--steel)" strokeWidth="0.2" />
        ))}
        {[20, 40, 60, 80].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="50" stroke="var(--steel)" strokeWidth="0.2" />
        ))}
      </svg>

      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {parks.map((p, i) => {
          const x = ((p.lng + 180) / 360) * W;
          const y = ((90 - p.lat) / 180) * H;
          return (
            <motion.circle
              key={p.id}
              cx={x}
              cy={y}
              r={0.55}
              fill="var(--cable)"
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              whileInView={{ opacity: 0.9, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.012, 1) }}
            />
          );
        })}
      </svg>

      {/* glow vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,transparent_55%,rgba(6,20,27,0.7))]" />
    </div>
  );
}
