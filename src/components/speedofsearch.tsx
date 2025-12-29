'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SpeedSection() {
  return (
    <section className="relative overflow-hidden py-28 bg-[#1A0006] text-white">
      {/* Velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#220008] via-[#120006] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-30 blur-[170px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: header + subtext */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
              Performance
            </p>

            <h2 className="mt-3 font-serif text-5xl leading-[1.05] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
              Quick &amp; Efficient.
            </h2>

            <p className="mt-5 text-[17px] leading-7 text-[#E0D1B6] font-sans max-w-[60ch]">
              Faster than manual review - and consistent in process.
            </p>

            <div className="mt-10">
              <Link href="/contactus">
                <button className="inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium font-sans bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  Request a Demo
                </button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: metrics */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl border border-[#DDB982]/10 bg-black/10 backdrop-blur-sm shadow-[0_30px_90px_rgba(0,0,0,0.45)] p-8 md:p-10">
              <MetricRow
                value="~2 min"
                label="Full knockout"
                desc="From input → evidence → reasoning."
                valueClassName="text-4xl md:text-4xl"
              />
              <Divider />
              <MetricRow
                value="Hours"
                label="Typical manual time"
                desc="Experienced review is thorough, but very slow."
                valueClassName="text-4xl md:text-4xl"
              />
              <Divider />
              <MetricRow
                value="100%"
                label="Same workflow, always"
                desc='No skipped steps. No “it depends who did it.”'
                valueClassName="text-4xl md:text-4xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* --- tiny components --- */

function MetricRow({
  value,
  label,
  desc,
  valueClassName = '',
}: {
  value: string
  label: string
  desc: string
  valueClassName?: string
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-10 items-center">
      <div className="flex items-center">
        <div className={`font-serif leading-none whitespace-nowrap text-[#F0D9A8] ${valueClassName}`}>
          {value}
        </div>
      </div>

      <div>
        <p className="font-serif text-2xl md:text-3xl text-[#F0D9A8] leading-tight">
          {label}
        </p>
        <p className="mt-2 text-[15px] md:text-[16px] leading-7 text-[#E0D1B6] font-sans">
          {desc}
        </p>
      </div>
    </div>
  )
}

function Divider() {
  return <div className="h-px w-full bg-[#DDB982]/10 my-8" />
}
