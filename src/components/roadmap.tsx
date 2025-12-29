'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type Column = {
  eyebrow: string
  title: string
  subtitle: string
  items: { title: string; desc: string }[]
  href?: string
  cta?: string
}

export default function RoadmapNowLater() {
  const cols: Column[] = [
    {
      eyebrow: 'Now',
      title: 'Today’s foundation.',
      subtitle:
        'What Novation supports right now. Built to be defensible, repeatable, and report-ready.',
      items: [
        { title: 'Trademark clearance', desc: 'Evidence-backed conflict discovery + risk reasoning.' },
        { title: 'Structured reporting', desc: 'Client-ready analysis with traceable rationale.' },
        { title: 'Attorney workflow fit', desc: 'Designed for real practice constraints and review.' },
      ],
      href: '/features',
      cta: 'See Current Features',
    },
    {
      eyebrow: 'Later',
      title: 'The long arc.',
      subtitle:
        'Knockouts are the entry point. The architecture is designed to scale across trademark workflows.',
      items: [
        { title: 'Multimodal clearance', desc: 'Logos, trade dress, sound, videos, and beyond.' },
        { title: 'Lifecycle tooling', desc: 'From search → filing → office actions → renewals.' },
        { title: 'Registration + Monitoring', desc: 'Simple, holistic solution for entire trademark lifecycle.' },
      ],
    },
  ]

  return (
    <section className="relative py-28 bg-[#1A0006] text-white overflow-hidden">
      {/* Velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#220008] via-[#120006] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-35 blur-[160px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6 lg:px-10"
      >
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
            Roadmap
          </p>
          <h2 className="mt-3 font-serif text-5xl leading-[1.05] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
            Now. Later.
          </h2>
          <p className="mt-5 text-[17px] leading-7 text-[#E0D1B6] font-sans max-w-[68ch]">
            What we support today - and where the architecture is ultimately going.
          </p>
        </div>

        {/* Centered columns */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-14 max-w-5xl mx-auto">
          {cols.map((col) => (
            <div key={col.eyebrow}>
              {/* Column top */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase font-sans text-[#F0D9A8] border border-[#DDB982]/18 bg-[#120006]/60">
                  {col.eyebrow}
                </span>
                <div className="h-px flex-1 bg-[#DDB982]/10" />
              </div>

              <h3 className="mt-5 font-serif text-2xl text-[#F0D9A8] leading-tight">
                {col.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#E0D1B6] font-sans max-w-[56ch]">
                {col.subtitle}
              </p>

              {/* Items */}
              <div className="mt-8 space-y-5">
                {col.items.map((it) => (
                  <div key={it.title} className="relative pl-5">
                    <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-[#DDB982]/55" />
                    <span className="absolute left-[3px] top-[18px] bottom-0 w-px bg-[#DDB982]/10" />

                    <p className="font-sans text-sm text-[#F0D9A8]">
                      {it.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#E0D1B6] font-sans">
                      {it.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {col.href && col.cta && (
                <div className="mt-10">
                  <Link href={col.href}>
                    <button
                      className="
                        inline-flex items-center pointer-events-none justify-center
                        rounded-2xl px-6 py-2.5 text-sm font-medium font-sans
                        bg-[#F0D9A8] text-[#2A000A]
                        hover:bg-[#F0D9A8] transition
                        shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                      "
                    >
                      {col.cta}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
