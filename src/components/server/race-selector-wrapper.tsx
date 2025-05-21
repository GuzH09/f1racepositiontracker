import RaceSelector from "@/components/client/race-selector";

interface RaceSelectorWrapperProps {
  year: string | undefined;
  round: string | undefined;
}

interface Race {
  round: string;
  raceName: string;
}

export default async function RaceSelectorWrapper({ year, round }: RaceSelectorWrapperProps) {
  let racesList: Race[] = [];

  try {
    // Fetch Races for the selected year
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races/?limit=100`, {
      next: {
        revalidate: 7 * 24 * 60 * 60,
      },
    });

    if (!res.ok) {
      throw new Error(`Races fetch failed: ${res.status}`);
    }

    const data = await res.json();
    racesList = data.MRData.RaceTable.Races.map((r: Race) => ({
      round: r.round,
      raceName: r.raceName,
    }));
  } catch (error) {
    console.error(error);
  }

  // Return RaceSelector Client Component
  return <RaceSelector year={year} round={round} races={racesList} />;
}
