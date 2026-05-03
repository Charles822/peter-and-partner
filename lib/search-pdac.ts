import { createClient } from "@supabase/supabase-js";
import type { PdacCourse } from "./pdac-types";

const COLS =
  "source_id, course_no, name_en, name_zh, org_name_zh, org_name_pt, fee_mop, other_fee_mop, start_date, end_date, tel, category_en, category_zh, category_pt, target_audience_en, target_audience_zh, target_audience_pt, address_en, address_zh, hours, schedule_en, schedule_zh, schedule_pt, quota, available, web_url, w0, w1, w2, w3, w4, w5, w6";

/** Legacy single-page search cap (keyword-only helpers). */
const MAX_RESULTS_CAP = 25;

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;
const MAX_PAGE = 500;

export type PdacSearchPagedParams = {
  query: string;
  page: number;
  pageSize: number;
  categoryEn: string | null;
  addressContains: string | null;
};

export type PdacSearchPagedResult = {
  courses: PdacCourse[];
  /** Row count matching filters; `null` when the backend cannot compute it (Edge fallback). */
  total: number | null;
  page: number;
  pageSize: number;
};

function clampMax(n: number): number {
  if (!Number.isFinite(n)) return 12;
  return Math.min(MAX_RESULTS_CAP, Math.max(1, Math.floor(n)));
}

function clampPageSize(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(n)));
}

function clampPage(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_PAGE, Math.max(1, Math.floor(n)));
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

function hasSupabaseCredentials(): boolean {
  return !!(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
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

  const courses =
    json && typeof json === "object" && "courses" in json
      ? (json as { courses: unknown }).courses
      : null;

  if (!Array.isArray(courses)) {
    return [];
  }

  return courses.map((c) =>
    rowToCourse(
      typeof c === "object" && c !== null ? (c as Record<string, unknown>) : {}
    )
  );
}

function buildKeywordOrClause(pattern: string): string {
  return [
    `name_en.ilike.${pattern}`,
    `course_no.ilike.${pattern}`,
    `category_en.ilike.${pattern}`,
    `name_zh.ilike.${pattern}`,
    `org_name_zh.ilike.${pattern}`,
    `target_audience_en.ilike.${pattern}`,
    `schedule_en.ilike.${pattern}`,
    `address_en.ilike.${pattern}`,
  ].join(",");
}

async function searchViaSupabasePaged(
  params: PdacSearchPagedParams
): Promise<PdacSearchPagedResult> {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const page = clampPage(params.page);
  const pageSize = clampPageSize(params.pageSize);
  const offset = (page - 1) * pageSize;

  const term = sanitizeSearchTerm(params.query);
  const categoryTrimmed = params.categoryEn?.trim() ?? "";
  const categoryFilter = categoryTrimmed.length > 0 ? categoryTrimmed : null;
  const addrTerm = sanitizeSearchTerm(params.addressContains ?? "");

  let q = supabase.from("pdac_courses").select(COLS, { count: "exact" });

  if (term) {
    const pattern = `%${term}%`;
    q = q.or(buildKeywordOrClause(pattern));
  }
  if (categoryFilter) {
    q = q.eq("category_en", categoryFilter);
  }
  if (addrTerm) {
    q = q.ilike("address_en", `%${addrTerm}%`);
  }

  q = q
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("source_id", { ascending: true })
    .range(offset, offset + pageSize - 1);

  const { data, error, count } = await q;

  if (error) {
    throw new Error(error.message);
  }

  return {
    courses: (data ?? []).map((row) =>
      rowToCourse(row as Record<string, unknown>)
    ),
    total: count ?? 0,
    page,
    pageSize,
  };
}

/**
 * Paged search with optional category and address filters.
 * Uses Supabase when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set (also when `PDAC_EDGE_SEARCH_URL` is set).
 * Edge-only installs: page 1, no filters, keyword-only; `total` is unknown (`null`).
 */
export async function searchPdacCoursesPaged(
  raw: PdacSearchPagedParams
): Promise<PdacSearchPagedResult> {
  const page = clampPage(raw.page);
  const pageSize = clampPageSize(raw.pageSize);

  if (hasSupabaseCredentials()) {
    return searchViaSupabasePaged({
      ...raw,
      page,
      pageSize,
    });
  }

  if (process.env.PDAC_EDGE_SEARCH_URL) {
    if (page !== 1) {
      throw new Error(
        "Pagination beyond page 1 requires Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)."
      );
    }
    if (raw.categoryEn?.trim() || sanitizeSearchTerm(raw.addressContains ?? "")) {
      throw new Error(
        "Category and location filters require Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)."
      );
    }
    const term = sanitizeSearchTerm(raw.query);
    if (!term) {
      return { courses: [], total: 0, page: 1, pageSize };
    }
    const courses = await searchViaEdge(term, pageSize);
    return {
      courses,
      total: null,
      page: 1,
      pageSize,
    };
  }

  throw new Error(
    "Missing backend: set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, or PDAC_EDGE_SEARCH_URL for keyword-only search."
  );
}

/** Distinct non-null `category_en` values, sorted. Requires Supabase credentials. */
export async function fetchPdacCategories(): Promise<string[]> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Categories require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const seen = new Set<string>();
  const batch = 1000;
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from("pdac_courses")
      .select("category_en")
      .not("category_en", "is", null)
      .range(from, from + batch - 1);

    if (error) {
      throw new Error(error.message);
    }
    if (!data?.length) break;

    for (const row of data) {
      const c = row.category_en != null ? String(row.category_en).trim() : "";
      if (c) seen.add(c);
    }

    if (data.length < batch) break;
    from += batch;
    if (from > 200_000) break;
  }

  return [...seen].sort((a, b) => a.localeCompare(b));
}

async function searchViaSupabase(
  query: string,
  maxResults: number
): Promise<PdacCourse[]> {
  const r = await searchViaSupabasePaged({
    query,
    page: 1,
    pageSize: maxResults,
    categoryEn: null,
    addressContains: null,
  });
  return r.courses;
}

/**
 * Uses PDAC_EDGE_SEARCH_URL when set (unless Supabase credentials exist — then Supabase is used for parity with paged search); otherwise Supabase `pdac_courses` with service role (server-only).
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

  if (hasSupabaseCredentials()) {
    return searchViaSupabase(trimmed, maxResults);
  }

  if (process.env.PDAC_EDGE_SEARCH_URL) {
    return searchViaEdge(trimmed, maxResults);
  }

  throw new Error(
    "Missing backend: set PDAC_EDGE_SEARCH_URL or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY"
  );
}
