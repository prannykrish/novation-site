'use client'

import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

const useCaseWords = [
  'Intellectual Property', 'Litigation', 'Taxes', 'Filings', 'Contracts',
  'Registrations', 'Case Preparation', 'Legal Copilot', 'Court Hearings',
  'Policy Simulation', 'AI Law Firms', 'Interpretations'
]

export default function InfiniteUseCases() {
  useEffect(() => {
    const animate = () => {
      const tagElements = document.querySelectorAll('.use-case-tag')
      tagElements.forEach((el, i) => {
        const delay = i * 80
        setTimeout(() => {
          const tag = el as HTMLElement
          tag.classList.remove('animate-pingy')
          void tag.offsetWidth
          tag.classList.add('animate-pingy')
        }, delay)
      })
    }

    animate()
    const interval = setInterval(animate, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-32 bg-[#150505] text-white overflow-hidden">

{/* Rich velvet ambient glow overlays */}
<div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#1a0000] via-[#0a0000] to-[#1a0000] opacity-95" />
<div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-40 blur-[140px] -z-20" />

      {/* Interactive Tilt Card */}
      <div className="flex justify-center">
        <Tilt
          tiltMaxAngleX={8}
          tiltMaxAngleY={8}
          glareEnable={false}
          glareMaxOpacity={0.01}
          trackOnWindow={false}
          className="inline-block max-w-6xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -10, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="relative max-w-6xl mx-auto px-8 py-16 rounded-3xl hover:brightness-110 border border-[#b93a52]/20 bg-white/5 backdrop-blur-md shadow-[0_0_60px_rgba(185,58,82,0.12)] overflow-hidden"
          >
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative z-10 text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#f3d9a7] via-[#ffe7ae] to-[#d3ae6d] font-serif">
                A Universe of Use Cases.
              </h2>
              <p className="text-gray-400 font-serif text-base">
                Novation’s AI-native legal fabric adapts to every idea, industry, and innovation.
              </p>
            </motion.div>

            {/* Tags */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              {[0, 1].map((rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap justify-center gap-4">
                  {useCaseWords
                    .slice(rowIndex * (useCaseWords.length / 2), (rowIndex + 1) * (useCaseWords.length / 2))
                    .map((word, i) => (
                      <motion.div
                        key={`${rowIndex}-${i}`}
                        whileHover={{ scale: 1.05 }}
                        className="use-case-tag px-4 py-2 rounded-full text-sm
                                  bg-white/5 border font-serif border-[#d6b37e]/20 text-[#f6e6c1]
                                  hover:bg-white/10 hover:border-[#d6b37e]/40
                                  backdrop-blur-sm whitespace-nowrap transition-shadow duration-300"
                      >
                        {word}
                      </motion.div>
                    ))}
                </div>
              ))}
            </div>

            {/* Footer Text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative z-10 mt-12 text-gray-500 font-serif text-sm text-center"
            >
              and so much more.
            </motion.p>
          </motion.div>
        </Tilt>
      </div>
    </section>
  )
}
