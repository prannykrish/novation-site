'use client';

import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Settings, Layers, Eye, RefreshCcw, Rocket } from 'lucide-react';

const visionFeatures = [
  {
    label: 'Legal OS',
    title: 'A Unified Legal Infrastructure.',
    description:
      'Novation becomes the operating system for law - integrating policy, contracts, filings, IP, and governance into one cohesive AI ecosystem.',
    icon: <Settings className="w-12 h-12 text-[#f8e4b6]" />,
  },
  {
    label: 'Dynamic by Design',
    title: 'Law that Evolves in Real Time.',
    description:
      'Instead of static regulations, Novation enables laws to adapt intelligently to data, events, and edge cases - instantly and transparently.',
    icon: <RefreshCcw className="w-12 h-12 text-[#f8e4b6]" />,
  },
  {
    label: 'Beyond Search',
    title: 'Intelligence at its Core.',
    description:
      'Go beyond just legal search. Novation turns intent into action, automating filings, responses, and compliance across global jurisdictions.',
    icon: <Rocket className="w-12 h-12 text-[#f8e4b6]" />,
  },
];

const manifesto = [
  {
    icon: <Settings className="w-6 h-6 mx-auto mb-4 text-[#f8e4b6]" />,
    text: "We’re not fixing the system. We're replacing it entirely.",
  },
  {
    icon: <Layers className="w-6 h-6 mx-auto mb-4 text-[#f8e4b6]" />,
    text: "One system. All processes. Every environment.",
  },
  {
    icon: <Eye className="w-6 h-6 mx-auto mb-4 text-[#f8e4b6]" />,
    text: "Not law as it stands - law redefined for a dynamic world.",
  },
];

export default function MissionVisionSection() {
  return (
    <section className="relative py-32 bg-gradient-to-br from-[#140102] via-[#1c0203] to-[#2e0d11] text-[#f8e4b6] overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#8B0000]/30 to-transparent blur-3xl opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-normal mb-4 text-[#f6d8a8]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Rewriting the DNA of the Law.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-md md:text-lg text-[#d2c5b0] font-serif font-light mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          The legal system is incompatible with the future. We’re rebuilding it from the ground up: intelligent, dynamic, and built to empower innovation.
        </motion.p>

        {/* Manifesto Grid */}
        {/* Manifesto Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
  {[
    {
      icon: Settings,
      title: 'System Replaced.',
      subtext: "We’re not fixing the system. We're replacing it entirely.",
    },
    {
      icon: Layers,
      title: 'One Law Engine.',
      subtext: 'One centralized system. All processes. Every environment.',
    },
    {
      icon: Eye,
      title: 'Law, Redefined.',
      subtext: 'Not law as it stands - law built for a dynamic world.',
    },
  ].map((item, i) => (
    <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} key={i} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 * i }}
        viewport={{ once: true }}
        className="relative bg-white/5 backdrop-blur-md border border-[#b93a52]/20 shadow-[0_0_60px_rgba(185,58,82,0.12)] rounded-3xl hover:brightness-110 p-6 flex flex-col text-center items-center w-full transition duration-300"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-[#2a0000] p-2 rounded-xl border border-[#8b0000]">
            <item.icon className="w-6 h-6 text-[#f8e4b6]" />
          </div>
          <h3 className="text-lg font-serif text-[#f8e4b6]">{item.title}</h3>
        </div>
        <p className="text-[#cbbfa9] text-sm font-light font-serif">{item.subtext}</p>
      </motion.div>
    </Tilt>
  ))}
</div>



        {/* Divider */}
        <div className="w-16 h-[2px] bg-[#f8e4b6]/20 mx-auto my-24 opacity-50" />

        {/* Vision Feature Grid */}
        <div className="max-w-6xl mx-auto px-6 mt-24 space-y-24">
          {visionFeatures.map((item, i) => {
            const isReversed = i === 1;

            return (
              <div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-2 items-center gap-12 ${isReversed ? 'md:flex-row-reverse md:space-x-reverse' : ''}`}
              >
                {/* Visual Card */}
                <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-full h-auto rounded-3xl bg-[#130202]/60 border border-[#8b1e1e]/40 backdrop-blur-sm shadow-xl px-6 py-6"
                  >
                    {i === 0 ? (
                     <div className="w-full h-full rounded-3xl px-6 py-6 flex items-center justify-center">
  <div className="flex flex-col gap-2">
    {[...Array(5)].map((_, row) => (
      <div key={row} className="flex gap-8">
        {[...Array(9)].map((_, idx) => (
          <motion.div
            key={idx}
            className="w-4 h-4 rounded-full bg-[#f8e4b6]/20"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2,
              delay: idx * 0.15 + row * 0.07,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    ))}
  </div>
</div>




















                    ) : i === 1 ? (
                     <div className="grid grid-cols-5 grid-rows-5 gap-2 p-4 rounded-2xl h-[200px] w-full">
  {Array.from({ length: 25 }).map((_, idx) => (
    <div
      key={idx}
      className="w-full h-full rounded bg-[#f8e4b6]/20 animate-pulse"
      style={{
        animationDelay: `${(idx % 5) * 0.2}s`,
        animationDuration: `${1 + (idx % 3)}s`,
      }}
    />
  ))}
</div>




                    ) : (
                      <div className="w-full h-full flex flex-col justify-center items-center space-y-4 py-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="w-3/4 h-4 rounded-md bg-[#f8e4b6]/20 animate-pulse"
                            style={{
                              animationDelay: `${idx * 0.2}s`,
                              animationDuration: '2s',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </Tilt>

                {/* Text Block */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-left"
                >
                  <p className="text-sm uppercase tracking-wider text-[#9d3b3b]/70 font-serif font-medium mb-2">
                    {item.label}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#f6d8a8] mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[#d2c5b0] text-base font-light font-serif leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
