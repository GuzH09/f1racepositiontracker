import RaceSelector from "@/components/client/race-selector";

interface RaceSelectorWrapperProps {
  year: string;
  round: string | undefined;
}

interface Race {
  round: string;
  raceName: string;
}

export default async function RaceSelectorWrapper({ year, round }: RaceSelectorWrapperProps) {
  // Fetch Races for the selected year
  const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races/?limit=100`, {
    next: {
      revalidate: 7 * 24 * 60 * 60,
    },
  });
  const data = await res.json();

  const racesList: Race[] = data.MRData.RaceTable.Races.map((r: any) => ({
    round: r.round,
    raceName: r.raceName,
  }));

  // Return RaceSelector Client Component
  return <RaceSelector year={year} round={round} races={racesList} />;
}
