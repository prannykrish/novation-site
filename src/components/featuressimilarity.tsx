'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

type Bullet = { title: string; desc: string }

export default function ContextAwareSection() {
  const bullets: Bullet[] = [
    { title: 'Reads the mark in context', desc: 'Industry, audience, meaning, and how it’s actually used.' },
    { title: 'Finds near misses, not just matches', desc: 'Same idea, different wording. Same sound, different spelling.' },
    { title: 'Explains why something is risky', desc: 'A thorough, auditable rationale tied to the evidence it found.' },
  ]

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[#1A0006] text-white">
      {/* velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(900px_500px_at_20%_20%,rgba(185,58,82,0.18),transparent_60%),radial-gradient(900px_500px_at_80%_30%,rgba(124,63,32,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(rgba(248,228,182,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.04)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT: Visual */}
          <motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="lg:col-span-6"
>
  {/* Same outer box styling as your example */}
  <div className="relative overflow-hidden rounded-3xl shadow-[0_18px_60px_rgba(0,0,0,0.40)]">
    {/* Same size as example: aspect-[13/9] */}
    <div className="relative aspect-[13/9] w-full bg-[#120006] overflow-hidden">
      <div className="absolute inset-0 px-6">
  <Image
    src="/images/analysis2 1.png"
    alt="Novation analysis screenshot"
    fill
    className="object-contain scale-[1.33] translate-x-[2%]"
    priority
  />
</div>


      {/* Fade out bottom so crop/letterbox feels intentional */}
      
{/* EDGE FADES — subtle, consistent with bottom */}

{/* EDGE FADES — subtle, restrained */}

{/* Bottom (slightly reduced from before) */}



      {/* Velvet overlay + vignette (matching your example vibe) */}
      <div className="pointer-events-none absolute inset-0 bg-[#120006]/35" />

      {/* Optional grain (same as your example) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)] [background-size:3px_3px]" />
    </div>
  </div>
</motion.div>

          {/* RIGHT: Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <p className="text-xs tracking-[0.18em] uppercase text-[#d2a679] font-sans">
              Minute similarity
            </p>

            <h2 className="mt-3 text-4xl md:text-5xl font-serif text-[#f8e4b6] leading-[1.05]">
              Context-aware similarity.
            </h2>

            <p className="mt-5 text-[15.5px] leading-7 text-[#d6bfa1] font-sans max-w-[56ch]">
              Novation doesn’t dump matches or calculate random numbers. It evaluates relevance, then explains what matters.
            </p>

            <div className="mt-8 space-y-5">
              {bullets.map((b) => (
                <div key={b.title} className="relative pl-5">
                  <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-[#DDB982]/55" />
                  <p className="font-sans text-sm text-[#F0D9A8]">{b.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#E0D1B6]/80 font-sans">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
