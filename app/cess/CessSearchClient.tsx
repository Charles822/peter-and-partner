"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import type { PdacCourse } from "@/lib/pdac-types";

const OFFICIAL_CEF =
  "https://apps.dsej.gov.mo/cesspublic/public/2023/search.jsp";

function orgLabel(c: PdacCourse): string {
  const zh = c.org_name_zh?.trim();
  const pt = c.org_name_pt?.trim();
  if (zh && pt) return `${zh} (${pt})`;
  return zh || pt || "—";
}

function formatFee(n: number | null): string {
  if (n === null || Number.isNaN(n)) return "—";
  return `${n.toLocaleString("en-MO")} MOP`;
}

function formatHours(n: number | null): string {
  if (n === null || Number.isNaN(n)) return "—";
  return String(n);
}

const WEEK_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/** `w0`–`w6` weekday flags (Su–Sa); unknown/null columns are skipped. */
function formatWeekdayFlags(c: PdacCourse): string {
  const flags = [c.w0, c.w1, c.w2, c.w3, c.w4, c.w5, c.w6] as const;
  const anyDefined = flags.some((f) => f !== null && f !== undefined);
  if (!anyDefined) return "—";
  const on = flags
    .map((f, i) => (f === true ? WEEK_LABELS[i] : null))
    .filter((x): x is (typeof WEEK_LABELS)[number] => x !== null);
  return on.length ? on.join(" ") : "—";
}

const PAGE_SIZE = 20;

/** Prefer these if present in DB (exact `category_en` strings); else first A–Z category. */
const DEFAULT_CATEGORY_PREFS = [
  "General interest",
  "Languages",
  "Language",
] as const;

function pickDefaultCategory(sortedCategories: string[]): string | null {
  if (sortedCategories.length === 0) return null;
  const available = new Set(sortedCategories);
  for (const pref of DEFAULT_CATEGORY_PREFS) {
    if (available.has(pref)) return pref;
  }
  return sortedCategories[0] ?? null;
}

