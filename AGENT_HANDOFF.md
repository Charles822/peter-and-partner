# Handoff: PDAC data layer → voice / Vapi project

This repository is the **source of truth** for the DSEDJ PDAC course mirror (scrape, translation, Supabase schema, read API). Build **Vapi assistants, prompts, and client apps** in a **separate repo**; do not copy the scraper or migrations into that repo unless you use a git submodule on purpose.

---

## What stays here (`gweilo_activities`)

| Component | Path / notes |
|-----------|----------------|
| Scraper + ingest | `scraper/` — Python; talks to DSEJ and Supabase |
| DB schema | `supabase/migrations/` — `pdac_courses`, `translation_cache`, RLS |
| Read API (for tools) | `supabase/functions/search-courses/` — Deno Edge Function |
| Vapi OpenAPI stub | `vapi/openapi-search-courses.yaml` — import shape into Vapi HTTP tool |
| Env template | `.env.example` — ingest secrets (not the Edge secrets) |

---

## What the other project owns

- Vapi assistant definition, system prompt, and **HTTP tool** pointing at the **deployed** Edge URL (below).
- Optional: web/mobile UI, analytics, rate limits in front of Vapi.
- Secrets for **Vapi** and, if you use it, the same **`SEARCH_API_KEY`** value you configured on the Edge Function (so the tool can authenticate).

Do **not** embed the Supabase **service role** key in a browser or in Vapi client-visible config. The Edge function already uses the service role server-side.

---

## Deployed contract (fill in your values)

After `supabase link` + `supabase functions deploy search-courses` (and DB push), record:

| Item | Example pattern |
|------|------------------|
| **Edge URL** | `https://<PROJECT_REF>.supabase.co/functions/v1/search-courses` |
| **HTTP method** | `POST` |
| **Body (JSON)** | `{ "query": "<user text>", "max_results": 8 }` — omit or use empty `query` for “recent courses” |
| **Auth (optional)** | Header `x-search-key: <SEARCH_API_KEY>` **or** `Authorization: Bearer <SEARCH_API_KEY>` — only if Edge secret `SEARCH_API_KEY` is set in Supabase Dashboard → Edge Functions → Secrets |

Replace `YOUR_PROJECT_REF` in `vapi/openapi-search-courses.yaml` `servers.url` with your real project ref when importing into Vapi.

---

## Response shape

`200` JSON:

```json
{
  "courses": [
    {
      "source_id": 123,
      "course_no": "…",
      "name_en": "…",
      "name_zh": "…",
      "org_name_zh": "…",
      "org_name_pt": "…",
      "fee_mop": 0,
      "start_date": "2026-04-30",
      "end_date": "…",
      "tel": "…",
      "category_en": "…",
      "category_zh": "…",
      "target_audience_en": "…",
      "address_en": "…",
      "web_url": "…"
    }
  ]
}
```

Errors: `{ "error": "…" }` with non-200 status (`401`, `405`, `500`, etc.).

Columns are chosen in code: see `cols` in [`supabase/functions/search-courses/index.ts`](../supabase/functions/search-courses/index.ts). Extend the Edge function if the agent needs more fields (keep voice payloads small).

---

## Voice / prompt hints

- **Disclaimer**: data is an unofficial mirror; enrollment and quotas are authoritative on DSEDJ / PDAC sites only.
- **Search**: user utterance → pass as `query`; cap `max_results` at **5–10** for TTS-friendly summaries.
- **Bilingual**: `name_en` + `name_zh`; Portuguese org names often in `org_name_pt`.
- **Empty query**: returns recent rows by `start_date` — useful for “what’s on now?” style prompts.

---

## Refreshing data (ops, not the agent repo)

From this repo, with `.env` configured:

```bash
python scraper/ingest.py --no-deepl --start-page 1 --end-page 40   # example chunk
```

See root [`README.md`](../README.md) for chunking, DeepL vs OpenRouter, and flags.

---

## Cursor / agent instructions (paste into the other repo)

You can copy the block below into `AGENTS.md` or a task brief there:

```markdown
## PDAC course tool (external)

- Read-only course search is implemented as a Supabase Edge Function (already deployed).
- Tool URL: POST `https://<PROJECT_REF>.supabase.co/functions/v1/search-courses`
- JSON body: `{ "query": string, "max_results": number }` (max_results 1–25; keep low for voice).
- If SEARCH_API_KEY is configured on the function, send header `x-search-key: <secret>`.
- Response: `{ "courses": Course[] }`. Summarize briefly for speech; cite `course_no` when helpful.
- Do not duplicate the Python ingest repo; schema and scraper live in `gweilo_activities` (path or git URL on your machine).
- OpenAPI reference file to import into Vapi: attach or link `vapi/openapi-search-courses.yaml` from that repo.
```

---

## Single line for humans

**Agent repo = Vapi + UX; this repo = data + Edge search.** Link them by URL and OpenAPI, not by duplicating the directory.
