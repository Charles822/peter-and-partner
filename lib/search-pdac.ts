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

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function boolOrNull(v: unknown): boolean | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "boolean") return v;
  if (v === "t" || v === "true" || v === 1) return true;
  if (v === "f" || v === "false" || v === 0) return false;
  return null;
}

function rowToCourse(row: Record<string, unknown>): PdacCourse {
  return {
    source_id: Number(row.source_id ?? 0),
    course_no: row.course_no != null ? String(row.course_no) : null,
    name_en: row.name_en != null ? String(row.name_en) : null,
    name_zh: row.name_zh != null ? String(row.name_zh) : null,
    org_name_zh: row.org_name_zh != null ? String(row.org_name_zh) : null,
    org_name_pt: row.org_name_pt != null ? String(row.org_name_pt) : null,
    fee_mop: numOrNull(row.fee_mop),
    other_fee_mop: numOrNull(row.other_fee_mop),
    start_date: row.start_date != null ? String(row.start_date) : null,
    end_date: row.end_date != null ? String(row.end_date) : null,
    tel: row.tel != null ? String(row.tel) : null,
    category_en: row.category_en != null ? String(row.category_en) : null,
    category_zh: row.category_zh != null ? String(row.category_zh) : null,
    category_pt: row.category_pt != null ? String(row.category_pt) : null,
    target_audience_en:
      row.target_audience_en != null ? String(row.target_audience_en) : null,
    target_audience_zh:
      row.target_audience_zh != null ? String(row.target_audience_zh) : null,
    target_audience_pt:
      row.target_audience_pt != null ? String(row.target_audience_pt) : null,
    address_en: row.address_en != null ? String(row.address_en) : null,
    address_zh: row.address_zh != null ? String(row.address_zh) : null,
    hours: numOrNull(row.hours),
    schedule_en: row.schedule_en != null ? String(row.schedule_en) : null,
    schedule_zh: row.schedule_zh != null ? String(row.schedule_zh) : null,
    schedule_pt: row.schedule_pt != null ? String(row.schedule_pt) : null,
    quota: row.quota != null ? String(row.quota) : null,
    available: row.available != null ? String(row.available) : null,
    web_url: row.web_url != null ? String(row.web_url) : null,
    w0: boolOrNull(row.w0),
    w1: boolOrNull(row.w1),
    w2: boolOrNull(row.w2),
    w3: boolOrNull(row.w3),
    w4: boolOrNull(row.w4),
    w5: boolOrNull(row.w5),
    w6: boolOrNull(row.w6),
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
    `schedule_en.ilike.${pattern}`,
    `address_en.ilike.${pattern}`,
  ].join(",");

  const { data, error } = await supabase
    .from("pdac_courses")
    .select(
      "source_id, course_no, name_en, name_zh, org_name_zh, org_name_pt, fee_mop, other_fee_mop, start_date, end_date, tel, category_en, category_zh, category_pt, target_audience_en, target_audience_zh, target_audience_pt, address_en, address_zh, hours, schedule_en, schedule_zh, schedule_pt, quota, available, web_url, w0, w1, w2, w3, w4, w5, w6"
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
