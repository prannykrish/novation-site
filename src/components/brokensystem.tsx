'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const statsRow1 = [
  '5.1 billion people lack meaningful access to justice (UNDP).',
  '1 in 3 people experience a legal problem every year.',
  '77% of legal problems never reach a formal legal system.',
  '4.4 billion people live outside the protection of the law.',
  '90% of civil legal issues in low-income countries go unresolved.',
  'Only 1 legal aid lawyer per 6,000 people in some regions.',
  'Rural courts in India are backlogged by 25+ years.',
  'Over 70% of global legal aid is underfunded or unavailable.',
  'In the U.S., 92% of evictions happen without tenants having legal help.',
  'Women in 104 countries still face legal gender discrimination.',
  'Ethnic minorities are 3x more likely to distrust legal institutions.',
  '90% of court systems worldwide still rely on paper records.',
  'In some nations, a case can take 15 years to reach judgment.',
];

const statsRow2 = [
  '50% of startups face legal threats in their first 5 years',
  'Over $250B lost annually due to weak IP enforcement (WIPO).',
  '1 in 5 trademarks face opposition during registration.',
  'Legal fees average $3,000–$10,000 just to file a single patent.',
  'SMEs spend $12K–$30K/year on basic compliance alone.',
  'Only 3% of global patents come from low-income countries.',
  '45% of startup founders delay legal filings due to confusion.',
  'Over 30% of small businesses report IP theft in their first 3 years.',
  'Cross-border IP disputes can take up to 3 years to resolve.',
  'Copyright claims remove 500M+ pieces of content annually.',
  'Most startup acquisitions fall through due to legal gaps.',
  'Poor contract structuring costs businesses over $100B/year.',
  'Legal mistakes kill 1 in 4 early-stage funding rounds.',
];

const statsRow3 = [
  'AI laws lag 5–10 years behind the tech they regulate.',
  '97% of smart contracts operate in legal grey zones.',
  '70+ countries lack clear data protection frameworks.',
  'Digital evidence is rejected in 60% of courtrooms globally.',
  'Cybercrime costs $8 trillion annually — law can’t keep up.',
  'Only 14% of courts use modern digital filing systems.',
  '90% of regulatory language is unreadable to the public.',
  'Legal code reform cycles average 9–14 years.',
  'Only 3 countries have legal standards for autonomous AI.',
  'Open-source projects face 80+ overlapping licenses & risks.',
  'Blockchain legality varies in 130+ jurisdictions.',
  'AI decisions are often legally unexplainable in court.',
  'Lawmakers pass tech-related bills without expert review 85% of the time.',
];

const glitchHeadlines = [
  [
    'Theranos collapses — $700M lost to fraudulent claims',
    'Juicero shuts down after IP ridicule and $120M burn',
    'Quibi loses $1.75B in under 6 months — licensing chaos blamed',
    'Zirtual implodes overnight due to payroll legal mismanagement',
    'Coolest Cooler sued — Kickstarter’s biggest failure',
    'PowaTag dies after $175M valuation evaporates — contract disputes',
    'BitConnect vanishes after $1B scam — legal system slow to act',
  ],
  [
    'Meta sued over “Meta” name — smaller company held rights',
    'Apple vs. Prepear — trademark over a pear logo',
    'Nike sues MSCHF over “Satan Shoes” — settlement reached',
    'Zoom sued for trademark by real “Zoom” videoconf company',
    'Tesla sued over “Autopilot” naming — misleading claims',
    'Facebook faces patent troll lawsuit over user interface',
    '“Cocky” trademark blocks hundreds of creators on Amazon',
  ],
  [
    'Yeezy fails to protect brand early — massive counterfeits emerge',
    'LegalZoom client loses home due to template error',
    'Founder files in wrong class — loses $2M brand overnight',
    'Startup name approved in state, rejected federally — forced rebrand',
    'USPTO rejects application over missing comma',
    'Crypto startup misspells filing — voids entire SEC exemption',
    'Amazon brand suspended after mistaken copyright takedown',
  ],
  [
    'US court backlog hits 2 years — thousands await resolution',
    'India surpasses 50 million pending cases — 80-year backlog forecasted',
    'FTC server outage misses merger deadline — $400M lost',
    'DOJ mistakenly files sensitive case data publicly',
    'E-signature rejected — contract voided in $50K deal',
    'Case dismissed over fax filing delay',
    'Patent lost because of daylight savings timing issue',
  ],
  [
    'AI copyright lawsuit filed against OpenAI — billions at stake',
    'Stability AI sued over scraped art — unclear fair use limits',
    'Tesla autopilot crash raises legal questions — no precedent exists',
    'Deepfake videos challenge legal evidence standards',
    'ChatGPT banned in Italy over data privacy concerns',
    'AI-generated song triggers takedown — no clear authorship law',
    'Robotics company fined — no legal framework for machine liability',
  ],
  [
    'Founder jailed for investor fraud — unclear financial disclosure rules',
    'Startup collapses after founder ignored equity paperwork',
    'Co-founder walks away — no vesting clause in place',
    'Missed filing voids Delaware C-corp protection',
    'Court rules against startup due to unsigned NDA',
    'Wrong jurisdiction listed — contract thrown out in court',
    'Non-compete violation forces startup to shut down',
  ],
];

