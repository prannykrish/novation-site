'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type FlowStep = {
  step: string
  title: string
  desc: string
}

export default function UseCaseTrademarkFirms_CluelyLayout() {
  const flow: FlowStep[] = [
    {
      step: '1',
      title: 'Input the mark',
      desc: 'Type mark + goods/services. That’s it.',
    },
    {
      step: '2',
      title: 'Run knockout scan',
      desc: 'Novation analyzes conflicts & similarities.',
    },
    {
      step: '3',
      title: 'Export analysis',
      desc: 'Full analysis preparation done in minutes.',
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
            Trademark law firms.
          </h2>
          <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[70ch]">
            A simple clearance flow: input → knockout → client-ready analysis.
          </p>
        </motion.div>

        {/* 3-step text-only flow */}
        <div className="mt-14">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {flow.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#f8e4b6]/10 bg-[#0b0002]/20 backdrop-blur-sm px-6 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
              >
                <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679]/85 font-sans">
                  Step {s.step}
                </p>
                <p className="mt-3 text-2xl font-serif text-[#F0D9A8] leading-[1.08]">
                  {s.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#E0D1B6] font-sans">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* benefits section (LEFT = headline/subtext/CTA, RIGHT = cards) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT */}
            <div className="lg:col-span-5">
              <h3 className="font-serif text-5xl leading-[1.05] text-[#F0D9A8]">
                Faster clearance.
                <br className="hidden sm:block" />
                Still defensible.
              </h3>

              <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[60ch]">
                Novation prioritizes conflicts by context and backs every conclusion with traceable evidence, so
                attorneys can review, validate, and deliver with confidence.
              </p>

              <div className="mt-8">
                <Link
                  href="/contactus"
                  className="inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium font-sans
                             bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition
                             shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                >
                  Request a Demo
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-7">
              <FirmBenefits />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FirmBenefits() {
  const benefits = [
    {
      title: 'Hours back on every search',
      desc: 'Automates first-pass clearance so attorneys focus on judgment, not scavenger work.',
    },
    {
      title: 'Near-misses surfaced early',
      desc: 'Catches the “sounds-like / means-like / looks-like” conflicts before they arise.',
    },
    {
      title: 'Evidence-linked rationale',
      desc: 'Every risk call ties back to what was found, so review is fast and defensible.',
    },
  ] as const

  return (
    <div className="space-y-4">
      {benefits.map((b) => (
        <div
          key={b.title}
          className="rounded-2xl border border-[#f8e4b6]/10 bg-[#0b0002]/25 backdrop-blur-sm px-5 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
        >
          <p className="text-[18px] font-serif text-[#F0D9A8] leading-[1.15]">
            {b.title}
          </p>
          <p className="mt-1.5 text-[14px] leading-6 text-[#E0D1B6] font-sans">
            {b.desc}
          </p>
        </div>
      ))}
    </div>
  )
}
