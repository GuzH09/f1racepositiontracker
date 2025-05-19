// 2) tell Next.js to revalidate (i.e. refresh) this at most once per week
export const revalidate = 604800;

import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ year: string; round: string }> }) {
  const { year, round } = await context.params;

  // 3) fetch external data (no in-memory cache needed—Edge caching will handle this)
  const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`, { next: { revalidate } });
  const data = await res.json();

  // 4) return JSON
  return NextResponse.json(data);
}
