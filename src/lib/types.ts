export type Park = {
  id: string;
  name: string;
  city: string;
  region: string;
  country: string;
  continent: Continent;
  lat: number;
  lng: number;
  website: string;
  system: string;
  blurb: string;
};

export type Continent =
  | "North America"
  | "South America"
  | "Europe"
  | "Africa"
  | "Middle East"
  | "Asia"
  | "Oceania";

export type Winner = {
  division: string;
  rider: string;
  country: string;
};

export type UpcomingContest = {
  id: string;
  name: string;
  series: string;
  location: string;
  venue?: string;
  startDate: string;
  endDate?: string;
  website: string;
  status: "upcoming" | "ongoing";
};

export type PastContest = {
  id: string;
  name: string;
  series: string;
  year: number;
  location: string;
  winners: Winner[];
  website: string;
};
