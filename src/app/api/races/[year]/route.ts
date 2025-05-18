export const revalidate = 604800;

import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ year: string }> }) {
  const { year } = await context.params;
  const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races/?limit=100`);
  const data = await res.json();
  return NextResponse.json(data);
}
