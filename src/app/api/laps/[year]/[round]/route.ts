// 2) tell Next.js to revalidate (i.e. refresh) this at most once per week
export const revalidate = 604800;

import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ year: string; round: string }> }) {
  const { year, round } = await context.params;
  const { searchParams } = new URL(request.url);

  const limit = searchParams.get("limit") || "100";
  const offset = searchParams.get("offset");

  let url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps/?limit=${limit}`;
  if (offset) url += `&offset=${offset}`;

  // 3) fetch external data (no in-memory cache needed—Edge caching will handle this)
  const res = await fetch(url, { next: { revalidate } });
  const data = await res.json();

  // 4) return JSON
  return NextResponse.json(data);
}
