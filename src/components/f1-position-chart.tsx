"use client";
import type React from "react";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Assign colors for drivers
const colors = [
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

export function F1PositionChart({
  year,
  round,
  teamColors = {},
}: {
  year: string;
  round: string;
  teamColors?: Record<string, string>;
}) {
  const [chartData, setChartData] = useState<
    ({ lap: number; times: Record<string, string> } & Record<string, number>)[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<
    Record<string, { label: string; color: string }>
  >({});
  const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>("All");
  const displayedData = useMemo(() => {
    if (!chartData.length) return [];
    const total = chartData.length;
    const segment = Math.ceil(total / 3);
    switch (selectedRange) {
      case "First third":
        return chartData.slice(0, segment);
      case "Second third":
        return chartData.slice(segment, segment * 2);
      case "Last third":
        return chartData.slice(segment * 2);
      default:
        return chartData;
    }
  }, [chartData, selectedRange]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (!year || !round) return;
      try {
        // 1) Qualifying for Lap 0
        const qRes = await fetch(`/api/qualifying/${year}/${round}`);
        const qJson = await qRes.json();
        const qualifying =
          qJson.MRData.RaceTable.Races[0]?.QualifyingResults || [];

        // build initial raw array: map driverId to code, track colors
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
          colorMap[code] = teamColors[teamId] || colors[i % colors.length];
          // starting position (Lap 0)
          rawRecords.push({
            driver: code,
            lap: 0,
            position: parseInt(r.position, 10),
            time: "",
          });
        });

        // 2) Paginated laps (throttled)
        const limit = 100;
        const initRes = await fetch(
          `/api/laps/${year}/${round}?limit=${limit}`
        );
        const initJson = await initRes.json();
        const total = parseInt(initJson.MRData.total, 10);
        const pages = Math.ceil(total / limit);
        const allLaps: any[] = [];
        for (let i = 0; i < pages; i++) {
          const offset = i * limit;
          const res = await fetch(
            `/api/laps/${year}/${round}?limit=${limit}&offset=${offset}`
          );
          const data = await res.json();
          allLaps.push(...(data.MRData.RaceTable.Races[0]?.Laps || []));
          // pause to avoid rate limits: max ~3 requests/sec
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        // flatten each Timing into rawRecords using codeMap
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

        // pivot into chart-compatible
        const laps = Array.from(new Set(rawRecords.map((r) => r.lap)))
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

        setChartData(laps);

        // build config using codes and colors
        const cfg: Record<string, { label: string; color: string }> = {};
        const drivers = Object.keys(laps[0] || {}).filter(
          (k) => k !== "lap" && k !== "times"
        );
        drivers.forEach((code) => {
          cfg[code] = { label: code, color: colorMap[code] };
        });
        setConfig(cfg);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error("Error loading chart data", e);
      }
    }
    loadData();
  }, [year, round, teamColors]);

  // determine last lap per driver for retirement markers
  const retireLaps = useMemo(() => {
    const rl: Record<string, number> = {};
    chartData.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "lap" && key !== "times" && entry[key] != null) {
          rl[key] = entry.lap;
        }
      });
    });
    return rl;
  }, [chartData]);

  // custom dot: larger for retirement, smaller otherwise
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const isRetire = retireLaps[dataKey] === payload.lap;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isRetire ? 6 : 0}
        fill={config[dataKey].color}
        stroke="white"
        strokeWidth={isRetire ? 2 : 0}
      />
    );
  };

  // Tooltip showing lap times
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const lapEntry = chartData.find((d) => d.lap === label);
    // show only hovered driver if hovering, else all
    const dataToShow = hoveredDriver
      ? payload.filter((pld: any) => pld.dataKey === hoveredDriver)
      : payload;
    return (
      <div className="bg-background border p-2 shadow-lg">
        <p className="font-medium">Lap {label}</p>
        {dataToShow.map((pld: any) => {
          const drv = pld.dataKey;
          const pos = pld.value;
          const time = lapEntry?.times[drv] || "";
          return (
            <div key={drv} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: pld.color }}
              />
              <span>
                {drv}: P{pos}
              </span>
              <small className="text-muted-foreground text-xs">{time}</small>
            </div>
          );
        })}
      </div>
    );
  };

  // Determine first and last lap for label positioning
  const minLap = chartData[0]?.lap;
  const maxLap = chartData[chartData.length - 1]?.lap;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <CardTitle>Driver Positions by Lap</CardTitle>
          <CardDescription>
            Track the positions of drivers throughout the race.
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Lap range selector */}
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger size="sm" className="w-fit">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="First third">First third</SelectItem>
              <SelectItem value="Second third">Second third</SelectItem>
              <SelectItem value="Last third">Last third</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>

          {/* Driver selector */}
          <Select
            value={hoveredDriver || "All"}
            onValueChange={(val: string) =>
              setHoveredDriver(val === "All" ? null : val)
            }
          >
            <SelectTrigger size="sm" className="w-fit">
              <SelectValue placeholder="All Drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {Object.keys(config)
                .sort((a, b) =>
                  (config[a].label as string).localeCompare(
                    config[b].label as string
                  )
                )
                .map((drv) => (
                  <SelectItem key={drv} value={drv}>
                    {config[drv].label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex min-h-[66dvh] items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer
            config={config}
            className="max-h-[90dvh] min-h-[60dvh] w-full"
          >
            <LineChart data={displayedData}>
              <CartesianGrid strokeDasharray="3" />
              <XAxis dataKey="lap" padding={{ left: 2, right: 2 }} />
              <YAxis domain={[1, 20]} reversed={true} hide={true} />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="center"
                height={70}
                wrapperStyle={{
                  display: "flex",
                  justifyContent: "center",
                }}
              />
              {Object.keys(config).map((drv) => (
                <Line
                  key={drv}
                  type="monotone"
                  dataKey={drv}
                  stroke={config[drv].color}
                  strokeWidth={4}
                  activeDot={false}
                  dot={(dotProps) => {
                    const { key, ...rest } = dotProps;
                    return <CustomDot key={key} {...rest} />;
                  }}
                  onClick={() =>
                    setHoveredDriver(hoveredDriver === drv ? null : drv)
                  }
                  opacity={hoveredDriver && hoveredDriver !== drv ? 0.2 : 1}
                >
                  <LabelList
                    content={(props: any) => {
                      const lap = chartData[props.index]?.lap;
                      if (lap !== minLap) return null;
                      return (
                        <text
                          x={(props.x ?? 0) - 8}
                          y={props.y ?? 0}
                          fill={config[drv].color}
                          textAnchor="end"
                        >
                          {config[drv].label}
                        </text>
                      );
                    }}
                  />
                  <LabelList
                    content={(props: any) => {
                      const lap = chartData[props.index]?.lap;
                      if (lap !== maxLap) return null;
                      return (
                        <text
                          x={(props.x ?? 0) + 8}
                          y={props.y ?? 0}
                          fill={config[drv].color}
                          textAnchor="start"
                        >
                          {config[drv].label}
                        </text>
                      );
                    }}
                  />
                </Line>
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </>
  );
}
