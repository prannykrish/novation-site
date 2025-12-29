'use client'

import React from 'react'
import { motion } from 'framer-motion'

type Principle = { title: string; desc: string }
type Outcome = { title: string; desc: string }

export default function MissionVision_PrinciplesProof() {
  const principles: Principle[] = [
    {
      title: 'Evidence first',
      desc: 'Every conclusion must map back to observable sources.',
    },
    {
      title: 'Workflow-native',
      desc: 'Slot into how attorneys and in-house teams actually review risk.',
    },
    {
      title: 'Defensible outputs',
      desc: 'Reasoning should be reviewable, not “trust the model.”',
    },
  ]

  const outcomes: Outcome[] = [
    {
      title: 'Faster knockout calls',
      desc: 'Rank likely conflicts quickly without skipping context.',
    },
    {
      title: 'Higher-signal review',
      desc: 'Near-misses and market fit, not just obvious matches.',
    },
    {
      title: 'Client-ready reporting',
      desc: 'Structured deliverables you can edit, finalize, and send.',
    },
  ]

  return (
    <section className="relative overflow-hidden py-28 md:py-32 bg-gradient-to-b from-[#120006] via-[#160007] to-[#0b0002] text-white">
      {/* ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(185,58,82,0.12),transparent_60%),radial-gradient(900px_520px_at_82%_35%,rgba(124,63,32,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(rgba(248,228,182,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.035)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* header (short, grounded) */}
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
            Mission
          </p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-[#F0D9A8]">
            Make trademark decisions faster—without losing defensibility.
          </h2>
          <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[70ch]">
            Novation standardizes how clearance work is performed: consistent search strategy,
            surfaced evidence, and a rationale an attorney can stand behind.
          </p>
        </div>

        {/* Principles + Proof grid (unique vs other sections) */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* left: principles */}
          <div className="lg:col-span-5">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#D2A679]/80 font-sans">
              Principles
            </p>

            <div className="mt-5 space-y-6">
              {principles.map((p) => (
                <div key={p.title}>
                  <p className="font-serif text-2xl leading-[1.12] text-[#F0D9A8]">
                    {p.title}
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-[#E0D1B6] font-sans max-w-[52ch]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* right: outcomes */}
          <div className="lg:col-span-7">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#D2A679]/80 font-sans">
              What your team gets
            </p>

            <div className="mt-5 divide-y divide-[#f8e4b6]/10 rounded-3xl border border-[#DDB982]/10 bg-[#0c0002]/18 backdrop-blur-sm">
              {outcomes.map((o) => (
                <div key={o.title} className="p-6 md:p-7">
                  <p className="font-serif text-2xl leading-[1.12] text-[#F0D9A8]">
                    {o.title}
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-[#E0D1B6] font-sans max-w-[70ch]">
                    {o.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-[#D2A679]/75 font-sans">
              Designed to support attorney review, internal QA, and client delivery.
            </p>
          </div>
        </div>

        {/* subtle animated strip (keeps “cool”, but restrained) */}
        <div className="mt-16 rounded-3xl border border-[#DDB982]/10 bg-[#0c0002]/14 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f8e4b6]/10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#D2A679]/80 font-sans">
              System behavior
            </p>
            <p className="text-xs text-[#E0D1B6]/70 font-sans">
              evidence → reasoning → report
            </p>
          </div>

          <div className="p-6">
            <DotMatrix />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Subtle, professional animation: small dot matrix breathing */
function DotMatrix() {
  const rows = 5
  const cols = 16

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((__, c) => {
            const d = (r * cols + c) * 0.04
            return (
              <motion.div
                key={c}
                className="h-2.5 w-2.5 rounded-full bg-[#f8e4b6]/18"
                animate={{ opacity: [0.18, 0.6, 0.18] }}
                transition={{
                  duration: 2.6,
                  delay: d,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
