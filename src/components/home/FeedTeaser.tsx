import Link from "next/link";
import { Heart, MessageCircle, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

const sample = [
  {
    handle: "@finn.rides",
    park: "Wasserski Langenfeld",
    caption: "First clean 720 off the A-frame. Cable szn is officially open 🟢",
    likes: 248,
    comments: 19,
    tint: "from-cable/30 to-coral/20",
  },
  {
    handle: "@maya.wake",
    park: "CWC, Philippines",
    caption: "Sunset laps hit different out here. Who's coming to Bicol?",
    likes: 512,
    comments: 41,
    tint: "from-coral/30 to-amber/20",
  },
  {
    handle: "@parklife",
    park: "Cables Penrith",
    caption: "Rail line of the day. Swipe for the slow-mo 🎞️",
    likes: 173,
    comments: 8,
    tint: "from-cable/25 to-cable-deep/30",
  },
];

export function FeedTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="03 — the feed"
        title={
          <>
            Post your
            <br />
            sessions
          </>
        }
        sub="Build a profile, share clips and photos from the water, follow your favourite riders, and keep up with the scene between sets."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sample.map((p, i) => (
          <Reveal key={p.handle} delay={i * 0.08}>
            <article className="overflow-hidden rounded-2xl border border-shoal/60 bg-deepwater/40">
              <div className={`relative aspect-square bg-gradient-to-br ${p.tint}`}>
                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,transparent,rgba(6,20,27,0.55))]" />
                <span className="coords absolute bottom-3 left-4 text-spray/90">
                  {p.park}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-cable">{p.handle}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{p.caption}</p>
                <div className="mt-4 flex items-center gap-5 text-steel">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Heart size={15} /> {p.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MessageCircle size={15} /> {p.comments}
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 rounded-full bg-cable px-7 py-3.5 text-base font-semibold text-deepwater transition-transform hover:-translate-y-0.5"
          >
            Open the feed
            <ArrowUpRight size={18} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-steel/40 px-7 py-3.5 text-base font-semibold text-spray transition-colors hover:border-cable hover:text-cable"
          >
            Create your profile
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
