'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type Tile = {
  image: string
  title: string
  subtitle: string
  overlay?: string // <- ONLY knob
}

export default function PlatformSimplifies() {
  const tiles: Tile[] = [
    {
      image: '/images/redreflection.jpg',
      title: 'Defensible by Design',
      subtitle:
        'Evidence-first knockouts based on real context, not random calculated numbers.',
      overlay: 'bg-[#120006]/90',
    },
    {
      image: '/images/redlinetexture.jpg',
      title: 'Simplicity at Heart',
      subtitle:
        'A system built to make knockouts smarter while eliminating manual searching.',
      overlay: 'bg-[#120006]/90',
    },
    {
      image: '/images/redcircles.jpg',
      title: 'Built for Judgment',
      subtitle:
        'Designed to pre-process analysis to maximize judgement, not replace decisions.',
      overlay: 'bg-[#120006]/90',
    },
  ]

  return (
    <section className="bg-[#2A000A] text-white">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-6 lg:px-10 py-28"
      >
        {/* Top row: heading + CTA */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
              Perks
            </p>

            <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-[#F0D9A8]">
              Do less, get more.
            </h2>

            <p className="mt-5 text-[17px] leading-7 text-[#E0D1B6] font-sans">
              Novation gives law firms the ability to perform deeper, faster
              clearance with evidence and reasoning that hold up under scrutiny.
            </p>
          </div>

          <Link
            href="/usecases"
            className="
              md:mt-1 shrink-0 inline-flex items-center justify-center
              rounded-2xl px-6 py-2.5 text-[15px] font-medium font-sans
              bg-[#F0D9A8] text-[#2A000A]
              hover:bg-[#F0D9A8] transition
              shadow-[0_10px_30px_rgba(0,0,0,0.35)]
            "
          >
            See Use Cases
          </Link>
        </div>

        {/* Cards row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {tiles.map((t) => (
            <NovationTile
              key={t.title}
              image={t.image}
              title={t.title}
              subtitle={t.subtitle}
              overlay={t.overlay}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function NovationTile({
  image,
  title,
  subtitle,
  overlay,
}: {
  image: string
  title: string
  subtitle: string
  overlay?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl h-[360px] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* ONLY knob: overlay */}
      <div className={['absolute inset-0', overlay ?? 'bg-[#120006]/60'].join(' ')} />

      {/* Light, even vignette (no heavy bottom) */}

      {/* Optional faint highlight (keep or delete) */}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-8 pb-8">
        <h3 className="text-xl font-serif text-[#F0D9A8]">{title}</h3>
        <p className="mt-3 text-[14px] leading-6 text-[#E0D1B6] font-sans max-w-[90%]">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
