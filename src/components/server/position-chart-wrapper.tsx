import { PositionChart } from "@/components/client/position-chart";
import { Suspense } from "react";

interface PositionChartWrapperProps {
  year: string | undefined;
  round: string | undefined;
}

const teamColors: Record<string, string> = {
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

const defaultColors = [
  "#FF3838",
  "#3866FF",
  "#38FF38",
  "#FF38FF",
  "#FFFF38",
  "#38FFFF",
  "#FF9C38",
  "#9C38FF",
  "#FF3899",
  "#38FF9C",
  "#9CFF38",
  "#389CFF",
  "#FF6B38",
  "#6B38FF",
  "#38FF6B",
  "#FF38D4",
  "#D438FF",
  "#38D4FF",
  "#FFD438",
  "#D4FF38",
];

export default async function PositionChartWrapper({ year, round }: PositionChartWrapperProps) {
  let laps: any[] = [];
  const cfg: Record<string, { label: string; color: string }> = {};

  try {
    // Fetch Qualifying Results and Laps for the selected year and round
    const qRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`, {
      next: {
        revalidate: 7 * 24 * 60 * 60,
      },
    });

    if (!qRes.ok) {
      throw new Error(`Qualifying results fetch failed: ${qRes.status}`);
    }

    const qData = await qRes.json();
    const qualifying = qData.MRData.RaceTable.Races[0]?.QualifyingResults || [];

    // Build initial raw array: map driverId to code, track colors
    const codeMap: Record<string, string> = {};
    const colorMap: Record<string, string> = {};
    const rawRecords: {
      driver: string;
      lap: number;
      position: number;
      time: string;
    }[] = [];

    qualifying.forEach((r: any, i: number) => {
      const id = r.Driver.driverId;
      const code = r.Driver.code;
      const teamId = r.Constructor.constructorId;
      // store mapping and color by team (fallback to static colors)
      codeMap[id] = code;
      colorMap[code] = teamColors[teamId] || defaultColors[i % defaultColors.length];
      // starting position (Lap 0)
      rawRecords.push({
        driver: code,
        lap: 0,
        position: parseInt(r.position, 10),
        time: "",
      });
    });

    // Paginated Laps
    const limit = 100;
    const rRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/laps/?limit=${limit}`, {
      next: {
        revalidate: 7 * 24 * 60 * 60,
      },
    });

    if (!rRes.ok) {
      throw new Error(`Laps results fetch failed: ${rRes.status}`);
    }

    const rData = await rRes.json();

    const total = parseInt(rData.MRData.total, 10);
    const pages = Math.ceil(total / limit);
    const allLaps: any[] = [];

    // Paginated Laps with Offset
    for (let i = 0; i < pages; i++) {
      const offset = i * limit;
      const roRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/laps/?limit=${limit}&offset=${offset}`, {
        next: {
          revalidate: 7 * 24 * 60 * 60,
        },
      });

      if (!roRes.ok) {
        throw new Error(`Laps results fetch failed: ${roRes.status}`);
      }

      const roData = await roRes.json();
      allLaps.push(...(roData.MRData.RaceTable.Races[0]?.Laps || []));
    }

    // Flatten each Timing into rawRecords using codeMap
    allLaps.forEach((lap) => {
      const lapNum = parseInt(lap.number, 10);
      lap.Timings.forEach((t: any) => {
        const code = codeMap[t.driverId] || t.driverId;
        rawRecords.push({
          driver: code,
          lap: lapNum,
          position: parseInt(t.position, 10),
          time: t.time,
        });
      });
    });

    // Pivot into chart-compatible
    laps = Array.from(new Set(rawRecords.map((r) => r.lap)))
      .sort((a, b) => a - b)
      .map((lapNum) => {
        const byLap = rawRecords.filter((r) => r.lap === lapNum);
        const entry: any = { lap: lapNum, times: {} };
        byLap.forEach((r) => {
          entry[r.driver] = r.position;
          entry.times[r.driver] = r.time;
        });
        return entry;
      });

    // Build chart config using codes and colors
    const drivers = Object.keys(laps[0] || {}).filter((k) => k !== "lap" && k !== "times");
    drivers.forEach((code) => {
      cfg[code] = { label: code, color: colorMap[code] };
    });
  } catch (error) {
    console.error(error);
  }

  // Return PositionChart Client Component
  return <PositionChart laps={laps} cfg={cfg} />;
}
