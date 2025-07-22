'use client'

import { Bot, Cpu, ShieldCheck, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#130102] via-[#22060e] to-[#180103] text-white min-h-screen flex flex-col justify-center py-28 px-6 sm:px-12">
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl md:text-6xl font-serif text-[#f8e4b6]"
        >
          Legal Intelligence Begins Here.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-[#cbbfa9] text-lg mt-6 max-w-2xl mx-auto font-serif"
        >
          We’re reengineering legal efficiency - starting with our AI Trademark Analyst to transform how trademarks are analyzed, understood, and processed.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <Tilt
            key={idx}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable={false}
            glareMaxOpacity={0.05}
            className="w-full"
          >
            <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 + idx * 0.2, duration: 0.6 }}
  viewport={{ once: true }}
  whileHover={{ scale: 1 }}
  className="relative p-6 rounded-3xl bg-[#240305] border border-[#b93a52]/30 text-center shadow-[0_0_40px_#5c0a17]/10 transition-all duration-300 hover:brightness-110"
>

              <div className="mb-4 p-3 rounded-xl bg-[#2a0000] border border-[#8b0000] inline-block shadow-md">
                <div className="text-[#f8e4b6]">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-serif text-[#f8e4b6] mb-2">{feature.title}</h3>
              <p className="text-[#cbbfa9] text-sm font-light font-serif">{feature.description}</p>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </section>
  )
}

const features = [
  {
    icon: <Bot className="w-5 h-5" />,
    title: 'Natural Language.',
    description: 'Speak in natural language, and Novation will understand you and your intent.',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'Lightning-Fast Analysis.',
    description: 'Processes millions of data points across the world to detect legal risks in seconds.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Smart Legal Reasoning.',
    description: 'Explains every decision with transparent legal logic and real references.',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Ongoing Monitoring.',
    description: 'Keeps track of your trademarks 24/7 and alerts you of potential conflicts.',
  },
]
