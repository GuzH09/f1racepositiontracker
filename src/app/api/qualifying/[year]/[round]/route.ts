export const revalidate = 604800;

import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { year: string; round: string } }) {
  const { year, round } = await params;
  const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`);
  const data = await res.json();
  return NextResponse.json(data);
}
