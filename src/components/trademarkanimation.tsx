'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const codeSnippets = [
  "Analyzing trademark class overlap...",
  "Querying USPTO database...",
  "Evaluating likelihood of confusion...",
  "Checking domain availability...",
  "Crawling social platforms for use cases...",
  "Pulling state common law records...",
  "Generating risk report...",
  "Cross-referencing filings with AI vector DB...",
  "Highlighting possible conflicts...",
  "Finalizing legal opinion draft..."
]

const riskLevels = ['Low Risk', 'Medium Risk', 'High Risk']

export function CodeVisual() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [showRisk, setShowRisk] = useState(false)
  const [risk, setRisk] = useState('')

  useEffect(() => {
    let index = 0
    setVisibleLines([])
    setShowRisk(false)

    const interval = setInterval(() => {
      if (index < codeSnippets.length) {
        setVisibleLines(prev => [...prev, codeSnippets[index]])
        index++
      } else {
        clearInterval(interval)
        const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]
        setRisk(riskLevel)
        setShowRisk(true)

        // Restart everything after 3 seconds
        setTimeout(() => {
          setVisibleLines([])
          setShowRisk(false)
        }, 3000)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [risk]) // rerun animation on risk change

  return (
    <div className="relative w-full h-[600px] hidden lg:flex flex-col justify-start gap-2 p-4 bg-[#1a0000]/20 rounded-xl border border-[#b93a52]/20 backdrop-blur-sm">
      {/* Code Lines */}
      <AnimatePresence>
        {visibleLines.map((line, idx) => (
          <motion.div
            key={line}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-[#f8e4b6] font-mono px-4 py-1 bg-[#2a0000]/40 rounded-md"
          >
            {line}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Risk Output */}
      {showRisk && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-auto py-3 text-center text-sm font-bold font-mono tracking-wide border rounded-lg ${
            risk === 'Low Risk'
              ? 'text-green-400 border-green-400/60'
              : risk === 'Medium Risk'
              ? 'text-yellow-300 border-yellow-300/60'
              : 'text-red-400 border-red-400/60'
          }`}
        >
          Risk Assessment: {risk}
        </motion.div>
      )}
    </div>
  )
}