const terminalMessages = [
  '> filing_system.connect()',
  '> ERROR: Jurisdiction not recognized',
  '> Retrying...',
  '> ERROR: Form LGR-19 not found',
  '> Lawsuit initiated against "halo.ai"',
  '> Case backlogged – estimated review: 14 months',
  '> System overload – delaying judgment...',
  '> ERROR: Regulation draft not found',
  '> Claim rejected — filed under wrong statute',
  '> Data sync failed with USPTO (timeout)',
  '> IP conflict detected in 12 jurisdictions',
  '> Startup "Argon" forced into rebrand',
  '> ERROR: Legal basis could not be explained',
  '> Filing window expired — restart required',
];

function InfiniteRow({ items, direction = 'left', duration = 20 }: { items: string[]; direction?: 'left' | 'right'; duration?: number }) {
  const motionDirection = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

  return (
    <div className="relative overflow-hidden whitespace-nowrap mb-4">
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#180000] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#180000] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-6 w-max"
        style={{ willChange: 'transform' }}
        animate={{ x: motionDirection }}
        transition={{ duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
      >
        {[...items, ...items].map((text, i) => (
          <div
            key={i}
            className="inline-block px-6 py-3 rounded-2xl bg-[#2a0a0a] text-base font-serif border border-[#3a0e0e] shadow-inner backdrop-blur-md text-[#f7e4c7]"
          >
            {text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function GlitchCard({ headlines }: { headlines: string[] }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const fontClasses = [
    'font-serif font-bold',
    'font-sans font-extrabold',
    'font-mono tracking-tight',
    'font-sans font-medium italic',
    'font-serif italic',
  ];
  const [fontClass, setFontClass] = useState(fontClasses[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      let newIndex = index;
      while (newIndex === index) {
        newIndex = Math.floor(Math.random() * headlines.length);
      }
      setIndex(newIndex);
      setFontClass(fontClasses[Math.floor(Math.random() * fontClasses.length)]);
    }, Math.random() * 1500 + 2000);
    return () => clearInterval(interval);
  }, [index, headlines.length]);

  useEffect(() => {
    const delay = Math.random() * 1000;
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative bg-[#1c0000] border border-[#3a0e0e]/30 rounded-3xl px-4 py-3 shadow-[inset_0_0_20px_#140000] backdrop-blur-sm overflow-hidden h-28 flex items-center"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`${fontClass} uppercase text-sm text-[#fef2dc]`}
        >
          {headlines[index]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function BrokenSystem() {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        const next = [...prev, terminalMessages[index % terminalMessages.length]];
        return next.length > 12 ? next.slice(1) : next;
      });
      index++;
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative bg-[#180000] text-[#f7e4c7] py-32 overflow-hidden"
    >
      {/* Ambient Radial Glow */}
      <div
        className="absolute inset-0 -z-10 blur-2xl opacity-30"
        style={{
          background: 'radial-gradient(circle at center, #2b0508 0%, #180000 50%, #0f0000 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-serif font-normal text-[#f8e4b6] tracking-tight leading-tight mb-6">
  The Legal Industry is Slowly Failing.
</h2>

        <p className="text-xl text-[#c8b6a6] font-serif max-w-3xl mx-auto mb-12">
          And it’s breaking everything it was meant to protect.
        </p>

        <InfiniteRow items={statsRow1} direction="left" duration={120} />
        <InfiniteRow items={statsRow2} direction="right" duration={140} />
        <InfiniteRow items={statsRow3} direction="left" duration={130} />
      </div>

      <div className="mt-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {glitchHeadlines.map((headlines, i) => (
            <GlitchCard key={i} headlines={headlines} />
          ))}
        </div>

        <div className="bg-[#120000] border border-[#3a0e0e] rounded-3xl p-6 font-mono text-sm text-[#f7e4c7] shadow-inner h-[500px] overflow-hidden">
          <div className="flex flex-col gap-1">
            {visibleMessages.map((msg, i) => (
              <motion.div
                key={`line-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="whitespace-pre-wrap"
              >
                {msg}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
