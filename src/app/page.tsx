import { Card } from "@/components/ui/card";
import YearSelector from "@/components/client/year-selector";
import RaceSelectorWrapper from "@/components/server/race-selector-wrapper";
import PositionChartWrapper from "@/components/server/position-chart-wrapper";
import type { SVGProps } from "react";
import { Suspense } from "react";

const GitHub = (props: SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
      transform="scale(64)"
      fill="#ffff"
    />
  </svg>
);

const LinkedIn = (props: SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" {...props}>
    <path
      d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
      fill="#ffff"
    />
  </svg>
);

const ExternalLink = (props: SVGProps<SVGSVGElement>) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
      fill="#ffff"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

interface Season {
  season: string;
  url: string;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ year: string; round: string }> }) {
  let seasons: string[] = [];

  try {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/seasons/?limit=100", {
      next: {
        revalidate: 7 * 24 * 60 * 60,
      },
    });

    if (!res.ok) {
      throw new Error(`Seasons fetch failed: ${res.status}`);
    }

    const data = await res.json();
    seasons = data.MRData.SeasonTable.Seasons.map((s: Season) => s.season).reverse();
  } catch (error) {
    console.error(error);
  }

  const { year, round } = await searchParams;
  const selectedYear = year || seasons?.[0];
  const selectedRound = round || (seasons.length > 0 ? "1" : undefined);

  return (
    <main className="container mx-auto flex flex-col px-4 py-4 lg:h-[100dvh] lg:max-h-[100dvh]">
      <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold lg:text-4xl">F1 Race Position Tracker</h1>
          <h2 className="text-lg">Made By GuzH</h2>
        </div>
        <div className="flex items-center gap-2 lg:justify-center lg:space-x-4">
          {/* Disclaimer that the API used is Public & Link to Ergast API */}
          <span className="text-muted-foreground text-xs">
            Data comes from the public{" "}
            <a href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">
              Ergast API
            </a>
          </span>
          <div className="border-muted-foreground h-6 border-l" />
          {/* GitHub, LinkedIn, and Portfolio icons */}
          <a href="https://github.com/guzh09" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <GitHub className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </a>
          <a href="https://www.linkedin.com/in/hernan-agustin-otero-dev/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <LinkedIn className="h-6 w-6 text-blue-600 hover:text-blue-800" />
          </a>
          <a href="https://guzhotero.dev/" aria-label="Portfolio" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-6 w-6 text-green-600 hover:text-green-800" />
          </a>
        </div>
      </div>
      <Card className="flex h-[95dvh] flex-col gap-2 p-4 lg:h-auto lg:flex-grow">
        <div className="mb-2 flex gap-2">
          <YearSelector seasons={seasons} year={selectedYear} />
          <Suspense fallback={<div>Loading...</div>}>
            <RaceSelectorWrapper year={selectedYear} round={selectedRound} />
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <PositionChartWrapper year={selectedYear} round={selectedRound} />
        </Suspense>
      </Card>
    </main>
  );
}
