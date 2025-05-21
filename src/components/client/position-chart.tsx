"use client";
import type React from "react";
import { useState, useMemo } from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, LabelList } from "recharts";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface LapsObject {
  lap: number;
  times: Record<string, string>;
  [driverCode: string]: number | Record<string, string>;
}

interface PositionChartProps {
  laps: LapsObject[];
  cfg: Record<string, { label: string; color: string }>;
}

export function PositionChart({ laps, cfg }: PositionChartProps) {
  const [hoveredDriver, setHoveredDriver] = useState<string | null>();
  const [selectedRange, setSelectedRange] = useState<string>("All");

  const displayedData = useMemo(() => {
    if (!laps.length) return [];
    const total = laps.length;
    const segment = Math.ceil(total / 3);
    switch (selectedRange) {
      case "First third":
        return laps.slice(0, segment);
      case "Second third":
        return laps.slice(segment, segment * 2);
      case "Last third":
        return laps.slice(segment * 2);
      default:
        return laps;
    }
  }, [laps, selectedRange]);

  // Determine last lap per driver for retirement markers
  const retireLaps = useMemo(() => {
    const rl: Record<string, number> = {};
    laps.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "lap" && key !== "times" && entry[key] != null) {
          rl[key] = entry.lap;
        }
      });
    });
    return rl;
  }, [laps]);

  // Custom dot: larger for retirement, smaller otherwise
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const isRetire = retireLaps[dataKey] === payload.lap;
    return <circle cx={cx} cy={cy} r={isRetire ? 6 : 0} fill={cfg[dataKey].color} stroke="white" strokeWidth={isRetire ? 2 : 0} />;
  };

  // Tooltip showing lap times
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const lapEntry = laps.find((d) => d.lap === label);
    // show only hovered driver if hovering, else all
    const dataToShow = hoveredDriver ? payload.filter((pld: any) => pld.dataKey === hoveredDriver) : payload;
    return (
      <div className="bg-background border p-2 shadow-lg">
        <p className="font-medium">Lap {label}</p>
        {dataToShow.map((pld: any) => {
          const drv = pld.dataKey;
          const pos = pld.value;
          const time = lapEntry?.times[drv] || "";
          return (
            <div key={drv} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: pld.color }} />
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
  const minLap = laps[0]?.lap;
  const maxLap = laps[laps.length - 1]?.lap;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <CardTitle>Driver Positions by Lap</CardTitle>
          <CardDescription>Track the positions of drivers throughout the race.</CardDescription>
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
          <Select value={hoveredDriver || "All"} onValueChange={(val: string) => setHoveredDriver(val === "All" ? null : val)}>
            <SelectTrigger size="sm" className="w-fit">
              <SelectValue placeholder="All Drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {Object.keys(cfg)
                .sort((a, b) => (cfg[a].label as string).localeCompare(cfg[b].label as string))
                .map((drv) => (
                  <SelectItem key={drv} value={drv}>
                    {cfg[drv].label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-grow items-center justify-center">
        <ChartContainer config={cfg} className="aspect-auto h-full w-full">
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
            {Object.keys(cfg).map((drv) => (
              <Line
                key={drv}
                type="monotone"
                dataKey={drv}
                stroke={cfg[drv].color}
                strokeWidth={4}
                activeDot={false}
                dot={(dotProps) => {
                  const { key, ...rest } = dotProps;
                  return <CustomDot key={key} {...rest} />;
                }}
                onClick={() => setHoveredDriver(hoveredDriver === drv ? null : drv)}
                opacity={hoveredDriver && hoveredDriver !== drv ? 0.2 : 1}
              >
                <LabelList
                  content={(props: any) => {
                    const lap = laps[props.index]?.lap;
                    if (lap !== minLap) return null;
                    return (
                      <text x={(props.x ?? 0) - 8} y={props.y ?? 0} fill={cfg[drv].color} textAnchor="end">
                        {cfg[drv].label}
                      </text>
                    );
                  }}
                />
                <LabelList
                  content={(props: any) => {
                    const lap = laps[props.index]?.lap;
                    if (lap !== maxLap) return null;
                    return (
                      <text x={(props.x ?? 0) + 8} y={props.y ?? 0} fill={cfg[drv].color} textAnchor="start">
                        {cfg[drv].label}
                      </text>
                    );
                  }}
                />
              </Line>
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </>
  );
}
