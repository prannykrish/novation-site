'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function FeaturesHeader() {
  return (
    <section className="relative overflow-hidden bg-[#2A000A] text-white">
      {/* Velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#1A0006] via-[#0B0002] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 w-[1150px] h-[1150px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-35 blur-[190px] -z-10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#DDB982]/10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Spacing from navbar: adjust this if your navbar is taller */}
        <div className="pt-28 md:pt-32 pb-16 md:pb-20">
          {/* Page title */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
              Features
            </p>

            <h1 className="mt-4 font-serif text-5xl md:text-6xl leading-[1.02] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
              Built for real trademark work.
            </h1>

            <p className="mt-6 text-[17px] leading-7 text-[#E0D1B6] font-sans max-w-[68ch]">
              Novation&apos;s inital features focus on turning analysis preparation into a simple process that maximizes judgment effectiveness.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
