'use client'

import React from 'react'
import { motion } from 'framer-motion'

type StatChip = { text: string; source?: string }
type Example = { title: string; desc: string; href: string; cta: string }

const trademarkStatsRow1: StatChip[] = [
  { text: 'USPTO receives hundreds of thousands of trademark applications each year.', source: 'USPTO' },
  { text: '“Likelihood of confusion” is judgment-based — not a simple keyword match.' },
  { text: 'Applicants often file in the wrong class and discover it late.' },
  { text: 'Common-law use can create risk even without a federal registration.' },
  { text: 'Clearance requires evidence across filings, web usage, and market context.' },
]

const trademarkStatsRow2: StatChip[] = [
  { text: 'Rebrands are expensive when discovered late: domains, packaging, SEO, legal, and trust.' },
  { text: 'Near-misses are missed when searches rely on exact spelling.' },
  { text: 'Oppositions can appear after filing and stall a launch timeline.' },
  { text: 'International expansion multiplies search complexity across jurisdictions.' },
  { text: 'Most “quick searches” aren’t traceable enough to defend to a client.' },
]

const examples: Example[] = [
  {
    title: 'The near-miss problem',
    desc:
      'Same idea, different words. Same sound, different spelling. The risky conflict isn’t always the obvious match.',
    href: '/blog/near-misses',
    cta: 'Read the example',
  },
  {
    title: 'Common-law surprises',
    desc:
      'A mark can be “clear” in the USPTO and still risky in the real world because of unregistered usage.',
    href: '/blog/common-law',
    cta: 'See how it happens',
  },
  {
    title: 'The class trap',
    desc:
      'Filing in the wrong class can waste months. Fixing it late can mean refiling, redoing evidence, and resetting timelines.',
    href: '/blog/nice-classes',
    cta: 'Why classes matter',
  },
]

export default function AboutProblemSection_Clean() {
  return (
    <section className="relative overflow-hidden py-28 md:py-32 bg-gradient-to-b from-[#120006] via-[#160007] to-[#0b0002] text-white">
      {/* ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(900px_520px_at_18%_20%,rgba(185,58,82,0.14),transparent_60%),radial-gradient(900px_520px_at_82%_30%,rgba(124,63,32,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] [background-image:linear-gradient(rgba(248,228,182,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.04)_1px,transparent_1px)] [background-size:84px_84px]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* header */}
        <div className="max-w-3xl">
          {/* <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
            About
          </p> */}
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-[#F0D9A8]">
            Trademark work is messy by design.
          </h2>
          <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[72ch]">
            Clearance isn’t one search. It’s evidence gathering, judgment calls, and context that’s
            hard to explain and even harder to standardize.
          </p>
        </div>

        {/* infinite stat rows (lighter, fewer) */}
        <div className="mt-12 space-y-4">
          <InfiniteStatRow items={trademarkStatsRow1} direction="left" duration={75} />
          <InfiniteStatRow items={trademarkStatsRow2} direction="right" duration={85} />
        </div>

        {/* examples (clean list with blog links) */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
              Why founders get burned
            </p>
            <h3 className="mt-4 font-serif text-4xl leading-[1.08] text-[#F0D9A8]">
              A few common failure modes.
            </h3>
            <p className="mt-5 text-[15.5px] leading-7 text-[#E0D1B6] font-sans max-w-[56ch]">
              These are the patterns we see repeatedly: false confidence, late discovery, and
              decisions that aren’t backed by traceable evidence.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="divide-y divide-[#f8e4b6]/10 rounded-3xl border border-[#DDB982]/10 bg-[#0c0002]/25 backdrop-blur-sm">
              {examples.map((ex, i) => (
                <ExampleRow key={ex.title} ex={ex} index={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --- components --- */

function InfiniteStatRow({
  items,
  direction,
  duration,
}: {
  items: StatChip[]
  direction: 'left' | 'right'
  duration: number
}) {
  const motionX = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']

  return (
    <div className="relative overflow-hidden whitespace-nowrap">
      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#120006] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#120006] to-transparent z-10" />

      <motion.div
        className="flex gap-3 w-max"
        style={{ willChange: 'transform' }}
        animate={{ x: motionX }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((s, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       border border-[#f8e4b6]/10 bg-[#0c0002]/35
                       text-[13px] text-[#E0D1B6] font-sans"
          >
            <span className="text-[#F0D9A8]">•</span>
            <span className="whitespace-nowrap">{s.text}</span>
            {s.source && (
              <span className="ml-1 text-[#D2A679]/70 text-[11px] tracking-[0.12em] uppercase">
                {s.source}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function ExampleRow({
  ex,
  index,
}: {
  ex: Example
  index: number
}) {
  return (
    <div className="p-6 md:p-7">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#D2A679]/80 font-sans">
            Example {String(index).padStart(2, '0')}
          </p>
          <p className="mt-2 font-serif text-2xl text-[#F0D9A8] leading-[1.12]">
            {ex.title}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-[#E0D1B6] font-sans max-w-[62ch]">
            {ex.desc}
          </p>
        </div>

        <a
          href={ex.href}
          className="shrink-0 mt-6 md:mt-0 inline-flex items-center justify-center
                     rounded-full px-5 py-2.5 text-sm font-medium font-sans
                     border border-[#f8e4b6]/14 bg-[#0c0002]/35 text-[#F0D9A8]
                     hover:bg-[#0c0002]/55 transition"
        >
          {ex.cta}
        </a>
      </div>
    </div>
  )
}
