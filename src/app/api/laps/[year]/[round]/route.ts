export const revalidate = 604800;

import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ year: string; round: string }> }) {
  const { year, round } = await context.params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "100";
  const offset = searchParams.get("offset");
  let url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/laps/?limit=${limit}`;
  if (offset) {
    url += `&offset=${offset}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}
