'use client'

import Link from 'next/link'

type CTAProps = {
  title?: string
  ctaText?: string
  href?: string
  bgImage?: string
}

export default function WideCTACard({
  title = 'Analysis, already reasoned. Ready for review.',
  ctaText = 'Learn More',
  href = '/features',
  bgImage = '/images/redsunflower.jpg', // <- swap this
}: CTAProps) {
  return (
    <section className="relative py-20 bg-[#2A000A] text-white overflow-hidden">
      {/* subtle velvet ambience behind the card */}
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-95" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-30 blur-[160px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />

          {/* Dark overlay + vignette (this is the “Eva” feel) */}
          <div className="absolute inset-0 bg-black/80 " />
          <div className="absolute inset-0 [box-shadow:inset_0_0_180px_rgba(0,0,0,0.75)]" />
          <div className="absolute inset-0 " />

          {/* Content */}
          <div className="relative z-10 px-10 py-14 md:px-14 md:py-16">
            <h2 className="font-serif text-4xl md:text-4xl leading-[1.02] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)] whitespace-pre-line max-w-[22ch]">
              {title}
            </h2>

            <div className="mt-10">
              <Link
    href="/contactus"
    className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium font-sans
               bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition
               shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
  >
    Learn More
  </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
