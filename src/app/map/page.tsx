import type { Metadata } from "next";
import { MapShell } from "@/components/map/MapShell";

export const metadata: Metadata = {
  title: "Park map — CABLELINE",
  description:
    "An interactive world map of cable wakeboard parks. Tap any park to visit its site.",
};

export default function MapPage() {
  return <MapShell />;
}
