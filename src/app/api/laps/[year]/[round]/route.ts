import { NextResponse, type NextRequest } from "next/server";

export const revalidate = 604800;
export const fetchCache = "force-cache";
export const dynamicParams = true;

export async function GET(request: NextRequest, { params }: { params: Promise<{ year: string; round: string }> }) {
  const { year, round } = await params;
  const urlObj = request.nextUrl;
  const limit = urlObj.searchParams.get("limit") || "100";
  const offset = urlObj.searchParams.get("offset");

  let url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps/?limit=${limit}`;
  if (offset) url += `&offset=${offset}`;

  console.log(url);
  const res = await fetch(url, { next: { revalidate } });
  const data = await res.json();

  return NextResponse.json(data, {
    headers: {
      // s-maxage is what Vercel’s CDN uses, stale-while-revalidate lets you serve
      // stale data while a background refresh is happening
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=3600`,
    },
  });
}
