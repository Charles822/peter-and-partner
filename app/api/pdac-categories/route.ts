import { NextResponse } from "next/server";
import { fetchPdacCategories } from "@/lib/search-pdac";

export async function GET() {
  try {
    const categories = await fetchPdacCategories();
    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (e) {
    console.error("[pdac-categories]", e);
    const message =
      e instanceof Error ? e.message : "Could not load categories.";
    return NextResponse.json({ error: message, categories: [] as string[] }, { status: 503 });
  }
}
