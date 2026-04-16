export const faqItems: { question: string; answer: string }[] = [
  {
    question: "What is a fractional CTO, and is it right for our company?",
    answer:
      "A fractional CTO is senior technical leadership on a part-time basis—someone who owns architecture, prioritization, and hands-on fixes without you hiring a full-time executive. It fits when you already depend on real systems (website, CRM, ads, integrations) and need steady progress and clear tradeoffs, not a different freelancer for every ticket.",
  },
  {
    question: "How is On-Call CTO different from an agency or a typical consultant?",
    answer:
      "We are engineers who work in your Macao office and ship fixes in your environment—not a deck-first engagement or a rotating bench of juniors. You get execution plus technical direction: we stabilize what you have, tighten data and measurement, then automate where it makes sense.",
  },
  {
    question: "What does one day a week in our office actually look like?",
    answer:
      "We agree priorities ahead of time, then spend a focused on-site day working through your backlog: debugging, integrations, tracking, data hygiene, and planning the next increment. Work stays visible in your tools; we add async check-ins only when they help unblock the next visit.",
  },
  {
    question: "Do you only work with businesses in Macao?",
    answer:
      "Macao is our home base and where we deliver on-site. If you are outside Macao but need the same kind of help, reach out—we will be honest about whether remote or hybrid makes sense for your stack.",
  },
  {
    question: "What happens in the free 20-minute health check?",
    answer:
      "It is a structured triage: we look for where revenue leaks across technical relief (stability and tracking), data architecture (CRM, pipelines, truth in reporting), and operational AI (automation once data is trustworthy). You leave with a short prioritized readout mapped to Relief → Data → AI and whether ongoing fractional support is a fit. No cost and no obligation.",
  },
  {
    question: "What does ongoing engagement cost?",
    answer:
      "Engagement is a fixed monthly retainer for one dedicated day per week in your office. Exact fees depend on scope and stack; we align on numbers after the health check when there is a clear plan—not on a cold call.",
  },
  {
    question: "What kinds of technical problems do you take on?",
    answer:
      "Typical work follows our ladder: slow or fragile sites, SAP/API hangs, broken forms, blind Meta or Google measurement and server-side tagging, CRM and integration cleanup, then custom AI agents and internal automation once the underlying data is reliable.",
  },
  {
    question: "Who is Peter Mason, and what does “AI agent CEO” mean?",
    answer:
      "Peter runs strategy and client operations as an AI agent partner—consistent follow-up, crisp briefs, and alignment on priorities. Charles leads engineering and delivery in your stack. You always have human accountability for what ships; the agent augments communication and planning, not accountability for production systems.",
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
