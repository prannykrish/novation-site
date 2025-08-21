import Link from 'next/link'

const links = [
  { title: 'Features', href: '/features' },
  { title: 'Our Vision', href: '/ourvision' },
  { title: 'Contact Us', href: '/contactus' },
  // { title: 'Help', href: '/help' },
  // { title: 'About', href: '/about' },
]

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden py-12 bg-gradient-to-br from-[#130202] font-serif via-[#200305] to-[#2b0508] text-white">
      {/* Velvet Ambient Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1a0000] via-black to-[#1a0000] opacity-90" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#8B0000] to-transparent opacity-30 blur-3xl -z-10" />

      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-[#b89e8c] order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} Novation Technologies, LLC. All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-[#d8c5b3] hover:text-[#f8e4b6] transition duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
