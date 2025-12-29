'use client'

import Link from 'next/link'
import Image from 'next/image'

const linkGroups = [
  {
    title: 'Product',
    links: [
      { title: 'Features', href: '/features' },
      { title: 'Use Cases', href: '/usecases' },
      { title: 'Resources', href: '/resources' },
    ],
  },
  {
    title: 'Company',
    links: [
      // { title: 'Vision', href: '/ourvision' },
      { title: 'FAQ', href: '/faq' },
      { title: 'Terms of Service', href: '/termsofservice' },
      { title: 'Privacy Policy', href: '/privacypolicy' },
    ],
  },
]

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden bg-[#2A000A] text-white">
      {/* Velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#1A0006] via-[#0B0002] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-35 blur-[170px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left: logo + tagline */}
          <div className="md:col-span-4">
            <Link href="/#hero" aria-label="Back to top">
  <div className="flex items-center gap-3 cursor-pointer">
    <Image
      src="/images/Logo.svg"
      alt="Novation logo"
      width={40}
      height={40}
      className="opacity-95"
    />
    <span className="font-serif text-2xl text-[#F0D9A8] tracking-tight">
      Novation
    </span>
  </div>
</Link>


            <p className="mt-4 font-sans text-sm text-[#E0D1B6]/80 max-w-[34ch] leading-6">
              The OS for Trademarks.
            </p>

            <div className="mt-8 h-px w-24 bg-[#DDB982]/12" />
          </div>

          {/* Middle: link columns */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-10">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
                    {group.title}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="font-sans text-sm text-[#E0D1B6]/80 hover:text-[#F0D9A8] transition"
                        >
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <div className="md:col-span-3 md:justify-self-end">
            <p className="font-serif text-2xl text-[#F0D9A8]">
              Ready to get started?
            </p>

            <div className="mt-5">
              <Link href="/contactus">
                <button
                  className="
                    inline-flex items-center pointer-events-none justify-center
                    rounded-2xl px-6 py-2.5 text-sm font-medium font-sans
                    bg-[#F0D9A8] text-[#2A000A]
                    hover:bg-[#F0D9A8] transition
                    shadow-[0_12px_30px_rgba(0,0,0,0.35)]
                  "
                >
                  Request a Demo 
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom legal */}
        <div className="mt-14 pt-8 border-t border-[#DDB982]/10">
          <p className="font-sans text-xs text-[#E0D1B6]/60">
            © {new Date().getFullYear()} Novation Technologies, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
