'use client'

import Link from 'next/link'

type Tile = {
  title: string
  subtitle: string
  href: string
  cta: string
  bgImage: string // can be gif/webp/jpg
  // optional: tint/overlay tweaks per tile
  overlay?: string
}

export default function OurGoal() {
  const tiles: Tile[] = [
    {
  title: 'Analysis preparation, not a search tool.',
  subtitle:
    'Turn searching into a repeatable, efficient workflow. Context in, data pre-processed, analysis ready.',
  href: '/features',
  cta: 'Learn More',
  bgImage: 'images/attempt.jpg', // ← remove image
  overlay: 'bg-[#2A000A]/93',
},

    {
  title: 'Novation Beta V1',
  subtitle:
    'Analyze our beta v1 demo to see what it can do and how we plan to make it even better.',
  href: '#demo',
  cta: 'Watch Now',
  bgImage: '/images/redthieves.webp', // ← remove image
  overlay: 'bg-[#2A000A]/50', // flat, honest
},

    {
      title: 'Resources',
      subtitle:
        'Read our guides and case studies to see the full picture.',
      href: '/resources',
      cta: 'Resources',
      bgImage: '/images/redbooks.jpg',
      overlay: 'bg-[#120006]/60',
    },
    {
      title: 'Request a Demo',
      subtitle:
        'Get Novation into your hands and see how it can enhance your workflow today.',
      href: '/contactus',
      cta: 'Request a Demo',
      bgImage: '/images/redsignup.jpg',
      overlay: 'bg-[#120006]/55',
    },
    {
      title: 'From searching to systems',
      subtitle:
        'A system that evolve, enforce, and scale.',
      href: '/features#roadmap',
      cta: 'Our Roadmap',
      bgImage: '/images/redliquid2.jpg',
      overlay: 'bg-[#120006]/62',
    },
    {
  title: 'Clear use case, clear benefits.',
  subtitle:
    'Built not to change, but to enhance. Built not to replace judgement, but to make it smarter.',
  href: '/usecases',
  cta: 'Use Cases',
  bgImage: '/images/redlines.jpg',
  overlay: 'bg-[#120006]/80',
},

  ]

  return (
    <section className="relative py-24 bg-[#2A000A] text-white">
<div className="mx-auto w-full max-w-7xl 2xl:max-w-[1600px] px-4 md:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* Header (keep it simple + premium) */}
        {/* <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#DDB982] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
            The Law, Reimagined as Intelligence.
          </h2>
          <p className="mt-5 text-base md:text-lg font-sans leading-relaxed text-[#E0D1B6]">
            Novation turns legal analysis into software: structured, repeatable, and defensible — starting
            with trademark clearance and risk.
          </p>
        </div> */}

        {/* EVA-style mosaic */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[280px] md:auto-rows-[260px] lg:auto-rows-[290px]">
          {/* BIG left tile (spans 2 rows, wide) */}
          <MosaicTile
            tile={tiles[0]}
            className="md:col-span-7 md:row-span-2"
            titleClassName="text-3xl md:text-4xl"
          />

          {/* Top right wide tile */}
          <MosaicTile
            tile={tiles[1]}
            className="md:col-span-5 md:row-span-1"
            titleClassName="text-2xl md:text-3xl"
          />

          {/* Two right small tiles stacked */}
          <MosaicTile
            tile={tiles[2]}
            className="md:col-span-2 md:row-span-1"
            compact
          />
          <MosaicTile
            tile={tiles[3]}
            className="md:col-span-3 md:row-span-2"
            compact
          />

          {/* Bottom wide tile spanning most of the row */}
          <div className="md:col-span-9 md:row-span-1 grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
  {/* Left square-ish */}
  <MosaicTile
    tile={tiles[4]}
    className="md:col-span-4 h-full"
    titleClassName="text-2xl md:text-3xl"
  />

  {/* Right longer rectangle */}
  <MosaicTile
    tile={tiles[5]}
    className="md:col-span-8 h-full"
    titleClassName="text-2xl md:text-3xl"
  />
</div>

        </div>
      </div>
    </section>
  )
}

function MosaicTile({
  tile,
  className = '',
  compact = false,
  titleClassName = 'text-2xl md:text-3xl',
}: {
  tile: Tile
  className?: string
  compact?: boolean
  titleClassName?: string
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl',
        'shadow-[0_18px_60px_rgba(0,0,0,0.35)]',
        className,
      ].join(' ')}
    >
      {/* Background image/gif */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${tile.bgImage})` }}
      />

      {/* Dark velvet overlay + subtle vignette */}
      <div className={['absolute inset-0', tile.overlay ?? 'bg-[#120006]/60'].join(' ')} />
      <div className="absolute inset-0 [box-shadow:inset_0_-120px_140px_rgba(0,0,0,0.55)]" />

      {/* Content */}
      <div
        className={[
          'relative z-10 h-full p-7 md:p-8 flex flex-col justify-end',
          compact ? 'gap-2' : 'gap-3',
        ].join(' ')}
      >
        <h3
          className={[
            'font-serif text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]',
            compact ? 'text-xl md:text-2xl' : titleClassName,
            'leading-[1.05]',
          ].join(' ')}
        >
          {tile.title}
        </h3>

        <p
          className={[
            'font-sans text-[#E0D1B6] leading-relaxed',
            compact ? 'text-sm md:text-sm' : 'text-sm md:text-base',
            'max-w-[52ch]',
          ].join(' ')}
        >
          {tile.subtitle}
        </p>

        <div className="pt-2">
          <Link href={tile.href}>
            <button
              className={[
                'inline-flex items-center pointer-events-none justify-center',
                'rounded-xl px-6 py-2.5 text-sm font-sans font-medium',
                'bg-[#F0D9A8] text-[#2A000A]',
                'hover:bg-[#F0D9A8] transition-colors',
                'shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
              ].join(' ')}
            >
              {tile.cta}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
