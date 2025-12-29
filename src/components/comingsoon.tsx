'use client'

import Link from 'next/link'

export default function ComingSoonPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#2A000A] text-white">
      {/* ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(rgba(248,228,182,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.035)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] bg-[radial-gradient(circle,rgba(58,10,10,0.35),transparent_60%)] blur-[190px] -z-20" />

      <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-28 md:pt-36 pb-20">
        <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
          Coming soon
        </p>

        <h1 className="mt-4 font-serif text-5xl md:text-6xl leading-[1.02] text-[#F0D9A8]">
          We’re building this now.
        </h1>

        <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans">
          This page is live in our roadmap and will be published shortly. 
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/contactus"
            className="inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium font-sans
                       bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition
                       shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            Request a Demo
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium font-sans
                       border  bg-[#120006]/40 text-[#F0D9A8]
                       hover:bg-[#120006]/60 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* <div className="mt-12 rounded-3xl border border-[#DDB982]/10 bg-[#0c0002]/25 backdrop-blur-sm p-6">
          <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679]/80 font-sans">
            Status
          </p>
          <p className="mt-3 text-sm text-[#E0D1B6]/85 font-sans">
            In development • UI polish + content next • Shipping in stages
          </p>
        </div> */}
      </div>
    </main>
  )
}
