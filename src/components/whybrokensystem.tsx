'use client'

import React from 'react'

type Reason = {
  k: string
  title: string
  desc: string
  tags: string[]
}

export default function WhyTrademarkClearanceIsHard_Pillars() {
  const reasons: Reason[] = [
    {
      k: '01',
      title: 'Context decides.',
      desc: 'Risk depends on market meaning, buyers, and use—not a keyword match.',
      tags: ['Meaning', 'Sound', 'Market'],
    },
    {
      k: '02',
      title: 'Evidence is fragmented.',
      desc: 'You need filings + real-world use, spread across disconnected sources.',
      tags: ['USPTO', 'Common-law', 'Web'],
    },
    {
      k: '03',
      title: 'Workflows aren’t standardized.',
      desc: 'Two people can “search” and still get different outcomes and reasoning.',
      tags: ['Strategy drift', 'Subjective calls', 'No audit trail'],
    },
    {
      k: '04',
      title: 'Scale breaks timelines.',
      desc: 'Fast shipping + many names + many markets outpaces manual clearance.',
      tags: ['Batching', 'Monitoring', 'Global'],
    },
  ]

  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-gradient-to-b from-[#120006] via-[#160007] to-[#0b0002] text-white">
      {/* ambience (same palette, different structure) */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(185,58,82,0.12),transparent_60%),radial-gradient(900px_520px_at_85%_40%,rgba(124,63,32,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(248,228,182,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.035)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* header (short) */}
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
            Why it’s messy
          </p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-[#F0D9A8]">
            Clearance is hard for four reasons.
          </h2>
          <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[68ch]">
            The complexity isn’t mysterious—it’s structural. Here’s the reality in one screen.
          </p>
        </div>

        {/* 4 pillars (visually distinct from your other sections) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div
              key={r.k}
              className="
                rounded-3xl border border-[#DDB982]/10
                bg-[#0c0002]/18 backdrop-blur-sm
                p-6
              "
            >
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#D2A679]/80 font-sans">
                Reason {r.k}
              </p>

              <p className="mt-3 font-serif text-2xl leading-[1.12] text-[#F0D9A8]">
                {r.title}
              </p>

              <p className="mt-3 text-[15px] leading-7 text-[#E0D1B6] font-sans">
                {r.desc}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="
                      rounded-full px-3 py-1 text-[12px]
                      border border-[#f8e4b6]/10
                      bg-[#0c0002]/20
                      text-[#D2A679]/90 font-sans
                    "
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* single closer line (optional) */}
        <p className="mt-12 text-sm text-[#D2A679]/75 font-sans max-w-[80ch]">
          Novation standardizes the messy parts: consistent search strategy, evidence surfaced automatically,
          and reasoning that’s defensible.
        </p>
      </div>
    </section>
  )
}
