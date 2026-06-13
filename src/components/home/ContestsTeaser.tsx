import Link from "next/link";
import { ArrowUpRight, CalendarDays, Trophy } from "lucide-react";
import { upcomingContests, pastContests } from "@/data/contests";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";
import { formatRange } from "@/lib/format";

export function ContestsTeaser() {
  const next = upcomingContests.slice(0, 3);
  const champs =
    pastContests
      .find((c) => c.id === "world-games-2025")
      ?.winners.filter((w) => w.division.includes("Gold")) ?? [];

  return (
    <section className="border-y border-shoal/60 bg-abyss/40">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="02 — the circuit"
          title={
            <>
              Contests &amp;
              <br />
              champions
            </>
          }
          sub="Every stop on the cable calendar, with links to register, plus the riders who took the podium last season."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* upcoming */}
          <Reveal>
            <h3 className="coords mb-4 flex items-center gap-2 text-cable">
              <CalendarDays size={14} /> coming up
            </h3>
            <ul className="space-y-3">
              {next.map((c) => (
                <li
                  key={c.id}
                  className="group rounded-xl border border-shoal/60 bg-deepwater/40 p-5 transition-colors hover:border-cable/50"
                >
                  <a href={c.website} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-spray">{c.name}</p>
                        <p className="mt-0.5 text-sm text-steel">
                          {c.venue ? `${c.venue} · ` : ""}
                          {c.location}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={18}
                        className="shrink-0 text-steel transition-colors group-hover:text-cable"
                      />
                    </div>
                    <p className="coords mt-3">{formatRange(c.startDate, c.endDate)}</p>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* reigning champions */}
          <Reveal delay={0.1}>
            <h3 className="coords mb-4 flex items-center gap-2 text-amber">
              <Trophy size={14} /> reigning — 2025 world games
            </h3>
            <div className="space-y-3">
              {champs.map((w) => (
                <div
                  key={w.division}
                  className="flex items-center justify-between rounded-xl border border-shoal/60 bg-deepwater/40 p-5"
                >
                  <div>
                    <p className="coords text-amber">{w.division.replace(" — Gold", "")}</p>
                    <p className="mt-1 font-display text-2xl uppercase text-spray">
                      {w.rider}
                    </p>
                  </div>
                  <span className="text-sm text-steel">{w.country}</span>
                </div>
              ))}
            </div>
            <Link
              href="/contests"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-steel/40 px-6 py-3 text-base font-semibold text-spray transition-colors hover:border-cable hover:text-cable"
            >
              See the full calendar
              <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
