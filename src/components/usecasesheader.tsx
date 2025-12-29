'use client'

import { motion } from 'framer-motion'

export default function UseCasesHeader() {
  return (
    <section className="relative pt-36 pb-24 px-6 bg-[#1A0006] text-white">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl"
      >
        {/* Eyebrow */}
        <p className="text-xs tracking-[0.2em] uppercase text-[#D2A679] font-sans mb-5">
          Use Cases
        </p>

        {/* Title */}
        <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-[#F0D9A8] mb-8">
          How teams can use Novation.
        </h1>

        {/* Supporting copy */}
        <p className="text-lg leading-7 text-[#E0D1B6] font-sans max-w-[60ch]">
          Novation is made to fit into existing workflows, not replace them.
          Below are practical ways different teams can use Novation to make clearer, faster,
          and more defensible decisions.
        </p>
      </motion.div>
    </section>
  )
}
