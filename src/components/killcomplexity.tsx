'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Search, BarChart3, Zap } from 'lucide-react'
import Tilt from 'react-parallax-tilt'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import { Engine } from 'tsparticles-engine'

export default function PlatformSimplifies() {
  const [hasAnimated, setHasAnimated] = useState(false)

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  useEffect(() => {
    const alreadyAnimated = sessionStorage.getItem('simplifiesAnimated')
    if (!alreadyAnimated) {
      setHasAnimated(true)
      sessionStorage.setItem('simplifiesAnimated', 'true')
    }
  }, [])

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-[#140102] via-[#200104] to-[#2e0d11] text-white">
      {/* Ambient Velvet Glow */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-radial from-[#8B0000] to-transparent opacity-25 blur-3xl -z-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-[#f8e4b6] mb-4">
          Eliminate the Complexity.
        </h2>
        <p className="text-lg md:text-xl text-[#cbbfa9] font-serif mb-16">
          Leverage the Law.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <BenefitCard
            title="Flexible Searching."
            description="Forget forms - describe your idea in plain language and get complete legal context immediately."
            icon={<Search className="w-6 h-6 text-[#f8e4b6]" />}
            tags={['Natural Input', 'Text-to-Search', 'Fast Context']}
          />
          <BenefitCard
            title="Instant Analysis."
            description="Novation compares millions of records and gives you a dynamic legal report in seconds."
            icon={<BarChart3 className="w-6 h-6 text-[#f8e4b6]" />}
            tags={['Real-Time', 'Risk Analysis', 'Live Assessment']}
          />
          <BenefitCard
            title="Full Transparency."
            description="See how every decision is made - from AI explanation to links to actual statutes and more."
            icon={<MessageCircle className="w-6 h-6 text-[#f8e4b6]" />}
            tags={['Explainable AI', 'Legal Sources', 'Cited Law']}
          />
          <BenefitCard
            title="Constant Improvement."
            description="Novation gets smarter with every use - and eventually will expand to every type of legal use case."
            icon={<Zap className="w-6 h-6 text-[#f8e4b6]" />}
            tags={['Auto-Learning', 'Legal Expansion', 'AI Ecosystem']}
          />
        </div>
      </div>
    </section>
  )
}

type BenefitCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  tags: string[]
}

function BenefitCard({ title, description, icon, tags }: BenefitCardProps) {
  return (
    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={false} glareMaxOpacity={0.05}>
      <motion.div
        whileHover={{scale: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-md border border-[#b93a52]/30 hover:brightness-110 rounded-3xl p-6 flex flex-col items-center text-center w-full hover:shadow-2xl transition duration-300"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-[#240305] p-2 rounded-xl shadow-md border border-[#8b0000]">
            {icon}
          </div>
          <h3 className="text-lg font-serif text-[#f8e4b6]">{title}</h3>
        </div>
        <p className="text-[#cbbfa9] text-sm mb-4 font-light font-serif">{description}</p>

        <div className="flex justify-center gap-2 flex-wrap">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 bg-[#3b0f12] text-[#f8e4b6] border border-[#b93a52]/40 rounded-full hover:opacity-90 transition font-serif"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </Tilt>
  )
}
