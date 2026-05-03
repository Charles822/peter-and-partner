"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
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

export function CessSearchClient() {
  const [keyword, setKeyword] = useState("");
  const [courses, setCourses] = useState<PdacCourse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const q = keyword.trim();
    if (!q) {
      setError("Enter a keyword to search.");
      setCourses(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pdac-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, maxResults: 20 }),
      });
      const json = (await res.json()) as {
        courses?: PdacCourse[];
        error?: string;
      };
      if (!res.ok) {
        setError(json.error ?? "Search failed.");
        setCourses(null);
        return;
      }
      setCourses(json.courses ?? []);
    } catch {
      setError("Could not reach the server.");
      setCourses(null);
    } finally {
      setLoading(false);
    }
  }

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
            placeholder="e.g. English, cooking, IT, institution name…"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-montserrat text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            autoComplete="off"
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
        {error && (
          <p className="mt-3 text-sm text-red-600 font-montserrat">{error}</p>
        )}
      </form>

      {courses !== null && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-montserrat">
            {courses.length === 0
              ? "No courses matched your keyword."
              : `${courses.length} result${courses.length === 1 ? "" : "s"}`}
          </p>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm font-montserrat">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Course no.
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[200px]">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[140px]">
                    Organization
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Fee
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Start
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {courses.map((c) => (
                  <tr key={`${c.source_id}-${c.course_no}`} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      {c.course_no ?? "—"}
                    </td>
                    <td className="px-4 py-3">{c.name_en ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{orgLabel(c)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatFee(c.fee_mop)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                      {c.start_date ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {c.tel ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.category_en ?? "—"}
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
                  <div className="flex justify-between gap-4">
                    <div>
                      <dt className="text-xs uppercase text-gray-400">Fee</dt>
                      <dd>{formatFee(c.fee_mop)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-gray-400">Start</dt>
                      <dd className="font-mono text-xs">{c.start_date ?? "—"}</dd>
                    </div>
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
