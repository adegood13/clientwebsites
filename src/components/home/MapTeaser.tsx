import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { parks } from "@/data/parks";
import type { Continent } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";
import { MiniConstellation } from "./MiniConstellation";

const order: Continent[] = [
  "North America",
  "Europe",
  "Asia",
  "Oceania",
  "Middle East",
  "Africa",
  "South America",
];

export function MapTeaser() {
  const byContinent = order
    .map((c) => ({ c, n: parks.filter((p) => p.continent === c).length }))
    .filter((x) => x.n > 0);

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="01 — the map"
        title={
          <>
            Every park,
            <br />
            one cable circuit
          </>
        }
        sub="Drop into the interactive world map and tap any park to head straight to its site. From Florida to the Philippines, the whole circuit is on one screen."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <Reveal>
          <MiniConstellation />
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="divide-y divide-shoal/60 overflow-hidden rounded-2xl border border-shoal/60">
            {byContinent.map(({ c, n }) => (
              <li key={c} className="flex items-center justify-between px-5 py-4">
                <span className="text-mist">{c}</span>
                <span className="font-display text-2xl text-cable">{n}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/map"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cable px-6 py-3 text-base font-semibold text-deepwater transition-transform hover:-translate-y-0.5"
          >
            Open the full map
            <ArrowUpRight size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
