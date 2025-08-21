'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function LaunchSection() {
  const [showInfinite, setShowInfinite] = useState(false)

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#1a0000] via-black to-[#1a0000] text-white">


      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-[#8B0000] to-transparent opacity-30 blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-[#f8e4b6] mb-4">
          The Future of Law Starts Here.
        </h2>
        <p className="text-base md:text-lg text-[#cbbfa9] font-serif mb-12">
          Smarter law. Built by AI.
        </p>

        <div className="relative overflow-hidden">
          <div
            className={`flex transition-transform duration-700 ease-in-out`}
            style={{
              width: '200%',
              transform: showInfinite ? 'translateX(-50%)' : 'translateX(0%)',
            }}
          >
            {/* === PAGE 1: Alpha + Omega === */}
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full md:w-1/2 px-2">
              {/* Alpha */}
              <div className="flex flex-col w-full md:w-[22rem] p-6 rounded-3xl bg-gradient-to-br from-[#2e1a14] via-[#1a0d0a] to-[#3a211c] border border-[#a45e49]/40 shadow-[0_0_15px_rgba(164,94,73,0.1)]">
  <div className="flex items-center justify-between mb-4">
    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-[#47261d] text-[#f3dcc0] rounded-full">
      Coming Soon
    </span>
  </div>
  <h3 className="text-2xl font-serif text-[#f3dcc0] mb-2">Novation: Alpha</h3>
  <p className="text-[#ddc8b0] text-sm mb-6 font-light font-serif">
    The future of intellectual property analysis, research, and registration.
  </p>
  <button className="bg-[#47261d] text-[#f3dcc0] border border-[#a45e49]/40 px-4 py-2 rounded-md font-medium hover:bg-[#5a2d23] transition">
    Coming Soon
  </button>
  <ul className="mt-6 text-left text-[#ddc8b0] space-y-2 text-sm font-serif">
    <li>- Global IP search & registration</li>
    <li>- Instant risk analysis</li>
    <li>- Smart, real-time monitoring</li>
    <li>- Trademarks, copyrights, patents, etc.</li>
    <li>- One-click global filings</li>
  </ul>
</div>



              {/* Omega */}
              <div className="flex flex-col w-full md:w-[22rem] p-6 rounded-3xl bg-gradient-to-b from-[#2e0d11] via-[#1a0000] to-[#2e0d11] border border-[#b93a52]/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-[#3b0f12] text-[#f8e4b6] rounded-full">
                    In Development
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-[#f8e4b6] mb-2">Novation: Omega</h3>
                <p className="text-[#cbbfa9] text-sm mb-6 font-light font-serif">
                  Redefining what it means to interpret every aspect of the law.
                </p>
                <button className="bg-[#3b0f12] text-[#f8e4b6] border border-[#b93a52]/30 px-4 py-2 rounded-md font-medium hover:opacity-90 transition">
                  In Development
                </button>
                <ul className="mt-6 text-left text-[#cbbfa9] space-y-2 text-sm font-serif">
                  <li>- Dynamic policy simulation</li>
                  <li>- End-to-end legal OS</li>
                  <li>- AI-native law firm</li>
                  <li>- Plugs into firms, governments, etc.</li>
                  <li>- Adapts to real-world change</li>
                </ul>
              </div>
            </div>

            {/* === PAGE 2: Infinite === */}
         <div className="flex justify-center items-start w-full md:w-1/2 px-2">
  <div className="w-full md:w-[22rem] p-[2px] rounded-3xl bg-gradient-to-br from-[#1a0a0a] via-[#1a0000] to-[#2e0d11]">
    <div className="flex flex-col p-6 rounded-[1rem] bg-[#0c0002] text-white w-full h-full border border-[#7c3f20] shadow-[0_0_30px_#7c3f2080,0_0_10px_#7c3f2040] transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-[#2e1307] text-[#f4c089] rounded-full">
          ??? {/* Replace with real status */}
        </span>
      </div>
      <h3 className="text-2xl font-serif text-[#f4c089] mb-2">Novation: Infinite</h3>
      <p className="text-[#d6bfa1] text-sm mb-6 font-light font-serif">
        ???
      </p>

      <div className="group relative h-10">
        <button
          className="bg-[#2b130b] border border-[#7c3f20] hover:bg-[#3b1a0e] text-[#f4c089] px-4 py-2 rounded-md font-medium transition group-hover:opacity-0 absolute top-0 left-0 w-full h-full z-10"
        >
          ??? {/* Replace with real CTA */}
        </button>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-2 left-0 right-0 text-sm text-[#b39b80] italic z-0">
          Coming in the Future.
        </div>
      </div>

      <ul className="mt-6 text-left text-[#d6bfa1] space-y-2 text-sm font-serif">
        <li>???</li>
        <li>???</li>
        <li>???</li>
        <li>???</li>
        <li>???</li>
      </ul>
    </div>
  </div>
</div>





          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setShowInfinite(!showInfinite)}
            className="absolute top-1/2 -translate-y-1/2 right-0 bg-[#3b0f12] hover:opacity-90 text-[#f8e4b6] p-2 rounded-full transition"
          >
            {showInfinite ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </section>
  )
}
