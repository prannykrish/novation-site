'use client'

import { motion } from 'framer-motion'

type EvidenceCard = {
  title: string
  description: string
  bgImage: string // gif/webp/jpg
  href?: string
  cta?: string
  overlay?: string // optional per-card overlay strength
}

export default function EvidenceSection() {
  const cards: EvidenceCard[] = [
    {
      title: 'Primary legal sources',
      description:
        'USPTO filings, common-law usage, and live web signals form the backbone of every analysis.',
      bgImage: '/images/coolredline.jpg',
      overlay: 'bg-[#120006]/80',
    },
    {
      title: 'Traceable reasoning',
      description:
        'Each conclusion is supported by surfaced evidence and explainable logic, not random scoring.',
      bgImage: '/images/redrain.jpg',
      overlay: 'bg-[#120006]/80',
    },
    {
      title: 'Auditable outputs',
      description:
        'Reports are structured so attorneys can independently review, validate, and audit the analysis.',
      bgImage: '/images/redwall.jpg',
      overlay: 'bg-[#120006]/75',
    },
  ]

  return (
    <section className="relative py-32 bg-[#1A0006] text-white overflow-hidden">
      {/* subtle ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#220008] via-[#120006] to-[#1A0006] opacity-90" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-30 blur-[160px] -z-10" />

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
            Evidence-based analysis
          </p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-[#F0D9A8]">
            Built on real data, not assumptions.
          </h2>
          <p className="mt-6 text-[17px] leading-7 text-[#E0D1B6] font-sans max-w-[70ch]">
            Novation doesn’t hallucinate conclusions in isolation. Every signal, similarity, and risk
            assessment is grounded in real-world trademark data that you can review, trace, and audit.
          </p>
        </motion.div>

        {/* cards */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <EvidenceCardTile card={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EvidenceCardTile({ card }: { card: EvidenceCard }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      {/* background image/gif */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${card.bgImage})` }}
      />

      {/* velvet overlay */}
      <div className={['absolute inset-0', card.overlay ?? 'bg-[#120006]/62'].join(' ')} />
      {/* bottom vignette for readability */}
      <div className="absolute inset-0 [box-shadow:inset_0_-140px_160px_rgba(0,0,0,0.60)]" />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-8 min-h-[320px]">
        <h3 className="font-serif text-2xl text-[#F0D9A8] leading-[1.08]">
          {card.title}
        </h3>
        <p className="mt-3 text-[15px] leading-6 text-[#E0D1B6] font-sans">
          {card.description}
        </p>

        {/* optional CTA (leave off if you don’t want buttons here) */}
        {card.cta && card.href && (
          <div className="mt-6">
            <a
              href={card.href}
              className="
                inline-flex items-center justify-center
                rounded-full px-6 py-2.5 text-sm font-medium font-sans
                bg-[#E0D1B6] text-[#2A000A]
                hover:bg-[#F0D9A8] transition
                shadow-[0_10px_30px_rgba(0,0,0,0.35)]
              "
            >
              {card.cta}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
