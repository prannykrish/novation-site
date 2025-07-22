'use client'

import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Lightbulb, ShieldCheck, Rocket } from 'lucide-react'

export default function OurGoal() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-[#2b0508] via-[#200305] to-[#180000] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto px-4 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-normal font-serif mb-6 text-[#f9d89c]">
          The Law, Reimagined as Intelligence.
        </h2>
        <p className="text-sm md:text-base font-serif text-[#e0d4c1] mb-6">
          Novation is transforming how the law is interpreted.
          We’re turning static, outdated legal processes into dynamic, intelligent systems - starting with trademarks.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {[{
          icon: Lightbulb,
          title: 'Our Vision.',
          description: 'The legal system should be dynamic, intelligent, and alive. It should evolve and grow alongside humanity for centuries to come.'
        }, {
          icon: ShieldCheck,
          title: 'AI Trademark Analyst.',
          description: 'Our first tool delivers instant trademark clearance searches and monitoring - designed for speed, accuracy, and clarity.'
        }, {
          icon: Rocket,
          title: 'The Future.',
          description: 'We’re expanding to every legal system, process, and use case - building the smart legal systems of the future.'
        }].map((card, idx) => (
          <Tilt
  key={idx}
  tiltMaxAngleX={8}
  tiltMaxAngleY={8}
  glareEnable={false}
  glareMaxOpacity={0.05}
  glareColor="#ffffff"
  glarePosition="all"
  className="w-full rounded-xl"
>
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * (idx + 1), duration: 0.7 }}
    viewport={{ once: true }}
    whileHover={{scale: 1 }}
    className="relative bg-white/5 backdrop-blur-md border border-[#b93a52]/20 shadow-[0_0_60px_rgba(185,58,82,0.12)] rounded-3xl hover:brightness-110 p-6 flex flex-col items-center text-center w-full transition duration-300"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="bg-[#2a0000] p-2 rounded-xl border border-[#8b0000]">
        <card.icon className="w-6 h-6 text-[#f8e4b6]" />
      </div>
      <h3 className="text-lg font-serif text-[#f8e4b6]">{card.title}</h3>
    </div>
    <p className="text-[#cbbfa9] text-sm mb-4 font-light font-serif">{card.description}</p>
  </motion.div>
</Tilt>

        ))}
      </div>
    </section>
  )
}
