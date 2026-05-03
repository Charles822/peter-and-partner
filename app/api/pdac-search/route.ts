import { NextResponse } from "next/server";
import { searchPdacCourses } from "@/lib/search-pdac";

export async function POST(req: Request) {
  let body: { query?: unknown; maxResults?: unknown };
  try {
    body = (await req.json()) as { query?: unknown; maxResults?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const q =
    typeof body.query === "string" ? body.query : "";
  const trimmed = q.trim();
  if (!trimmed) {
    return NextResponse.json(
      { error: "Enter a keyword to search." },
      { status: 400 }
    );
  }

  const maxResults =
    typeof body.maxResults === "number" ? body.maxResults : 12;

  try {
    const courses = await searchPdacCourses(trimmed, maxResults);
    return NextResponse.json({ courses });
  } catch (e) {
    console.error("[pdac-search]", e);
    return NextResponse.json(
      { error: "Search could not be completed. Try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST." }, { status: 405 });
}
