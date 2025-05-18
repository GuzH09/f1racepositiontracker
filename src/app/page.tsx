import { Card } from "@/components/ui/card";
import YearRaceSelector from "@/components/year-race-selector";

export default async function Home() {
  // Fetch all available seasons server-side
  const res = await fetch("https://api.jolpi.ca/ergast/f1/seasons/?limit=100");
  const data = await res.json();
  const seasons = data.MRData.SeasonTable.Seasons.map(
    (s: any) => s.season
  ).reverse();

  return (
    <main className="container mx-auto py-4 px-4">
      <h1 className="text-4xl font-bold mb-2">F1 Race Position Tracker</h1>
      <h2 className="text-lg mb-2">Made By GuzH</h2>
      <Card className="p-4 gap-2">
        <YearRaceSelector seasons={seasons} />
      </Card>
    </main>
  );
}
