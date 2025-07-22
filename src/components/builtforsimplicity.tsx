'use client';

import { Eye, Repeat, CloudLightning } from 'lucide-react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const features = [
  {
    title: 'Clarity.',
    icon: <Eye className="w-6 h-6" />,
    description: 'Uncover legal insights instantly - with precision, speed, and focus.',
  },
  {
    title: 'Flexibility.',
    icon: <Repeat className="w-6 h-6" />,
    description: 'No rigidity. No friction. Just legal infrastructure that evolves with you.',
  },
  {
    title: 'Efficiency.',
    icon: <CloudLightning className="w-6 h-6" />,
    description: 'Reach peak potential — faster, smarter, friction‑free.',
  },
];

export default function WhyNovationSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#2e0d11] via-[#1a0000] to-[#2e0d11] text-white py-28 px-6 sm:px-12 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif font-normal mb-4 text-[#f8e4b6]">
          Built for Simplicity.
        </h2>
        <p className="text-[#cbbfa9] text-lg md:text-base font-serif">
          Novation strips away the noise - making legal work simple, fast, and powerful.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 relative z-10">
        {features.map((f, idx) => (
          <Tilt
            key={idx}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable={false}
            glareMaxOpacity={0.1}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1 }}
              className="relative p-6 rounded-3xl hover:brightness-110 bg-[#240305] border border-[#b93a52]/30 text-center shadow-[0_0_40px_#5c0a17]/10 transition-all duration-300 flex flex-col items-center"
            >
              {/* Icon */}
              <div className="mb-4 p-3 rounded-xl bg-[#2a0000] border border-[#8b0000] inline-block shadow-md">
                <div className="text-[#f8e4b6]">{f.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-normal mb-2 text-[#f8e4b6] font-serif">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-[#cbbfa9] text-sm font-light font-serif">
                {f.description}
              </p>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
