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
    <main className="container mx-auto flex flex-col px-4 py-4 lg:h-[100dvh] lg:max-h-[100dvh]">
      <h1 className="mb-2 text-4xl font-bold">F1 Race Position Tracker</h1>
      <h2 className="mb-2 text-lg">Made By GuzH</h2>
      <Card className="flex h-[95dvh] flex-col gap-2 p-4 lg:h-auto lg:flex-grow">
        <YearRaceSelector seasons={seasons} />
      </Card>
    </main>
  );
}
