import { Hero } from "@/components/home/Hero";
import { MapTeaser } from "@/components/home/MapTeaser";
import { ContestsTeaser } from "@/components/home/ContestsTeaser";
import { FeedTeaser } from "@/components/home/FeedTeaser";
import { parks } from "@/data/parks";
import { upcomingContests, pastContests } from "@/data/contests";

export default function Home() {
  const countryCount = new Set(parks.map((p) => p.country)).size;
  const contestCount = upcomingContests.length + pastContests.length;

  return (
    <>
      <Hero
        parkCount={parks.length}
        countryCount={countryCount}
        contestCount={contestCount}
      />
      <MapTeaser />
      <ContestsTeaser />
      <FeedTeaser />
    </>
  );
}
