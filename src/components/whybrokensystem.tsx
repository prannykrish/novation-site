'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Bug, Clock3, FileWarning, ShieldOff } from 'lucide-react';

const reasons = [
  {
    title: 'It Wasn’t Built to Scale.',
    icon: <Clock3 className="w-6 h-6 text-[#f8e4b6]" />,
    description:
      'Law was created for a slower, simpler world. It’s struggling to keep pace with the exponential acceleration of modern innovation.',
    tags: ['Pre-Internet Design', 'Centuries-Old Foundations', 'Slow Pace'],
  },
  {
    title: 'Infrastructure is Obsolete.',
    icon: <Bug className="w-6 h-6 text-[#f8e4b6]" />,
    description:
      'Most legal systems run on outdated tech, with poor data sharing, paper-based filings, and little to no automation.',
    tags: ['Manual Workflows', 'Disconnected Systems', 'No Interoperability'],
  },
  {
    title: 'The System Is Too Complex.',
    icon: <FileWarning className="w-6 h-6 text-[#f8e4b6]" />,
    description:
      'Even seasoned professionals can’t keep up. It’s a fragmented landscape of rules, exceptions, and constant changes.',
    tags: ['High Barrier to Entry', 'Opaque Language', 'Regulatory Fog'],
  },
  {
    title: 'Boundaries Break Logic.',
    icon: <ShieldOff className="w-6 h-6 text-[#f8e4b6]" />,
    description:
      'Each region has its own laws - which creates conflict, confusion, and huge costs for global ideas.',
    tags: ['Jurisdictional Clashes', 'No Standardization', 'Legal Borders'],
  },
];

export default function WhyItBreaks() {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-[#140102] via-[#200104] to-[#2e0d11] text-white">
      {/* Ambient Glow */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-radial from-[#8B0000] to-transparent opacity-25 blur-3xl -z-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-[#f6d8a8] mb-4">
          Why the System Breaks.
        </h2>
        <p className="text-lg md:text-base text-[#cbbfa9] font-serif mb-16">
          The legal industry was never designed to scale with humanity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {reasons.map((reason, i) => (
            <Tilt
              key={i}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable={false}
              glareMaxOpacity={0.05}
            >
              <motion.div
                whileHover={{scale: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md hover:brightness-110 border border-[#b93a52]/30 rounded-3xl p-6 flex flex-col items-center text-center w-full hover:shadow-2xl transition duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#2a0000] p-2 rounded-xl shadow-md border border-[#8b0000]">
                    {reason.icon}
                  </div>
                  <h3 className="text-lg font-serif text-[#f8e4b6]">{reason.title}</h3>
                </div>
                <p className="text-[#cbbfa9] text-sm mb-4 font-light font-serif">{reason.description}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {reason.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1 bg-[#3b0f12] text-[#f8e4b6] border border-[#b93a52]/40 rounded-full hover:opacity-90 transition font-serif"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
