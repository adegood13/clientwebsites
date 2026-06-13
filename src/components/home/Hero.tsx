"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, ArrowRight } from "lucide-react";

type Props = {
  parkCount: number;
  countryCount: number;
  contestCount: number;
};

export function Hero({ parkCount, countryCount, contestCount }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[calc(100svh-60px)] flex-col justify-center overflow-hidden">
      {/* ---------- atmosphere ---------- */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(120%_90%_at_50%_-10%,#0e3340_0%,#082029_45%,#06141b_100%)]" />
      {/* dawn glow */}
      <div className="absolute left-1/2 top-[-12%] -z-20 h-[55vh] w-[120vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,92,58,0.22),rgba(45,226,200,0.08)_55%,transparent_75%)] blur-2xl" />

      {/* ---------- water ---------- */}
      <Water reduce={!!reduce} />

      {/* ---------- the cable rig ---------- */}
      <CableRig reduce={!!reduce} />

      {/* ---------- content ---------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="coords mb-5 flex items-center gap-2"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cable" />
          51.1167°N, 6.9244°E — the cable circuit, worldwide
        </motion.p>

        <h1 className="font-display text-[clamp(3.2rem,12vw,9.5rem)] uppercase text-spray">
          <RevealLine reduce={!!reduce} delay={0.15}>
            Ride the
          </RevealLine>
          <RevealLine reduce={!!reduce} delay={0.3}>
            <span className="relative inline-block text-cable">
              cable
              <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-cable shadow-[0_0_18px_var(--cable)]" />
            </span>{" "}
            line
          </RevealLine>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-mist sm:text-xl"
        >
          No boat. No engine. Just a cable, a kicker, and a whole planet of
          parks. Find every cable park, follow the contest circuit, and share
          your sessions — all in one place.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/map"
            className="group inline-flex items-center gap-2 rounded-full bg-cable px-7 py-3.5 text-base font-semibold text-deepwater transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MapPin size={18} />
            Explore the map
          </Link>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 rounded-full border border-steel/40 px-7 py-3.5 text-base font-semibold text-spray transition-colors hover:border-cable hover:text-cable"
          >
            Join the feed
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* live stat ticker */}
        <motion.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.95 }}
          className="mt-14 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-shoal/60 bg-shoal/30 backdrop-blur-sm"
        >
          <Stat value={parkCount} label="parks mapped" />
          <Stat value={countryCount} label="countries" />
          <Stat value={contestCount} label="contests tracked" />
        </motion.dl>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <span className="coords flex flex-col items-center gap-2 text-steel">
          scroll
          <span className="block h-8 w-px animate-float bg-gradient-to-b from-cable to-transparent" />
        </span>
      </div>
    </section>
  );
}

function RevealLine({
  children,
  delay,
  reduce,
}: {
  children: React.ReactNode;
  delay: number;
  reduce: boolean;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-deepwater/40 px-5 py-4">
      <dd className="font-display text-3xl text-cable sm:text-4xl">{value}</dd>
      <dt className="coords mt-1">{label}</dt>
    </div>
  );
}

/* ---------------- water layers ---------------- */
function Water({ reduce }: { reduce: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 -z-10 h-[42vh]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#041017] via-[#06202b]/80 to-transparent" />
      {/* drifting ripple bands */}
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          className="absolute inset-x-0"
          style={{
            bottom: `${8 + i * 22}%`,
            animation: reduce ? undefined : `water-drift ${22 + i * 9}s linear infinite`,
            opacity: 0.35 - i * 0.08,
          }}
          width="200%"
          height="40"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 20 Q180 4 360 20 T720 20 T1080 20 T1440 20 T1800 20 T2160 20"
            fill="none"
            stroke="var(--cable)"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

/* ---------------- the cable rig ---------------- */
function CableRig({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {/* towers + cable */}
      <div className="absolute left-0 right-0 top-[26%]">
        <div className="relative mx-auto h-px w-full bg-gradient-to-r from-transparent via-cable/70 to-transparent shadow-[0_0_12px_rgba(45,226,200,0.5)]" />
        {/* towers */}
        <div className="absolute left-[6%] top-0 h-24 w-px bg-steel/40" />
        <div className="absolute right-[6%] top-0 h-24 w-px bg-steel/40" />
      </div>

      {/* kicker at centre */}
      <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2">
        <div className="h-0 w-0 border-b-[26px] border-l-[60px] border-b-cable/25 border-l-transparent" />
      </div>

      {/* the travelling rig */}
      <div
        className="absolute left-0 top-[26%] h-0 w-0"
        style={{ animation: reduce ? undefined : "rig-run 9s linear infinite" }}
      >
        {/* carrier on the cable */}
        <div className="absolute -top-1 h-2 w-5 -translate-x-1/2 rounded-sm bg-cable shadow-[0_0_12px_var(--cable)]" />
        {/* rope */}
        <div
          className="absolute left-0 top-0 h-[150px] w-px origin-top -translate-x-1/2 bg-cable/50"
          style={{ animation: reduce ? undefined : "rope-stretch 9s ease-in-out infinite" }}
        />
        {/* rider */}
        <div
          className="absolute -translate-x-1/2"
          style={{
            top: 150,
            animation: reduce ? undefined : "rider-pop 9s ease-in-out infinite",
          }}
        >
          <Rider />
          {/* spray */}
          {!reduce &&
            [...Array(7)].map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-7 block h-1 w-1 rounded-full bg-spray"
                style={
                  {
                    "--sx": `${(i - 3) * 10}px`,
                    "--sy": `${-22 - (i % 3) * 10}px`,
                    animation: "spray-burst 9s ease-out infinite",
                  } as React.CSSProperties
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function Rider() {
  return (
    <svg width="44" height="56" viewBox="0 0 44 56" fill="none" aria-hidden="true">
      {/* board */}
      <rect
        x="4"
        y="44"
        width="36"
        height="6"
        rx="3"
        fill="var(--coral)"
        transform="rotate(-6 22 47)"
      />
      {/* body */}
      <path
        d="M22 16c2.4 0 4.3-1.9 4.3-4.3S24.4 7.4 22 7.4s-4.3 1.9-4.3 4.3S19.6 16 22 16Z"
        fill="var(--spray)"
      />
      <path
        d="M22 17c-3 0-5 2-5.5 5l-2 11c-.3 1.7.6 2.6 1.8 4.2l4 6c.6.9 2 .9 2.6 0l-2-9 2.4-7 2.6 7.4c.4 1.2 1.7 1.6 2.7 1l4-2.4c1-.6 1.2-1.8.5-2.7l-3-3.6-1.8-9c-.6-3-2.3-5-6.3-5Z"
        fill="var(--spray)"
      />
    </svg>
  );
}
