import { NextResponse } from "next/server";
import { searchPdacCoursesPaged } from "@/lib/search-pdac";

function sanitizeSearchTerm(raw: string): string {
  return raw
    .trim()
    .slice(0, 120)
    .replace(/[%_,]/g, " ")
    .replace(/\s+/g, " ");
}

export async function POST(req: Request) {
  let body: {
    query?: unknown;
    page?: unknown;
    pageSize?: unknown;
    category?: unknown;
    addressContains?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const q = typeof body.query === "string" ? body.query : "";
  const trimmedQuery = q.trim();

  const categoryRaw = typeof body.category === "string" ? body.category : "";
  const categoryTrimmed = categoryRaw.trim();

  const addressRaw =
    typeof body.addressContains === "string" ? body.addressContains : "";
  const addressSanitized = sanitizeSearchTerm(addressRaw);

  const hasKeyword = trimmedQuery.length > 0;
  const hasCategory = categoryTrimmed.length > 0;
  const hasAddress = addressSanitized.length > 0;

  if (!hasKeyword && !hasCategory && !hasAddress) {
    return NextResponse.json(
      {
        error:
          "Enter a keyword, choose a category, or enter a location (address).",
      },
      { status: 400 }
    );
  }

  const page =
    typeof body.page === "number" && Number.isFinite(body.page)
      ? body.page
      : 1;
  const pageSize =
    typeof body.pageSize === "number" && Number.isFinite(body.pageSize)
      ? body.pageSize
      : 20;

  try {
    const result = await searchPdacCoursesPaged({
      query: trimmedQuery,
      page,
      pageSize,
      categoryEn: hasCategory ? categoryTrimmed : null,
      addressContains: hasAddress ? addressRaw : null,
    });

    return NextResponse.json({
      courses: result.courses,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (e) {
    console.error("[pdac-search]", e);
    const msg = e instanceof Error ? e.message : String(e);
    const needsSupabase =
      msg.includes("Supabase") || msg.includes("SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json(
      {
        error: needsSupabase
          ? msg
          : "Search could not be completed. Try again later.",
      },
      { status: needsSupabase ? 503 : 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST." }, { status: 405 });
}
