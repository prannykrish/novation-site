'use client'

import React from 'react'
import { motion } from 'framer-motion'

type ResourceTile = {
  title: string
  desc: string
  href: string
  bgImage: string
  eyebrow?: string
  cta: string
  overlay?: string
}

export default function ResourcesIndexPage() {
  const tiles: ResourceTile[] = [
    {
      eyebrow: 'Insights',
      title: 'Blog',
      desc: 'Clear explanations of trademark risk, workflow, and how to deliver defensible clearance work.',
      href: '/comingsoon',
      cta: 'Browse articles',
      bgImage: '/images/veryniceredplant.jpg',
      overlay: 'bg-[#120006]/62',
    },
    {
      eyebrow: 'Proof',
      title: 'Case studies',
      desc: 'Real examples of how teams use Novation to move faster without losing auditability.',
      href: '/comingsoon',
      cta: 'View case studies',
      bgImage: '/images/plantred.jpg',
      overlay: 'bg-[#120006]/64',
    },
  ]

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#2A000A] text-white">
      {/* ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]
        [background-image:linear-gradient(rgba(248,228,182,0.05)_1px,transparent_1px),
        linear-gradient(90deg,rgba(248,228,182,0.035)_1px,transparent_1px)]
        [background-size:96px_96px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
className="mx-auto max-w-6xl px-6 lg:px-10 pt-28 pb-20 md:pt-32 md:pb-24"
      >
        {/* header */}
        {/* header */}
<div className="max-w-3xl">
  <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
    Resources
  </p>

  <h1 className="mt-4 font-serif text-5xl md:text-6xl leading-[1.02] text-[#F0D9A8]">
    Resources.
  </h1>

  <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[72ch]">
    Everything here is written for real trademark work: what to look for, what to document,
    and how to make decisions you can defend.
  </p>
</div>


        {/* tiles */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiles.map((t) => (
            <ResourceTile key={t.title} tile={t} />
          ))}
        </div>

        {/* footer note */}
        <p className="mt-10 text-xs text-[#D2A679]/75 font-sans">
          More resources coming soon (templates, checklists, and workflow guides).
        </p>
      </motion.div>
    </main>
  )
}

function ResourceTile({ tile }: { tile: ResourceTile }) {
  return (
    <a
      href={tile.href}
      className="
        relative overflow-hidden rounded-2xl
        border border-[#DDB982]/12
        shadow-[0_18px_60px_rgba(0,0,0,0.35)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D2A679]/60
      "
    >
      {/* background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${tile.bgImage})` }}
      />

      {/* dark overlay */}
      <div className={['absolute inset-0', tile.overlay ?? 'bg-[#120006]/62'].join(' ')} />

      {/* grid texture */}
      <div
        className="
          absolute inset-0 opacity-[0.18]
          [background-image:
            linear-gradient(rgba(248,228,182,0.06)_1px,transparent_1px),
            linear-gradient(90deg,rgba(248,228,182,0.04)_1px,transparent_1px)]
          [background-size:96px_96px]
        "
      />

      {/* bottom fade */}
      <div className="absolute inset-0 [box-shadow:inset_0_-160px_180px_rgba(0,0,0,0.62)]" />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-8 min-h-[320px]">
        {tile.eyebrow && (
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#D2A679]/85 font-sans">
            {tile.eyebrow}
          </p>
        )}

        <h2 className="mt-3 font-serif text-3xl md:text-4xl leading-[1.06] text-[#F0D9A8]">
          {tile.title}
        </h2>

        <p className="mt-4 text-[15px] leading-7 text-[#E0D1B6] font-sans max-w-[62ch]">
          {tile.desc}
        </p>

        <div className="mt-7 inline-flex items-center gap-2 text-sm font-sans text-[#F0D9A8]">
          <span className="rounded-2xl border border-[#f8e4b6]/12 bg-[#0c0002]/35 px-4 py-2">
            {tile.cta}
          </span>
          <span className="text-[#f8e4b6]/35">›</span>
        </div>
      </div>
    </a>
  )
}
