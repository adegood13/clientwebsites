"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100svh-60px)] items-center justify-center bg-deepwater">
      <p className="coords animate-pulse text-cable">loading the circuit…</p>
    </div>
  ),
});

export function MapShell() {
  return <WorldMap />;
}
