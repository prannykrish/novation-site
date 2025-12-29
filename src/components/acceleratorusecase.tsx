'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function UseCaseAccelerators_ProgramPolicy() {
  return (
    <section className="relative py-28 md:py-32 bg-[#2A000A] text-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT: framing */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
              Use case
            </p>

            <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-[#F0D9A8]">
              Accelerator programs.
            </h2>

            <p className="mt-6 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[56ch]">
              A single, consistent standard for validating company and product marks across an entire
              cohort, without slowing founders down.
            </p>
          </motion.div>

          {/* RIGHT: policy list */}
          <div className="lg:col-span-7">
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.06 }}
                viewport={{ once: true }}
              >
                <PolicyItem
                  number="01"
                  title="Cohort-wide intake"
                  desc="All startup and product names are screened at once using the same baseline standard."
                />
              </motion.div>
              <div className="h-px flex-1 bg-[#DDB982]/10" />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                viewport={{ once: true }}
              >
                <PolicyItem
                  number="02"
                  title="Continuous validation"
                  desc="Names are re-checked automatically as founders iterate, pivot, or expand their offerings."
                />
              </motion.div>
              <div className="h-px flex-1 bg-[#DDB982]/10" />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                viewport={{ once: true }}
              >
                <PolicyItem
                  number="03"
                  title="Escalation, not noise"
                  desc="Only material risk is flagged for review, so mentors and partners focus on decisions that actually matter."
                />
              </motion.div>
              <div className="h-px flex-1 bg-[#DDB982]/10" />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                viewport={{ once: true }}
              >
                <PolicyItem
                  number="04"
                  title="Auditable program record"
                  desc="Every check leaves a traceable record founders can reference later for diligence, fundraising, or outside counsel."
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PolicyItem({
  number,
  title,
  desc,
}: {
  number: string
  title: string
  desc: string
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0">
        <span className="font-serif text-xl text-[#D2A679]/80">{number}</span>
      </div>

      <div>
        <p className="font-serif text-2xl leading-[1.12] text-[#F0D9A8]">{title}</p>
        <p className="mt-2 text-[15px] leading-7 text-[#E0D1B6] font-sans max-w-[60ch]">
          {desc}
        </p>
      </div>
    </div>
  )
}
