'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function WhatNovationIs() {
  return (
    <section id="demo"className="relative py-28 bg-[#1A0006] text-white overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#220008] via-[#140004] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-35 blur-[160px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full mx-auto px-6 md:px-10 lg:px-14 2xl:px-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT — editorial copy */}
          <div className="lg:col-span-5">
            {/* match Roadmap header spacing */}
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
              intro
            </p>

            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-[#F0D9A8] leading-[1.05] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
              What Novation is.
            </h2>

            <p className="mt-5 text-base md:text-lg text-[#E0D1B6] leading-relaxed max-w-[68ch]">
              Trademark knockouts require so much manual data pre-processing.
              Novation turns manual efforts into a simple, elegant analysis, as it always should have been.
            </p>

            {/* Divider should start the “details” block, not fight the spacing */}
            <div className="mt-10 h-px w-full bg-[#DDB982]/10" />

            <div className="mt-10 space-y-10">
              <div>
                <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
                  Core capabilities
                </p>
                <ul className="mt-4 space-y-2 text-[#E0D1B6] font-sans">
                  <li>• Deep conflict discovery (USPTO + web + common-law signals)</li>
                  <li>• Thorough similarity + risk reasoning you can audit</li>
                  <li>• Client-ready analysis with cited evidence</li>
                </ul>
              </div>

              <div>
                <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
                  Benefits for firms
                </p>
                <ul className="mt-4 space-y-2 text-[#E0D1B6] font-sans">
                  <li>• Smarter & faster clearance without sacrificing defensibility</li>
                  <li>• Analysis based on real context (not random numbers)</li>
                  <li>• A reusable, auditable analysis trail</li>
                </ul>
              </div>

              <Link
                href="/contactus"
                className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium font-sans
                           bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition
                           shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              >
                Request a Demo
              </Link>
            </div>
          </div>

          {/* RIGHT — video, dominant */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-4">
              <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
                Demo
              </p>
              <div className="h-px flex-1 bg-[#DDB982]/10" />
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="aspect-video lg:min-h-[480px]">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/XpEBXiMbv-g"
                  title="Novation Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
