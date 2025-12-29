'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type PhaseKey = 'now' | 'next' | 'later'

type Capability = {
  title: string
  desc: string
  status?: 'live' | 'building' | 'future'
}

type Phase = {
  key: PhaseKey
  label: string
  title: string
  subtitle: string
  items: Capability[]
}

export default function RoadmapSection() {
  const phases: Phase[] = useMemo(
    () => [
      {
        key: 'now',
        label: 'Now',
        title: 'What’s supported today.',
        subtitle: 'The foundation: repeatable, evidence-backed clearance with judgment-ready output.',
        items: [
          { title: 'Trademark knockout', desc: 'Conflict discovery + risk reasoning across core sources.', status: 'live' },
          { title: 'Structured analysis', desc: 'Client-ready outputs with traceable, thorough rationale.', status: 'live' },
          { title: 'Attorney workflow fit', desc: 'Built for real practice constraints and review.', status: 'live' },
          { title: 'Search memory', desc: 'Reuse prior inputs and results across matters.', status: 'live' },
        ],
      },
      {
        key: 'next',
        label: 'Next',
        title: 'What we’re building next.',
        subtitle: 'Upgrades that make Novation usable at any level of volume: speed, batch, and more evidence.',
        items: [
          { title: 'Batch + portfolio', desc: 'Run analysis across many marks simutaneously with similar or different context.', status: 'building' },
          { title: 'Exclusions', desc: 'Exclude certain marks from analysis to review different perspectives.', status: 'building' },
          { title: 'Richer evidence surfaces', desc: 'More sources, cleaner citations, stronger recall.', status: 'building' },
          { title: 'Constant learning', desc: 'Gets more accurate with every experience.', status: 'building' },
        ],
      },
      {
        key: 'later',
        label: 'Later',
        title: 'Where this is going.',
        subtitle: 'Searches are the entry point. The architecture scales across the trademark lifecycle.',
        items: [
          { title: 'Multimodal clearance', desc: 'Logos, trade dress, sound, videos, and beyond.', status: 'future' },
          { title: 'Lifecycle tooling', desc: 'Search → filing → office actions → renewals.', status: 'future' },
          { title: 'Registration workflows', desc: 'Filing support, logistics, and post-filing operations.', status: 'future' },
          { title: 'Trademark monitoring', desc: 'The same thorough analysis, constantly running, constantly reassuring.', status: 'future' },
        ],
      },
    ],
    []
  )

  const [active, setActive] = useState<PhaseKey>('now')
  const current = phases.find((p) => p.key === active) ?? phases[0]

  return (
    <section id="roadmap" className="relative overflow-hidden bg-[#2A000A] text-white">
      {/* velvet ambience */}
      <div className="pointer-events-none absolute inset-0 opacity-95" />
      <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] blur-[140px]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className="text-xs tracking-[0.24em] uppercase text-[#DDB982]/80">
            Roadmap
          </p>
          <h2 className="mt-3 font-serif text-5xl leading-[1.05] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
            What we support, and what’s next.
          </h2>
          {/* <p className="mt-5 text-[16px] leading-7 text-[#E0D1B6] max-w-[70ch]">
            A simple, readable view — no walls of text. Pick a phase and scan the capabilities.
          </p> */}
        </motion.div>

        {/* Selector row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <div className="inline-flex rounded-2xl border border-[#DDB982]/15 bg-[#120006]/50 p-1 backdrop-blur-sm">
            {phases.map((p) => {
              const on = p.key === active
              return (
                <button
                  key={p.key}
                  onClick={() => setActive(p.key)}
                  className={[
                    'px-4 py-2 rounded-full text-xs tracking-[0.22em] uppercase transition',
                    on
                      ? 'bg-[#F0D9A8] text-[#2A000A] shadow-[0_10px_30px_rgba(0,0,0,0.25)]'
                      : 'text-[#F0D9A8]/80 hover:text-[#F0D9A8]',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          <div className="h-px flex-1 bg-[#DDB982]/10" />
        </motion.div>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: phase copy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <p className="text-xs tracking-[0.22em] uppercase text-[#DDB982]/70">
              {current.label}
            </p>
            <h3 className="mt-3 font-serif text-3xl text-[#F0D9A8] leading-tight">
              {current.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-[#E0D1B6] max-w-[52ch]">
              {current.subtitle}
            </p>
          </motion.div>

          {/* Right: capability grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {current.items.map((it, i) => (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.12 + i * 0.06 }}
                  viewport={{ once: true }}
                  className="
                    group relative overflow-hidden rounded-2xl
                    border border-[#DDB982]/14 bg-[#0c0002]/55 backdrop-blur-sm
                    px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-serif text-lg text-[#F0D9A8] leading-tight">
                      {it.title}
                    </p>

                    {it.status && it.status !== 'live' && (
                      <span
                        className="
                          shrink-0 rounded-full px-3 py-1 text-[10px]
                          tracking-[0.2em] uppercase
                          border border-[#DDB982]/18 bg-[#120006]/60 text-[#F0D9A8]/80
                        "
                      >
                        {it.status === 'building' ? 'Building' : 'Coming'}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#E0D1B6]/85">
                    {it.desc}
                  </p>

                  <div className="mt-4 h-px w-full bg-[#DDB982]/10" />

                  <p className="mt-3 text-xs text-[#E0D1B6]/65">
                    {it.status === 'live'
                      ? 'Available in the current product.'
                      : it.status === 'building'
                        ? 'In active development.'
                        : 'Planned for future releases.'}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
