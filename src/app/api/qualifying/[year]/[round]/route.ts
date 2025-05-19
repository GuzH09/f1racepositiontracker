import { NextResponse, type NextRequest } from "next/server";

export const revalidate = 604800;
export const fetchCache = "force-cache";
export const dynamicParams = true;

export async function GET(request: NextRequest, { params }: { params: { year: string; round: string } }) {
  const { year, round } = await params;

  const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying/`, { next: { revalidate } });
  const data = await res.json();

  return NextResponse.json(data);
}
