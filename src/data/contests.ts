import type { PastContest, UpcomingContest } from "@/lib/types";

/**
 * Competitive cable wakeboard calendar. Winners are included only where they
 * could be verified against IWWF / WWA / official results; unverified results
 * are left out rather than guessed. Add new events as the season unfolds.
 *
 * Last reconciled: 2026-06.
 */

export const upcomingContests: UpcomingContest[] = [
  {
    id: "uswl-midwest-2026",
    name: "USWL Midwest Regional Wakepark Championships",
    series: "WWA US Wakepark League",
    location: "Rockford, Illinois, USA",
    venue: "West Rock Wake Park",
    startDate: "2026-06-19",
    endDate: "2026-06-21",
    website:
      "https://www.thewwa.com/event/uswl-midwest-regional-wakepark-championships/",
    status: "upcoming",
  },
  {
    id: "wwa-wakepark-nationals-2026",
    name: "WWA Wake Park National Championships",
    series: "WWA US Wakepark League",
    location: "USA",
    venue: "Shark Wake Park",
    startDate: "2026-08-08",
    endDate: "2026-08-11",
    website: "https://www.thewwa.com/wwa-wake-park-national-championships-schedule/",
    status: "upcoming",
  },
  {
    id: "iwwf-world-cable-2026",
    name: "IWWF World Cable Wakeboard & Wakeskate Championships",
    series: "IWWF World Title Event",
    location: "Beijing, China",
    venue: "Shun Yi Olympic Cable Park",
    startDate: "2026-08-08",
    endDate: "2026-08-15",
    website: "https://www.cablewakeboard.net/",
    status: "upcoming",
  },
  {
    id: "wps-stop4-alforsan-2026",
    name: "Wake Park World Series — Stop 4",
    series: "Wake Park World Series",
    location: "Abu Dhabi, UAE",
    venue: "Al Forsan",
    startDate: "2026-11-05",
    endDate: "2026-11-07",
    website: "https://www.cablewakeboard.net/",
    status: "upcoming",
  },
];

export const pastContests: PastContest[] = [
  // ------------------------------ 2025 ------------------------------
  {
    id: "world-games-2025",
    name: "Cable Wakeboard at the World Games",
    series: "IWGA / IWWF",
    year: 2025,
    location: "Chengdu, China",
    winners: [
      { division: "Men — Gold", rider: "Loïc Deschaux", country: "France" },
      { division: "Men — Silver", rider: "Max Milde", country: "Germany" },
      { division: "Men — Bronze", rider: "Florian Weiherer", country: "Germany" },
      { division: "Women — Gold", rider: "Julia Rick", country: "Germany" },
      { division: "Women — Silver", rider: "Vanessa Tittarelli", country: "Italy" },
      { division: "Women — Bronze", rider: "Sanne Meijer", country: "Netherlands" },
    ],
    website: "https://en.wikipedia.org/wiki/Wakeboarding_at_the_2025_World_Games",
  },
  {
    id: "euros-triolago-2025",
    name: "IWWF Europe & Africa Open Championships (Open Euros Triolago)",
    series: "IWWF Europe & Africa",
    year: 2025,
    location: "Riol, Germany",
    winners: [
      { division: "Open Women", rider: "Julia Rick", country: "Germany" },
    ],
    website: "https://www.cablewakeboard.net/news/2025_openeuros/",
  },
  {
    id: "asia-oceania-2025",
    name: "IWWF Asia & Oceania Cable Wakeboard Championships",
    series: "IWWF Asia & Oceania",
    year: 2025,
    location: "Angeles City (Clark), Philippines",
    winners: [
      { division: "Open Men", rider: "Raph Trinidad", country: "Philippines" },
    ],
    website:
      "https://www.cablewakeboard.net/news/asia-oceania-confederation-championships-2025/",
  },
  {
    id: "german-nationals-2025",
    name: "Deutsche Meisterschaft (German Cable Nationals)",
    series: "DWWV",
    year: 2025,
    location: "Germany",
    winners: [
      { division: "Open Men", rider: "Max Milde", country: "Germany" },
      { division: "Open Women", rider: "Julia Rick", country: "Germany" },
    ],
    website:
      "https://www.cablemekka.com/news/deutsche-meisterschaft-2025-nachbericht/",
  },
  // ------------------------------ 2024 ------------------------------
  {
    id: "world-cable-2024",
    name: "IWWF World Cable Wakeboard & Wakeskate Championships",
    series: "IWWF World Title Event",
    year: 2024,
    location: "Choisy-le-Roi (Paris), France",
    winners: [
      { division: "Open Men", rider: "Loïc Deschaux", country: "France" },
    ],
    website: "https://iwwf.sport/world-title-events/worldcablewake2024/",
  },
  {
    id: "euros-whitemills-2024",
    name: "IWWF Europe & Africa Open Championships (Euros Whitemills)",
    series: "IWWF Europe & Africa",
    year: 2024,
    location: "Sandwich, United Kingdom",
    winners: [
      { division: "Open Men", rider: "Max Milde", country: "Germany" },
      { division: "Open Women", rider: "Julia Rick", country: "Germany" },
    ],
    website:
      "https://www.cablewakeboard.net/news/thats-a-wrap-euros-whitemills-2024/",
  },
];
