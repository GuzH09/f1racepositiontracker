export const revalidate = 7 * 24 * 60 * 60;

import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { year: string; round: string } }) {
  const { year, round } = await params;
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
