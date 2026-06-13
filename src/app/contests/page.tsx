import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { upcomingContests, pastContests } from "@/data/contests";
import { formatRange } from "@/lib/format";
import { Reveal } from "@/components/Reveal";
import type { PastContest } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contests — CABLELINE",
  description:
    "The cable wakeboard contest calendar: upcoming events with links plus past results and champions.",
};

export default function ContestsPage() {
  const years = Array.from(new Set(pastContests.map((c) => c.year))).sort(
    (a, b) => b - a,
  );

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8">
      <Reveal>
        <p className="coords mb-3 text-cable">the circuit</p>
        <h1 className="font-display text-[clamp(2.6rem,8vw,6rem)] uppercase leading-[0.92] text-spray">
          Contests &amp;
          <br />
          results
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-mist">
          Where the circuit stops next, and who stood on the podium last season.
          Winners are listed only where results are verified — more get added as
          each season wraps.
        </p>
      </Reveal>

      {/* ---------------- upcoming ---------------- */}
      <section className="mt-16">
        <Reveal>
          <h2 className="coords mb-5 flex items-center gap-2 text-cable">
            <CalendarDays size={14} /> upcoming
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingContests.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-shoal/60 bg-abyss/40 p-6 transition-colors hover:border-cable/50"
              >
                <div className="flex items-center justify-between">
                  <span className="coords text-steel">{c.series}</span>
                  {c.status === "ongoing" && (
                    <span className="flex items-center gap-1.5 rounded-full bg-coral/15 px-2 py-0.5 text-xs font-semibold text-coral">
                      <span className="live-dot h-1.5 w-1.5 rounded-full bg-coral" />
                      LIVE
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase leading-tight text-spray group-hover:text-cable">
                  {c.name}
                </h3>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-mist">
                  <MapPin size={14} className="text-steel" />
                  {c.venue ? `${c.venue} · ` : ""}
                  {c.location}
                </p>
                <p className="coords mt-2">{formatRange(c.startDate, c.endDate)}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-cable">
                  Event details
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- past results ---------------- */}
      {years.map((year) => (
        <section key={year} className="mt-16">
          <Reveal>
            <div className="cable-rule mb-8" />
            <h2 className="font-display text-4xl uppercase text-spray">
              {year} <span className="text-steel">season</span>
            </h2>
          </Reveal>
          <div className="mt-6 space-y-4">
            {pastContests
              .filter((c) => c.year === year)
              .map((c, i) => (
                <Reveal key={c.id} delay={i * 0.04}>
                  <ResultRow contest={c} />
                </Reveal>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ResultRow({ contest }: { contest: PastContest }) {
  return (
    <div className="rounded-2xl border border-shoal/60 bg-abyss/30 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="coords text-steel">{contest.series}</span>
          <h3 className="mt-1 font-display text-2xl uppercase leading-tight text-spray">
            {contest.name}
          </h3>
          <p className="mt-1 text-sm text-mist">{contest.location}</p>
        </div>
        <a
          href={contest.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-cable hover:underline"
        >
          Results <ArrowUpRight size={14} />
        </a>
      </div>

      {contest.winners.length > 0 && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {contest.winners.map((w) => (
            <li
              key={w.division}
              className="flex items-center justify-between gap-2 rounded-xl border border-shoal/50 bg-deepwater/50 px-4 py-3"
            >
              <div>
                <p className="coords text-amber">{w.division}</p>
                <p className="mt-0.5 font-semibold text-spray">{w.rider}</p>
              </div>
              <span className="text-xs text-steel">{w.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
