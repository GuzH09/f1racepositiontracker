"use client";

import { useState, useEffect } from "react";
import { F1PositionChart } from "@/components/f1-position-chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface YearRaceSelectorProps {
  seasons: string[];
}

interface Race {
  round: string;
  raceName: string;
}

export default function YearRaceSelector({ seasons }: YearRaceSelectorProps) {
  const defaultYear = seasons[0];
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>("");

  useEffect(() => {
    async function fetchRaces() {
      try {
        // Fetch all races from the selected year
        const res = await fetch(
          `https://api.jolpi.ca/ergast/f1/${selectedYear}/races/?limit=100`
        );
        const data = await res.json();

        const racesList: Race[] = data.MRData.RaceTable.Races.map((r: any) => ({
          round: r.round,
          raceName: r.raceName,
        }));

        setRaces(racesList);
        setSelectedRace(racesList[0]?.round || "");
      } catch (error) {
        console.error("Error fetching races:", error);
        setRaces([]);
        setSelectedRace("");
      }
    }

    if (selectedYear) {
      fetchRaces();
    }
  }, [selectedYear]);

  const teamColors = {
    mercedes: "#00A19B", // Tiffany Green
    ferrari: "#EF1A2D", // Ferrari Red
    mclaren: "#FF8700", // McLaren Orange
    alpine: "#479fc4", // Alpine Blue
    haas: "#9e9e9e", // Haas Gray
    williams: "#00A0DD", // Williams Blue
    aston_martin: "#006F62", // Aston Martin Green
    red_bull: "#2c4991", // Red Bull Yellow
    rb: "#ffffff", // Alias for Red Bull
    sauber: "#1c8f18", // Kick Green
  };

  return (
    <>
      <div className="flex gap-2 mb-2">
        <div>
          <label htmlFor="year" className="text-sm font-medium">
            Year
          </label>
          <Select
            value={selectedYear}
            onValueChange={(value: string) => setSelectedYear(value)}
          >
            <SelectTrigger
              id="year"
              className="mt-1 w-[100px] rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="w-[100px]">
              {seasons.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <label htmlFor="race" className="text-sm font-medium">
            Race
          </label>
          <Select
            value={selectedRace}
            onValueChange={(value: string) => setSelectedRace(value)}
            disabled={!selectedYear}
          >
            <SelectTrigger
              id="race"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            >
              <SelectValue placeholder="Select race" />
            </SelectTrigger>
            <SelectContent>
              {races.map((race) => (
                <SelectItem key={race.round} value={race.round}>
                  {race.round}. {race.raceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedYear && selectedRace && (
        <F1PositionChart
          year={selectedYear}
          round={selectedRace}
          teamColors={teamColors}
        />
      )}
    </>
  );
}
