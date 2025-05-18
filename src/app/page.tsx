import { Card } from "@/components/ui/card";
import YearRaceSelector from "@/components/year-race-selector";

export default async function Home() {
  // Fetch all available seasons server-side
  const res = await fetch("https://api.jolpi.ca/ergast/f1/seasons/?limit=100", {
    cache: "force-cache",
    next: {
      revalidate: 7 * 24 * 60 * 60,
    },
  });
  const data = await res.json();
  const seasons = data.MRData.SeasonTable.Seasons.map((s: any) => s.season).reverse();

  return (
    <main className="container mx-auto px-4 py-4">
      <h1 className="mb-2 text-4xl font-bold">F1 Race Position Tracker</h1>
      <h2 className="mb-2 text-lg">Made By GuzH</h2>
      <Card className="gap-2 p-4">
        <YearRaceSelector seasons={seasons} />
      </Card>
    </main>
  );
}
