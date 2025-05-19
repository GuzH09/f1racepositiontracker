export const revalidate = 604800;

import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ year: string; round: string }> }) {
  const { year, round } = await context.params;
  const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`, { next: { revalidate } });
  const data = await res.json();
  return NextResponse.json(data);
}
