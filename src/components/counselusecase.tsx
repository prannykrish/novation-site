'use client'

import React from 'react'
import { motion } from 'framer-motion'

type InsightCard = {
  title: string
  description: string
}

export default function UseCaseInHouseCounsel_VisualGrid() {
  const cards: InsightCard[] = [
    {
      title: 'Batch clearance for launch cycles',
      description:
        'Run large sets of marks at once for launches, rebrands, and expansions. Ranked by risk and grouped by why.',
    },
    {
      title: 'Portfolio monitoring & alerts',
      description:
        'Monitor near-miss filings and real-world usage changes. Get alerted when risk meaningfully shifts.',
    },
    {
      title: 'Deep analysis across frontiers',
      description:
        'Go beyond identical matches: meaning, sound, look, and market fit, each backed by surfaced evidence.',
    },
    {
      title: 'Counsel-ready summaries',
      description:
        'Export clean briefs for internal review or outside counsel. Structured, traceable, and consistent.',
    },
  ]

  return (
    <section className="relative overflow-hidden py-28 md:py-32 bg-[#2A000A] text-white">
      {/* ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(900px_520px_at_18%_20%,rgba(185,58,82,0.16),transparent_60%),radial-gradient(900px_520px_at_82%_30%,rgba(124,63,32,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.26] [background-image:linear-gradient(rgba(248,228,182,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.04)_1px,transparent_1px)] [background-size:84px_84px]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
            Use case
          </p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-[#F0D9A8]">
            In-house counsel.
          </h2>
          <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[72ch]">
            Manage trademark risk across an entire portfolio — from launch planning to ongoing
            monitoring — with consistent, defensible analysis.
          </p>
        </motion.div>

        {/* text card grid (matches Step cards) */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#f8e4b6]/10 bg-[#0b0002]/20 backdrop-blur-sm px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
            >
              <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679]/85 font-sans">
                Coming soon
              </p>

              <p className="mt-3 text-2xl font-serif text-[#F0D9A8] leading-[1.08] max-w-[28ch]">
                {card.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#E0D1B6] font-sans max-w-[60ch]">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
