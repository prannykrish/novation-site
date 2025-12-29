'use client'

import React from 'react'

export default function LaunchSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#1A0006] text-white">
      {/* Dark red velvet ambience (updated) */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#220008] via-[#120006] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-35 blur-[150px] -z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 [box-shadow:inset_0_1px_0_rgba(221,185,130,0.06)]" />

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Font + color rules aligned to Novation */}
        <h2 className="text-4xl md:text-5xl font-serif text-[#F0D9A8] mb-4 drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
          The Future of Law Starts Here.
        </h2>
        <p className="text-base md:text-lg text-[#E0D1B6] font-sans mb-12">
          Smarter law. Built by AI.
        </p>

        {/* Two cards only (no scroll) */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
          {/* Omega (unchanged content/design, only font/colors aligned) */}
          <div className="flex flex-col w-full md:w-[22rem] p-6 rounded-3xl bg-gradient-to-b from-[#2e0d11] via-[#1a0000] to-[#2e0d11] border border-[#b93a52]/30">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-[#3b0f12] text-[#F0D9A8] rounded-full font-sans">
                Beta v1 Available
              </span>
            </div>
            <h3 className="text-2xl font-serif text-[#F0D9A8] mb-2">Novation: Beta</h3>
            <p className="text-[#E0D1B6] text-sm mb-6 font-light font-sans">
              Maximizing the foundation: clear searching, analysis, and reporting.
            </p>
            <button className="bg-[#3b0f12] text-[#F0D9A8] border border-[#b93a52]/30 px-4 py-2 rounded-md  hover:opacity-90 transition font-sans">
              Beta v1 Available
            </button>
            <ul className="mt-6 text-left text-[#E0D1B6] space-y-2 text-sm font-sans">
              <li>- Deep knockout analysis</li>
              <li>- Natural language input</li>
              <li>- Structured reporting</li>
              <li>- Batch + portfolio searching</li>
            </ul>
          </div>

          {/* Infinite (unchanged content/design, only font/colors aligned) */}
          <div className="w-full md:w-[22rem] p-[2px] rounded-3xl bg-gradient-to-br from-[#1a0a0a] via-[#1a0000] to-[#2e0d11]">
            <div className="flex flex-col p-6 rounded-[1rem] bg-[#0c0002] text-white w-full h-full border border-[#7c3f20] shadow-[0_0_30px_#7c3f2080,0_0_10px_#7c3f2040] transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-[#2e1307] text-[#F0D9A8] rounded-full font-sans">
                  In Development {/* Replace with real status */}
                </span>
              </div>
              <h3 className="text-2xl font-serif text-[#F0D9A8] mb-2">Novation: Infinite</h3>
              <p className="text-[#E0D1B6] text-sm mb-6 font-light font-sans">The fully completed OS for Trademarks, completely functional and valuable.</p>

              <div className="group relative h-10">
                <button className="bg-[#2b130b] border border-[#7c3f20] hover:bg-[#3b1a0e] text-[#F0D9A8] px-4 py-2 rounded-md font-medium transition group-hover:opacity-0 absolute top-0 left-0 w-full h-full z-10 font-sans">
                  ??? {/* Replace with real CTA */}
                </button>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-2 left-0 right-0 text-sm text-[#E0D1B6]/70 italic z-0 font-sans">
                  Coming in the Future.
                </div>
              </div>

              <ul className="mt-6 text-left text-[#E0D1B6] space-y-2 text-sm font-sans">
                <li>- Global, multimodal clearance</li>
                <li>- Lifetime monitoring + alerts</li>
                <li>- Registration workflows</li>
                <li>- Full evidence surfaces</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
