import { F1PositionChart } from "@/components/f1-position-chart"

export default async function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2">F1 Race Position Tracker</h1>
      <h2 className="text-lg mb-6">Made By GuzH</h2>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <F1PositionChart/>
      </section>
    </main>
  )
}

// async function fetchAllLapData() {
//   // Initial request to get total count
//   const initialResponse = await fetch("https://api.jolpi.ca/ergast/f1/2025/6/laps/?limit=1")
//   const initialData = await initialResponse.json()

//   // Extract total number of laps
//   const total = Number.parseInt(initialData.MRData.total)
//   const limit = 100

//   // Calculate number of requests needed
//   const requestsNeeded = Math.ceil(total / limit)

//   // Create an array of promises for all requests
//   const requests = []
//   for (let i = 0; i < requestsNeeded; i++) {
//     const offset = i * limit
//     const url = `https://api.jolpi.ca/ergast/f1/2025/6/laps/?limit=${limit}&offset=${offset}`
//     requests.push(fetch(url).then((res) => res.json()))
//   }

//   // Wait for all requests to complete
//   const responses = await Promise.all(requests)

//   // Combine all lap data
//   const combinedLapData = {
//     MRData: {
//       RaceTable: {
//         Races: [
//           {
//             Laps: [],
//           },
//         ],
//       },
//     },
//   }

//   // Extract and combine lap data from all responses
//   for (const response of responses) {
//     if (response.MRData.RaceTable.Races[0]?.Laps) {
//       combinedLapData.MRData.RaceTable.Races[0].Laps.push(...response.MRData.RaceTable.Races[0].Laps)
//     }
//   }

//   // Sort laps by lap number to ensure correct order
//   combinedLapData.MRData.RaceTable.Races[0].Laps.sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))

//   return combinedLapData
// }