export function CessSearchClient() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [addressContains, setAddressContains] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [courses, setCourses] = useState<PdacCourse[] | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Non-null = show “starting view” banner for this category label */
  const [startingView, setStartingView] = useState<string | null>(null);

  const defaultSearchDoneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pdac-categories")
      .then((res) => res.json())
      .then((json: { categories?: unknown }) => {
        if (cancelled || !Array.isArray(json.categories)) return;
        setCategories(json.categories.filter((c) => typeof c === "string"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const executeSearch = useCallback(
    async (
      nextPage: number,
      overrides?: {
        query?: string;
        category?: string;
        addressContains?: string;
      },
      opts?: {
        /** Clear starting-view banner after success */
        userSubmit?: boolean;
        /** Show starting-view banner after success */
        bootstrapCategory?: string | null;
      }
    ) => {
      const q = (overrides?.query ?? keyword).trim();
      const cat = (overrides?.category ?? category).trim();
      const addr = (overrides?.addressContains ?? addressContains).trim();

      if (!q && !cat && !addr) {
        setError(
          "Enter a keyword, choose a category, or enter a location (address)."
        );
        setCourses(null);
        setTotal(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const body: Record<string, unknown> = {
          query: q,
          page: nextPage,
          pageSize: PAGE_SIZE,
        };
        if (cat) body.category = cat;
        if (addr) body.addressContains = addr;

        const res = await fetch("/api/pdac-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = (await res.json()) as {
          courses?: PdacCourse[];
          total?: number | null;
          page?: number;
          pageSize?: number;
          error?: string;
        };
        if (!res.ok) {
          setError(json.error ?? "Search failed.");
          setCourses(null);
          setTotal(null);
          return;
        }
        setCourses(json.courses ?? []);
        setTotal(
          json.total == null
            ? null
            : typeof json.total === "number"
              ? json.total
              : null
        );
        setPage(json.page ?? nextPage);
        if (opts?.userSubmit) {
          setStartingView(null);
        } else if (opts?.bootstrapCategory) {
          setStartingView(opts.bootstrapCategory);
        }
      } catch {
        setError("Could not reach the server.");
        setCourses(null);
        setTotal(null);
      } finally {
        setLoading(false);
      }
    },
    [keyword, category, addressContains]
  );

  useEffect(() => {
    if (defaultSearchDoneRef.current || categories.length === 0) return;

    const picked = pickDefaultCategory(categories);
    defaultSearchDoneRef.current = true;

    if (!picked) return;

    setCategory(picked);
    void executeSearch(
      1,
      { category: picked, query: "", addressContains: "" },
      { bootstrapCategory: picked }
    );
  }, [categories, executeSearch]);

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    void executeSearch(1, undefined, { userSubmit: true });
  }

  const totalPages =
    total != null && PAGE_SIZE > 0 ? Math.ceil(total / PAGE_SIZE) : null;

  const canGoPrev = page > 1 && !loading;
  const canGoNext =
    !loading &&
    (courses?.length ?? 0) > 0 &&
    (totalPages != null ? page < totalPages : (courses?.length ?? 0) >= PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-amber-50/80 border border-amber-100 px-5 py-4 text-sm text-amber-950 font-montserrat leading-relaxed">
        <p className="font-medium mb-1">Unofficial search tool</p>
        <p className="text-amber-900/90">
          Course listings are mirrored for convenience. Enrollment, quotas, and
          fees shown on the{" "}
          <a
            href={OFFICIAL_CEF}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 font-medium text-amber-950 hover:text-black"
          >
            official DSEDJ continuing education site
          </a>{" "}
          are authoritative. Verify everything before you register.
        </p>
      </div>

      <form
        onSubmit={runSearch}
        className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 md:p-8"
      >
        <label className="block text-sm font-medium text-gray-700 font-montserrat mb-2">
          Keyword
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Optional — e.g. English, cooking, institution…"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-montserrat text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            autoComplete="off"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium font-montserrat text-white hover:bg-gray-800 disabled:opacity-60 transition-colors shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="cess-category"
              className="block text-sm font-medium text-gray-700 font-montserrat mb-2"
            >
              Category
            </label>
            <select
              id="cess-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-montserrat text-gray-900 bg-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="">Any category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="cess-address"
              className="block text-sm font-medium text-gray-700 font-montserrat mb-2"
            >
              Location (address contains)
            </label>
            <input
              id="cess-address"
              type="text"
              value={addressContains}
              onChange={(e) => setAddressContains(e.target.value)}
              placeholder="Optional — e.g. district, street…"
              autoComplete="off"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-montserrat text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500 font-montserrat">
          Provide at least one of: keyword, category, or location. Results are{" "}
          {PAGE_SIZE} per page.
        </p>
        {error && (
          <p className="mt-3 text-sm text-red-600 font-montserrat">{error}</p>
        )}
      </form>

      {courses !== null && (
        <div className="space-y-4">
          {startingView && (
            <div className="rounded-3xl bg-sky-50/90 border border-sky-100 px-5 py-4 text-sm text-sky-950 font-montserrat leading-relaxed">
              <p className="font-medium mb-1">Starting view</p>
              <p className="text-sky-900/95">
                Showing courses in{" "}
                <span className="font-semibold">{startingView}</span>. Add a
                keyword, pick another category, or filter by location — then
                Search — to explore the full catalog.
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 font-montserrat">
            {courses.length === 0
              ? "No courses matched."
              : total !== null
                ? `Showing ${courses.length} on this page · ${total} match${total === 1 ? "" : "es"}`
                : `Showing ${courses.length} course${courses.length === 1 ? "" : "s"} on this page`}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600 font-montserrat">
              {totalPages != null ? (
                <>
                  Page <span className="font-semibold">{page}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </>
              ) : (
                <>
                  Page <span className="font-semibold">{page}</span>
                  {total === null && courses.length > 0 && (
                    <span className="text-gray-400">
                      {" "}
                      (full counts need database search)
                    </span>
                  )}
                </>
              )}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => void executeSearch(page - 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium font-montserrat text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => void executeSearch(page + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium font-montserrat text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          {courses.length > 0 && (
            <p className="text-xs text-gray-500 font-montserrat hidden md:block">
              This table is wide—scroll horizontally to see hours, audience,
              schedule, and other details. The first column stays visible while
              you scroll.
            </p>
          )}

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full min-w-6xl text-left text-sm font-montserrat">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500">
                  <th className="sticky left-0 z-20 px-4 py-3 font-semibold whitespace-nowrap bg-gray-50/95 backdrop-blur-sm shadow-[4px_0_12px_-6px_rgba(0,0,0,0.12)]">
                    Course no.
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[200px]">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[140px]">
                    Organization
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Hours
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-40">
                    Audience
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-40">
                    Schedule
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Start
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    End
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Fee
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Other fee
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Quota
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Avail.
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Days
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-48">
                    Address
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-32">
                    Category
                  </th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {courses.map((c) => (
                  <tr
                    key={`${c.source_id}-${c.course_no}`}
                    className="group hover:bg-gray-50/50"
                  >
                    <td className="sticky left-0 z-10 px-4 py-3 font-mono text-xs whitespace-nowrap bg-white group-hover:bg-gray-50/50 shadow-[4px_0_12px_-6px_rgba(0,0,0,0.08)]">
                      {c.course_no ?? "—"}
                    </td>
                    <td className="px-4 py-3">{c.name_en ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[16rem]">
                      <span className="line-clamp-2" title={orgLabel(c)}>
                        {orgLabel(c)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                      {formatHours(c.hours)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-56">
                      <span
                        className="line-clamp-2"
                        title={c.target_audience_en ?? undefined}
                      >
                        {c.target_audience_en ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-56">
                      <span
                        className="line-clamp-2"
                        title={c.schedule_en ?? undefined}
                      >
                        {c.schedule_en ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                      {c.start_date ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                      {c.end_date ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatFee(c.fee_mop)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatFee(c.other_fee_mop)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {c.quota ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {c.available ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs tracking-tight">
                      {formatWeekdayFlags(c)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-56">
                      <span
                        className="line-clamp-2"
                        title={c.address_en ?? undefined}
                      >
                        {c.address_en ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {c.tel ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-40">
                      <span
                        className="line-clamp-2"
                        title={c.category_en ?? undefined}
                      >
                        {c.category_en ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.web_url ? (
                        <a
                          href={c.web_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 underline underline-offset-2 hover:text-black text-xs break-all"
                        >
                          Website
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {courses.map((c) => (
              <article
                key={`${c.source_id}-${c.course_no}-m`}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <p className="font-mono text-xs text-gray-400 mb-1">
                  {c.course_no ?? "—"}
                </p>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {c.name_en ?? "—"}
                </h3>
                <dl className="space-y-2 text-sm text-gray-600">
                  <div>
                    <dt className="text-xs uppercase text-gray-400">Organization</dt>
                    <dd>{orgLabel(c)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-gray-400">Hours</dt>
                    <dd>{formatHours(c.hours)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-gray-400">
                      Target audience
                    </dt>
                    <dd>{c.target_audience_en ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-gray-400">Schedule</dt>
                    <dd>{c.schedule_en ?? "—"}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <dt className="text-xs uppercase text-gray-400">Start</dt>
                      <dd className="font-mono text-xs">
                        {c.start_date ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-gray-400">End</dt>
                      <dd className="font-mono text-xs">{c.end_date ?? "—"}</dd>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <dt className="text-xs uppercase text-gray-400">Fee</dt>
                      <dd>{formatFee(c.fee_mop)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-gray-400">
                        Other fee
                      </dt>
                      <dd>{formatFee(c.other_fee_mop)}</dd>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <dt className="text-xs uppercase text-gray-400">Quota</dt>
                      <dd>{c.quota ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-gray-400">
                        Available
                      </dt>
                      <dd>{c.available ?? "—"}</dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-gray-400">Days</dt>
                    <dd className="font-mono text-xs">{formatWeekdayFlags(c)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-gray-400">Address</dt>
                    <dd>{c.address_en ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-gray-400">Phone</dt>
                    <dd>{c.tel ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-gray-400">Category</dt>
                    <dd>{c.category_en ?? "—"}</dd>
                  </div>
                  {c.web_url && (
                    <div>
                      <a
                        href={c.web_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 underline font-medium"
                      >
                        Institution website
                      </a>
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
