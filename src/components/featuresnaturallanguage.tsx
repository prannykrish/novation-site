'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

type BulletProps = { title: string; body: string }

export default function FeatureNaturalLanguage() {
  return (
    <section className="relative overflow-hidden bg-[#1A0006] text-white">
      {/* Keep your velvet base, no “UI chrome” */}
      <div className="pointer-events-none absolute inset-0 -z-10 [box-shadow:inset_0_0_240px_rgba(0,0,0,0.55)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="pt-28 md:pt-36 pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <p className="text-xs tracking-[0.18em] uppercase text-[#d2a679] font-sans">
                Commonspeak
              </p>

              <h2 className="mt-6 font-serif text-4xl md:text-5xl leading-[1.05] text-[#F0D9A8]">
                Natural language input.
              </h2>

              <p className="mt-5 text-[15px] md:text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[60ch]">
                Describe the mark the way a client would, and Novation translates it into a structured analysis.
              </p>

              <div className="mt-8 space-y-5">
                <Bullet
                  title="Less translation work"
                  body="Attorneys and staff don’t have to convert messy ideas into search syntax. Let the idea stay messy."
                />
                <Bullet
                  title="Better context captured"
                  body="The model asks follow-up questions to widen discovery and reduce blind spots."
                />
                <Bullet
                  title="Maximizes understanding"
                  body="In just a few simple questions, Novation captures what it needs to do a thorough knockout."
                />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/contactus"
                  className="inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium font-sans
                             bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition
                             shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                >
                  Request a Demo
                </Link>
              </div>
            </motion.div>

            {/* Right: single image (no stacked depth) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.40)]">
  <div className="relative w-full aspect-video bg-[#120006] overflow-hidden">
    <Image
      src="/images/convo2 1.png"
      alt="Natural language examples"
      fill
      className="object-cover"
      style={{ objectPosition: '40% 35%' }}
      sizes="(min-width: 1024px) 58vw, 100vw"
      
      quality={100}
    />

    {/* Velvet overlay */}
    <div className="pointer-events-none absolute inset-0 bg-[#120006]/10" />

    {/* Soft vignette edges (no heavy bottom) */}
    <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_40px_rgba(0,0,0,0.18),inset_0_0_80px_rgba(0,0,0,0.12)]" />

    {/* Grain */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)] [background-size:3px_3px]" />
  </div>
</div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Bullet({ title, body }: BulletProps) {
  return (
    <div className="relative pl-5">
      <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-[#DDB982]/55" />
      <p className="font-sans text-sm text-[#F0D9A8]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#E0D1B6]/80 font-sans">
        {body}
      </p>
    </div>
  )
}
