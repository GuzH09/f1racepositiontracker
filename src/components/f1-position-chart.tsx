"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function F1PositionChart() {
  // const [processedData, setProcessedData] = useState([])
  // const [drivers, setDrivers] = useState({})
  // const [config, setConfig] = useState({})
  const [totalLaps, setTotalLaps] = useState(0)
  // const [hoveredDriver, setHoveredDriver] = useState(null)
  // const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  // const chartRef = useRef<HTMLDivElement>(null)

  // const processData = () => {
  //   // Extract lap data
  //   const laps = lapData.MRData.RaceTable.Races[0]?.Laps || []
  //   setTotalLaps(laps.length)

  //   // Extract qualifying data to get driver info and starting positions
  //   const qualifyingResults = qualifyingData.MRData.RaceTable.Races[0]?.QualifyingResults || []

  //   // Create a map of driver IDs to their info
  //   const driverMap: Record<string, DriverInfo> = {}

  //   // Define a set of distinct colors for the drivers
  //   const colors = [
  //     "#FF3838", // Red
  //     "#3866FF", // Blue
  //     "#38FF38", // Green
  //     "#FF38FF", // Magenta
  //     "#FFFF38", // Yellow
  //     "#38FFFF", // Cyan
  //     "#FF9C38", // Orange
  //     "#9C38FF", // Purple
  //     "#FF3899", // Pink
  //     "#38FF9C", // Mint
  //     "#9CFF38", // Lime
  //     "#389CFF", // Sky Blue
  //     "#FF6B38", // Coral
  //     "#6B38FF", // Indigo
  //     "#38FF6B", // Light Green
  //     "#FF38D4", // Hot Pink
  //     "#D438FF", // Violet
  //     "#38D4FF", // Light Blue
  //     "#FFD438", // Gold
  //     "#D4FF38", // Chartreuse
  //   ]

  //   // Populate driver map from qualifying data
  //   qualifyingResults.forEach((result, index) => {
  //     const driverId = result.Driver.driverId
  //     driverMap[driverId] = {
  //       code: result.Driver.code,
  //       name: `${result.Driver.givenName} ${result.Driver.familyName}`,
  //       constructor: result.Constructor.name,
  //       color: colors[index % colors.length],
  //     }
  //   })

  //   // Create processed data for the chart
  //   const processed: ProcessedData[] = []

  //   // Create "Lap 0" from qualifying data
  //   const lapZero: ProcessedData = { lap: 0 }
  //   qualifyingResults.forEach((result) => {
  //     const driverId = result.Driver.driverId
  //     lapZero[driverId] = Number.parseInt(result.position)
  //   })

  //   // Add Lap 0 to the beginning of the processed data
  //   processed.unshift(lapZero)

  //   laps.forEach((lap) => {
  //     const lapNumber = Number.parseInt(lap.number)
  //     const lapData: ProcessedData = { lap: lapNumber }

  //     lap.Timings.forEach((timing) => {
  //       const driverId = timing.driverId
  //       lapData[driverId] = Number.parseInt(timing.position)
  //     })

  //     processed.push(lapData)
  //   })

  //   // Create chart config
  //   const chartConfig: Record<string, { label: string; color: string }> = {}
  //   Object.entries(driverMap).forEach(([driverId, info]) => {
  //     chartConfig[driverId] = {
  //       label: `${info.code} (${info.constructor})`,
  //       color: info.color,
  //     }
  //   })

  //   setProcessedData(processed)
  //   setDrivers(driverMap)
  //   setConfig(chartConfig)
  // }

  return (
    <>
      <h3 className="text-xl font-semibold">Driver Positions by Lap</h3>
      <p className="text-sm text-gray-600">Total laps: {totalLaps} (Lap 0 = Starting Position)</p>

      {/* <div className="h-[600px] relative" ref={chartRef} onMouseMove={handleMouseMove}>
        {hoveredDriver && (
          <div
            className="absolute z-50 bg-white px-3 py-2 rounded-md shadow-md border pointer-events-none"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 40,
              borderColor: drivers[hoveredDriver]?.color || "#ccc",
              borderLeftWidth: "4px",
            }}
          >
            <div className="font-medium">{drivers[hoveredDriver]?.code}</div>
            <div className="text-sm">{drivers[hoveredDriver]?.name}</div>
            <div className="text-xs text-gray-600">{drivers[hoveredDriver]?.constructor}</div>
          </div>
        )}
        <ChartContainer config={config} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="lap"
                label={{ value: "Lap Number", position: "insideBottomRight", offset: -5 }}
                // Add ticks at regular intervals for better readability with many laps
                ticks={[
                  0,
                  ...Array.from({ length: Math.min(9, totalLaps) }, (_, i) =>
                    Math.round((i + 1) * (totalLaps / Math.min(9, totalLaps))),
                  ),
                ]}
              />
              <YAxis
                domain={[1, 20]}
                reversed={true}
                label={{ value: "Position", angle: -90, position: "insideLeft" }}
                ticks={[1, 5, 10, 15, 20]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const driverId = name as string
                      const driver = drivers[driverId]
                      if (driver) {
                        return [`Position: ${value}`, `${driver.code} - ${driver.name} (${driver.constructor})`]
                      }
                      return [`Position: ${value}`, driverId]
                    }}
                  />
                }
              />
              <Legend />
              {Object.keys(drivers).map((driverId) => (
                <Line
                  key={driverId}
                  type="monotone"
                  dataKey={driverId}
                  name={driverId}
                  stroke={drivers[driverId].color}
                  strokeWidth={2}
                  // Reduce dot size for better performance with many laps
                  dot={{ r: totalLaps > 30 ? 0 : 2 }}
                  // Enhanced active dot for better hover visibility
                  activeDot={{
                    r: 6,
                    stroke: "#fff",
                    strokeWidth: 2,
                    fill: drivers[driverId].color,
                  }}
                  connectNulls={true}
                  onMouseEnter={() => setHoveredDriver(driverId)}
                  onMouseLeave={() => setHoveredDriver(null)}
                  className="hover:cursor-pointer"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div> */}

      {/* <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Driver Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(drivers).map(([driverId, info]) => (
            <div
              key={driverId}
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 cursor-pointer"
              onMouseEnter={() => setHoveredDriver(driverId)}
              onMouseLeave={() => setHoveredDriver(null)}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: info.color }}></div>
              <span className="text-sm">
                {info.code} - {info.name}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </>
  )
}
