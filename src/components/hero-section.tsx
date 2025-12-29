'use client'

import { motion } from 'framer-motion'
import { HeroHeader } from '@/components/nav-bar'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [typedText, setTypedText] = useState('')
  const devMessage = 'Beta v1 in testing'

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTypedText(devMessage.slice(0, index))
      index++
      if (index > devMessage.length) clearInterval(interval)
    }, 45)
    return () => clearInterval(interval)
  }, [])

  const chips = useMemo(
    () => [
      'Context-aware similarity',
      'Near-miss discovery',
      'Evidence-backed rationale',
      'Client-ready report exports',
    ],
    []
  )

  return (
    <section className="relative w-full min-h-screen bg-[#2A000A] text-white overflow-hidden">
      <HeroHeader />

      {/* Ambient cinematic background */}
      <div className="pointer-events-none absolute inset-0 -z-20 " />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] bg-[radial-gradient(circle_at_center,rgba(185,58,82,0.18),transparent_60%)] blur-[120px] -z-10" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(248,228,182,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.03)_1px,transparent_1px)] [background-size:120px_120px] -z-10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#DDB982]/10" />

      {/* Soft vignette for focus */}
      <div className="pointer-events-none absolute inset-0 -z-10 [box-shadow:inset_0_0_220px_rgba(0,0,0,0.55)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 text-center">
        {/* Dev line */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.18em] text-[#D2A679] uppercase">
  <span className="h-1.5 w-1.5 rounded-full bg-[#DDB982]/60" />
  {typedText}
  <span className="opacity-70">_</span>
</span>

        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 1 }}
          className="text-5xl md:text-7xl font-serif leading-[1.02]"
        >
          <span className="text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]">
            The OS for Trademarks.
          </span>
        </motion.h1>

        {/* Subheadline (slightly more specific, still short) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 1 }}
          className="mt-6 max-w-3xl text-[16px] md:text-[18px] font-sans text-[#E0D1B6] leading-7"
        >
          Novation's trademark analysis system helps legal teams run faster clearance with minute precision, abstracting the data so they can focus on interpretation.
        </motion.p>

        {/* “System readout” row (tiny, adds credibility without noise) */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.9 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <span className="rounded-full border border-[#DDB982]/14 bg-[#0c0002]/30 px-4 py-2 text-xs font-sans text-[#E0D1B6]/85">
            Inputs: mark • class • goods/services • context
          </span>
          <span className="rounded-full border border-[#DDB982]/14 bg-[#0c0002]/30 px-4 py-2 text-xs font-sans text-[#E0D1B6]/85">
            Output: ranked conflicts + rationale
          </span>
          <span className="rounded-full border border-[#DDB982]/14 bg-[#0c0002]/30 px-4 py-2 text-xs font-sans text-[#E0D1B6]/85">
            Built for: firms • in-house • accelerators
          </span>
        </motion.div>

        {/* Capability chips (readable, skimmable) */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.9 }}
          className="mt-10 flex flex-wrap justify-center gap-2 max-w-4xl"
        >
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-[#f8e4b6]/12 bg-[#0c0002]/25 px-4 py-2 text-xs font-sans text-[#F0D9A8]/90"
            >
              {c}
            </span>
          ))}
        </motion.div> */} 

        {/* CTAs */}
        {/* CTAs */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.92, duration: 0.9 }}
  className="mt-12 flex flex-wrap items-center justify-center gap-4"
>
  <Link
    href="/contactus"
    className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium font-sans
               bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition
               shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
  >
    Request a Demo
  </Link>

  <Link
    href="/features"
    className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium font-sans
               border bg-[#1A0006]/40 text-[#F0D9A8]
               hover:bg-[#120006]/60 transition"
  >
    Learn More
  </Link>
</motion.div>


        {/* Tiny footer hint (optional) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="mt-8 text-xs font-sans text-[#D2A679]/65"
        >
          Auditable by design. Built to fit existing trademark workflows.
        </motion.p>
      </div>
    </section>
  )
}
