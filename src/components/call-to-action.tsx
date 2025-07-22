'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import { useCallback } from 'react'
import { Engine } from 'tsparticles-engine'
import { motion } from 'framer-motion'

export default function CallToAction() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <section className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-br from-[#130202] via-[#200305] to-[#2b0508] text-white">
      {/* Velvet Ambient Glow */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#1a0000] via-black to-[#1a0000] opacity-90" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#8B0000] to-transparent opacity-30 blur-3xl -z-20" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="mx-auto max-w-5xl px-6 text-center"
      >
        <h2 className="text-balance text-4xl font-serif font-semibold text-[#f4c089] drop-shadow-[0_0_0.6rem_#7c3f2020]">
          The Law is Code.
        </h2>

        <p className="mt-4 text-lg text-[#d6bfa1] font-light font-serif">
          We just haven’t written it yet.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
  {/* CTA Button 1 */}
  <Link href="/contactus">
    <button className="relative bg-[#2b0d0d] hover:bg-[#3d1212] text-[#f8e4b6] px-6 py-3 rounded-xl font-serif font-medium border border-[#b8634c]/30 shadow-md transition-all duration-300 overflow-hidden cursor-pointer">
      {/* Internal Shine */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />
      {/* Button Text */}
      <span className="relative z-10">Experience the Future →</span>
    </button>
  </Link>

  {/* CTA Button 2 */}
  <Link href="/features">
    <button className="border border-[#b8634c]/30 hover:border-[#b8634c]/60 hover:bg-[#1a0000] font-serif text-[#f8e4b6] px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer">
      Learn More
    </button>
  </Link>
</div>
      </motion.div>
    </section>
  )
}
