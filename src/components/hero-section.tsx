'use client'

import { motion } from 'framer-motion'
import { HeroHeader } from '@/components/nav-bar'
import { useEffect, useState } from 'react'
import Link from 'next/link'


export default function HeroSection() {
  const [typedText, setTypedText] = useState('')
  const devMessage = 'Currently in development'

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTypedText(devMessage.slice(0, index))
      index++
      if (index > devMessage.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-[#130202] via-[#200305] to-[#2b0508] text-white overflow-hidden">
     
      <HeroHeader />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-6 text-sm font-mono tracking-wide text-[#b97d6b] uppercase"
        >
          {typedText}_
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="relative text-6xl md:text-7xl font-serif font-semibold text-center"
        >
          <span
            className="absolute inset-0 mx-auto"
            aria-hidden="true"
            style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, #f8e4b680 0%, transparent 70%)',
              filter: 'blur(80px)',
              opacity: 0.6,
              zIndex: 0,
            }}
          />
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#f8e4b6] via-[#ffd7a1] to-[#eeb57e] drop-shadow-[0_2px_10px_rgba(248,228,182,0.2)]">
            The OS for Law.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-[#e0d4c1] text-lg md:text-xl max-w-2xl font-serif"
        >
          Novation is building AI-native infrastructure to make the law dynamic, intelligent, and alive.
        </motion.p>

        <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.9, duration: 1 }}
  className="mt-12 flex gap-4 flex-wrap justify-center"
>
  <Link href="/contactus">
    <button className="relative bg-[#2b0d0d] hover:bg-[#3d1212] text-[#f8e4b6] px-6 py-3 rounded-xl font-serif font-medium border border-[#b8634c]/30 shadow-md transition-all duration-300 overflow-hidden cursor-pointer">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />
      <span className="relative z-10">Experience the Future →</span>
    </button>
  </Link>

  <Link href="/features">
    <button className="border border-[#b8634c]/30 hover:border-[#b8634c]/60 hover:bg-[#1a0000] font-serif text-[#f8e4b6] px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer">
      Learn More
    </button>
  </Link>
</motion.div>

      </div>
    </section>
  )
}
