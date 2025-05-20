"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface YearSelectorProps {
  seasons: string[];
  year: string;
}

export default function YearSelector({ seasons, year }: YearSelectorProps) {
  const [selectedYear, setSelectedYear] = useState<string>(year);
  const router = useRouter();

  const handleValueChange = (value: string) => {
    setSelectedYear(value);
    router.push(`/?year=${value}`);
  };

  return (
    <div>
      <label htmlFor="year" className="text-sm font-medium">
        Year
      </label>
      <Select value={selectedYear} onValueChange={handleValueChange}>
        <SelectTrigger
          id="year"
          className="mt-1 w-[100px] rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
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
  );
}
