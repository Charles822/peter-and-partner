import { createClient } from "@supabase/supabase-js";
import type { PdacCourse } from "./pdac-types";

const MAX_RESULTS_CAP = 25;

function clampMax(n: number): number {
  if (!Number.isFinite(n)) return 12;
  return Math.min(MAX_RESULTS_CAP, Math.max(1, Math.floor(n)));
}

/** Strip characters that break PostgREST `or` / ilike patterns. */
function sanitizeSearchTerm(raw: string): string {
  return raw
    .trim()
    .slice(0, 120)
    .replace(/[%_,]/g, " ")
    .replace(/\s+/g, " ");
}

function rowToCourse(row: Record<string, unknown>): PdacCourse {
  return {
    source_id: Number(row.source_id ?? 0),
    course_no: row.course_no != null ? String(row.course_no) : null,
    name_en: row.name_en != null ? String(row.name_en) : null,
    name_zh: row.name_zh != null ? String(row.name_zh) : null,
    org_name_zh: row.org_name_zh != null ? String(row.org_name_zh) : null,
    org_name_pt: row.org_name_pt != null ? String(row.org_name_pt) : null,
    fee_mop:
      row.fee_mop === null || row.fee_mop === undefined
        ? null
        : typeof row.fee_mop === "number"
          ? row.fee_mop
          : Number(row.fee_mop),
    start_date: row.start_date != null ? String(row.start_date) : null,
    end_date: row.end_date != null ? String(row.end_date) : null,
    tel: row.tel != null ? String(row.tel) : null,
    category_en: row.category_en != null ? String(row.category_en) : null,
    category_zh: row.category_zh != null ? String(row.category_zh) : null,
    target_audience_en:
      row.target_audience_en != null ? String(row.target_audience_en) : null,
    address_en: row.address_en != null ? String(row.address_en) : null,
    web_url: row.web_url != null ? String(row.web_url) : null,
  };
}

async function searchViaEdge(
  query: string,
  maxResults: number
): Promise<PdacCourse[]> {
  const edgeUrl = process.env.PDAC_EDGE_SEARCH_URL;
  if (!edgeUrl) return [];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const key = process.env.PDAC_SEARCH_KEY;
  if (key) {
    headers["x-search-key"] = key;
  }

  const res = await fetch(edgeUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      max_results: maxResults,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Edge search failed (${res.status}): ${text.slice(0, 200)}`);
  }

  let json: unknown;
  try {
    json = JSON.parse(text) as { courses?: unknown };
  } catch {
    throw new Error("Edge returned non-JSON");
  }

  const courses = json && typeof json === "object" && "courses" in json
    ? (json as { courses: unknown }).courses
    : null;

  if (!Array.isArray(courses)) {
    return [];
  }

  return courses.map((c) =>
    rowToCourse(typeof c === "object" && c !== null ? (c as Record<string, unknown>) : {})
  );
}

async function searchViaSupabase(
  query: string,
  maxResults: number
): Promise<PdacCourse[]> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing backend: set PDAC_EDGE_SEARCH_URL or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  const term = sanitizeSearchTerm(query);
  if (!term) {
    return [];
  }

  const pattern = `%${term}%`;
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const orClause = [
    `name_en.ilike.${pattern}`,
    `course_no.ilike.${pattern}`,
    `category_en.ilike.${pattern}`,
    `name_zh.ilike.${pattern}`,
    `org_name_zh.ilike.${pattern}`,
    `target_audience_en.ilike.${pattern}`,
  ].join(",");

  const { data, error } = await supabase
    .from("pdac_courses")
    .select(
      "source_id, course_no, name_en, name_zh, org_name_zh, org_name_pt, fee_mop, start_date, end_date, tel, category_en, category_zh, target_audience_en, address_en, web_url"
    )
    .or(orClause)
    .limit(maxResults);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    rowToCourse(row as Record<string, unknown>)
  );
}

/**
 * Uses PDAC_EDGE_SEARCH_URL when set; otherwise Supabase `pdac_courses` with service role (server-only).
 */
export async function searchPdacCourses(
  query: string,
  maxResultsRaw: number
): Promise<PdacCourse[]> {
  const maxResults = clampMax(maxResultsRaw);
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  if (process.env.PDAC_EDGE_SEARCH_URL) {
    return searchViaEdge(trimmed, maxResults);
  }

  return searchViaSupabase(trimmed, maxResults);
}
