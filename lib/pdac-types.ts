/** Aligns with PDAC Edge Function response rows — see AGENT_HANDOFF.md */
export type PdacCourse = {
  source_id: number;
  course_no: string | null;
  name_en: string | null;
  name_zh: string | null;
  org_name_zh: string | null;
  org_name_pt: string | null;
  fee_mop: number | null;
  start_date: string | null;
  end_date: string | null;
  tel: string | null;
  category_en: string | null;
  category_zh: string | null;
  target_audience_en: string | null;
  address_en: string | null;
  web_url: string | null;
};
