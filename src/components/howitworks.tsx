'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Sparkles, Brain, ShieldCheck, Globe } from 'lucide-react'
import Tilt from 'react-parallax-tilt'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import { Engine } from 'tsparticles-engine'

const steps = [
  {
    icon: <Sparkles className="w-6 h-6 text-[#f8e4b6]" />,
    title: 'Speak Your Vision.',
    desc: 'Talk in natural language. Novation translates intent into legal analysis and strategy.',
  },
  {
    icon: <Brain className="w-6 h-6 text-[#f8e4b6]" />,
    title: 'A Search that Understands. ',
    desc: 'Goes beyond matching. Novation analyzes and interprets what really matters.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#f8e4b6]" />,
    title: 'From Idea to Insight.',
    desc: 'Watch risks, overlaps, and opportunities reveal themselves in seconds.',
  },
  {
    icon: <Globe className="w-6 h-6 text-[#f8e4b6]" />,
    title: 'Stay Two Steps Ahead.',
    desc: 'Continuous trademark monitoring across every frontier.',
  },
]

const codeSnippets = [
  `Analyzing trademark class overlap...`,
  `Querying USPTO database...`,
  `Evaluating likelihood of confusion...`,
  `Checking domain availability...`,
  `Crawling social platforms for use cases...`,
  `Pulling state common law records...`,
  `Generating risk report...`,
  `Cross-referencing filings with AI vector DB...`,
  `Highlighting possible conflicts...`,
  `Finalizing legal opinion draft...`,
]

const riskLevels = ['Low Risk', 'Medium Risk', 'High Risk']

export default function HowItWorks() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  const [activeLine, setActiveLine] = useState(-1)
  const [risk, setRisk] = useState('')
  const [showRisk, setShowRisk] = useState(false)

  useEffect(() => {
    if (!isInView) return

    let line = 0
    let lineInterval: NodeJS.Timeout
    let loopTimeout: NodeJS.Timeout

    const startCycle = () => {
      line = 0
      setActiveLine(-1)
      setShowRisk(false)
      setRisk('')

      lineInterval = setInterval(() => {
        setActiveLine(line)
        line++

        if (line >= codeSnippets.length) {
          clearInterval(lineInterval)

          setTimeout(() => {
            const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)]
            setRisk(randomRisk)
            setShowRisk(true)

            loopTimeout = setTimeout(() => {
              setShowRisk(false)
              loopTimeout = setTimeout(() => {
                startCycle()
              }, 1000)
            }, 3000)
          }, 500)
        }
      }, 500)
    }

    startCycle()
    return () => {
      clearInterval(lineInterval)
      clearTimeout(loopTimeout)
    }
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 px-6 bg-gradient-to-br from-[#120008] via-[#1a0000] to-[#26000d] text-white overflow-hidden"
    >
      <Particles
        id="particles-howitworks"
        init={particlesInit}
        className="absolute right-0 top-0 w-1/2 h-full -z-10 pointer-events-none"
        options={{
          fullScreen: false,
          background: { color: 'transparent' },
          particles: {
            number: { value: 50 },
            color: { value: '#f8e4b6' },
            shape: { type: 'circle' },
            opacity: { value: 0.15 },
            size: { value: 2 },
            move: {
              enable: true,
              speed: 0.3,
              direction: 'none',
              random: true,
              outModes: { default: 'out' },
            },
            links: {
              enable: true,
              distance: 120,
              color: '#f8e4b6',
              opacity: 0.05,
              width: 1,
            },
          },
        }}
      />

      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-serif text-[#f8e4b6] mb-4">The AI Trademark Analyst.</h2>
        <p className="text-md md:text-lg text-[#cbbfa9] font-serif">
          Reengineering trademark intelligence and processes with Novation AI.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left: Cards */}
        <div className="flex flex-col gap-12">
          {steps.map((step, idx) => (
            <Tilt
              key={idx}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable={false}
              glareMaxOpacity={0.05}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative p-6 rounded-3xl border border-[#b93a52]/30 bg-[#240305]
 text-left shadow-[0_0_40px_rgba(185,58,82,0.1)] hover:brightness-110 transition duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#2a0000] p-2 rounded-xl border border-[#8b0000]">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-serif text-[#f8e4b6]">{step.title}</h3>
                </div>
                <p className="text-[#cbbfa9] text-sm font-light font-serif">{step.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* Right: Terminal-like Visual */}
        <div className="relative w-full h-[600px] hidden lg:flex flex-col items-center justify-start gap-4 mt-[50px]">
          {codeSnippets.map((snippet, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeLine === idx ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-[#f8e4b6] font-mono px-4 py-1 bg-[#2a0000]/40 rounded-md"
            >
              {snippet}
            </motion.div>
          ))}

          <AnimatePresence>
            {showRisk && (
              <motion.div
                key="risk-output"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5 }}
                className="mt-4 px-6 py-3 border border-[#f8e4b6] text-[#1a0000] font-mono font-bold text-center rounded-md bg-[#f8e4b6] shadow-lg"
              >
                Risk Assessment: {risk}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
