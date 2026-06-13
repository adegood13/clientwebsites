"use client";

import { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowUpRight, Search, X } from "lucide-react";
import { parks } from "@/data/parks";
import type { Continent, Park } from "@/lib/types";

const cableIcon = L.divIcon({
  className: "",
  html: '<span class="cable-marker"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

const continents: (Continent | "All")[] = [
  "All",
  "North America",
  "Europe",
  "Asia",
  "Oceania",
  "Middle East",
  "Africa",
];

export default function WorldMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Continent | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parks
      .filter((p) => (filter === "All" ? true : p.continent === filter))
      .filter((p) =>
        q
          ? `${p.name} ${p.city} ${p.country} ${p.region}`
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, filter]);

  function flyTo(p: Park) {
    mapRef.current?.flyTo([p.lat, p.lng], 11, { duration: 1.1 });
  }

  return (
    <div className="grid h-[calc(100svh-60px)] grid-rows-[auto_1fr] lg:grid-cols-[380px_1fr] lg:grid-rows-1">
      {/* ---------------- sidebar ---------------- */}
      <aside className="flex min-h-0 flex-col border-b border-shoal/60 bg-deepwater lg:border-b-0 lg:border-r">
        <div className="border-b border-shoal/60 p-4">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parks, cities, countries…"
              className="w-full rounded-full border border-shoal/70 bg-abyss/60 py-2.5 pl-9 pr-9 text-sm text-spray placeholder:text-steel focus:border-cable focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-spray"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === c
                    ? "bg-cable text-deepwater"
                    : "bg-shoal/50 text-mist hover:bg-shoal"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="coords mt-3">
            {filtered.length} {filtered.length === 1 ? "park" : "parks"}
          </p>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto">
          {filtered.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => flyTo(p)}
                className="group flex w-full items-start justify-between gap-3 border-b border-shoal/40 px-4 py-3.5 text-left transition-colors hover:bg-shoal/30"
              >
                <span>
                  <span className="block font-semibold text-spray group-hover:text-cable">
                    {p.name}
                  </span>
                  <span className="coords mt-0.5 block normal-case tracking-normal text-steel">
                    {p.city}, {p.country}
                  </span>
                </span>
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cable/70 shadow-[0_0_8px_var(--cable)]" />
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-steel">
              No parks match that search yet. Try a different region — or add it.
            </li>
          )}
        </ul>
      </aside>

      {/* ---------------- map ---------------- */}
      <div className="relative min-h-[50vh]">
        <MapContainer
          ref={mapRef}
          center={[28, 10]}
          zoom={2}
          minZoom={2}
          worldCopyJump
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {filtered.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={cableIcon}>
              <Popup>
                <div className="min-w-[200px]">
                  <p className="font-display text-lg uppercase leading-tight text-spray">
                    {p.name}
                  </p>
                  <p className="mt-1 text-xs text-steel">
                    {p.city}
                    {p.region ? `, ${p.region}` : ""}, {p.country}
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-mist">{p.blurb}</p>
                  <p className="mt-2 inline-block rounded-full bg-shoal/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cable">
                    {p.system}
                  </p>
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-sm font-semibold text-cable hover:underline"
                  >
                    Visit website <ArrowUpRight size={14} />
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
