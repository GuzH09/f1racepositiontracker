"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface RaceSelectorProps {
  year: string;
  round: string | undefined;
  races: Race[];
}

interface Race {
  round: string;
  raceName: string;
}

export default function RaceSelector({ year, round, races }: RaceSelectorProps) {
  const [selectedRace, setSelectedRace] = useState<string>(round || "");
  const router = useRouter();

  const handleValueChange = (value: string) => {
    setSelectedRace(value);
    router.push(`/?year=${year}&round=${value}`);
  };

  return (
    <div className="w-full">
      <label htmlFor="race" className="text-sm font-medium">
        Race
      </label>
      <Select value={selectedRace} onValueChange={handleValueChange} disabled={!year}>
        <SelectTrigger
          id="race"
          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
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
  );
}
