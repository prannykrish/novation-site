// app/faq/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

type FAQ = { q: string; a: string }

export default function FAQPage() {
  const faqs: FAQ[] = useMemo(
    () => [
      {
        q: "Is Novation's analysis legal advice?",
        a: `No. Novation is an informational tool and does not take the position of providing legal advice. Trademark decisions should always be made by qualified legal professionals. Novation pre-processes information and analyzes similarities, but does not replace attorney judgment. `,
      },
      {
        q: 'What sources does Novation use?',
        a: `Currently, Novation analyzes USPTO signals and additional evidence surfaces (e.g., web/common-law signals) to expand conflict discovery beyond basic database lookups. Future iterations will utilize more sources to improve recall and defensibility (WIPO, EUIPO, state registries, businesses registries, etc.).`,
      },
      {
        q: 'How long does an analysis take?',
        a: `Our beta v1 is capable of running a thorough knockout for word marks in 2-3 minutes. Future iterations will provide more comprehensive analysis in even shorter times.`,
      },
      {
        q: 'Can you explain exactly how Novation does its analyzes and analyzes similarity?',
        a: `Novation uses a combination of established algorithms and pre-trained AI models to analyze trademark similarity. It evaluates multiple dimensions of similarity, including visual, phonetic, and conceptual aspects, and cross-references findings with sourced evidence. Novation does not calculate random scores unlike current search tools, but rather analyzes context in multiple facets to create an argument. The exact methodologies are proprietary, but the system is designed to provide transparent and auditable outputs that attorneys can review and trust.`,
      },
      {
        q: 'Do you train models on customer data?',
        a: `No. Novation does not use customer-submitted data to train or fine-tune AI models. All analyses are performed using pre-trained models and established algorithms without incorporating user data into model training processes. We consider customer data as sensitive and confidential and thus treat it accordingly.`,
      },
      {
        q: 'How does your pricing plan work?',
        a: `Novation offers a monthly subscription model with unique pricing according to your organization's needs. Organizations will be provided limited searches and users charged on a monthly basis, and organizations can increase searches or users anytime by contacting Novation and upgrading their plan.`,
      },
      {
        q: 'What makes Novation different from current search tools?',
        a: `Novation takes the position of being an analysis preparation system for knockouts, not just a search tool. Current search tools focus on data retrieval and basic similarity metrics, often leaving attorneys to manually process and analyze results. Novation automates the pre-processing, analyzes minute similarities, and prepares structured outputs that attorneys can immediately use. Additionally, Novation is not based on random scoring algorithms, but rather real context comparison backed by auditable claims. Novation aims to eliminate manual data collection for trademark analysis altogether. `,
      },
      {
        q: 'Is Novation trying to replace trademark attorneys or legal judgment?',
        a: `Absolutely not. Novation is designed to augment and support trademark attorneys by automating the most tedious and manual aspects of trademark knockouts. The goal is to free up attorney time so they can focus on higher-level judgment calls, strategy, and client counseling. Novation provides thorough pre-processing and analysis preparation, but final decisions should always be made by qualified legal professionals.`,
      },
      {
        q: 'If Novation automates knockouts, does that mean attorneys are no longer needed?',
        a: `No. While Novation automates the data-intensive aspects of trademark knockouts, attorneys remain essential for interpreting results, making strategic decisions, and providing legal advice. Novation is a tool to enhance attorney efficiency and effectiveness, not replace their expertise.`,
      },
      {
        q: 'If Novation provides an incorrect analysis, who is liable?',
        a: `Novation is an informational tool and does not provide legal advice. Liability for trademark decisions ultimately rests with the qualified legal professionals making those decisions. Novation aims to provide accurate and thorough pre-processing and analysis preparation, but attorneys should always exercise their judgment and expertise when using the outputs provided by Novation.`,
      },
    ],
    []
  )

  return (
    <main className="relative min-h-screen bg-[#2A000A] text-white overflow-hidden">
      {/* Velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#1A0006] via-[#0B0002] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-35 blur-[180px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <header className="mx-auto max-w-5xl px-6 pt-30 pb-10">
          <div className="flex items-center justify-between gap-6">
            {/* <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/Logo.svg"
                alt="Novation logo"
                width={40}
                height={40}
                className="opacity-95"
                priority
              />
              <span className="font-serif text-2xl text-[#F0D9A8] tracking-tight">Novation</span>
            </Link> */}

            {/* <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-[#E0D1B6]/70">
              <Link className="hover:text-[#F0D9A8] transition" href="/features">
                Features
              </Link>
              <Link className="hover:text-[#F0D9A8] transition" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-[#F0D9A8] transition" href="/termsofservice">
                Terms
              </Link>
            </nav> */}
          </div>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">FAQ</p>
            <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
              Questions? Answers.
            </h1>
            <p className="mt-5 text-[17px] leading-7 text-[#E0D1B6] font-sans max-w-[68ch]">
              Clear, simple explanations - in the same spirit as the product.
            </p>
          </div>
        </header>

        {/* FAQ Panel (matches the screenshot’s “thin dividers + plus/minus” feel) */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="rounded-2xl border border-[#DDB982]/12 bg-white/[0.03] backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.40)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0" />

            <FAQList faqs={faqs} />
          </div>

          {/* CTA row like the reference vibe, but Novation palette */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/contactus"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium font-sans
                         bg-[#F0D9A8] text-[#2A000A] hover:bg-[#F0D9A8] transition
                         shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              Book a Call
            </Link>

            <p className="text-sm font-sans text-[#E0D1B6]/70">
              Still have a weird edge case? Email{' '}
              <a className="text-[#F0D9A8] hover:underline" href="mailto:hello@novationapp.com">
                hello@novationapp.com
              </a>
              
            </p>
          </div>
        </section>
      </motion.div>
    </main>
  )
}

function FAQList({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number>(-1)

  return (
    <div className="px-6 sm:px-10 py-6">
      {/* top hairline */}
      {/* <div className="h-px w-full bg-[#DDB982]/10" /> */}

      {faqs.map((item, i) => {
        const open = i === openIndex
        return (
          <div key={item.q} className="group">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="w-full py-6 flex items-center justify-between gap-6 text-left"
            >
              <span className="font-sans text-[15px] sm:text-base text-[#E0D1B6] group-hover:text-[#F0D9A8] transition">
                {item.q}
              </span>

              <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#DDB982]/14 bg-[#120006]/45">
                {open ? (
                  <Minus className="w-4 h-4 text-[#F0D9A8]" />
                ) : (
                  <Plus className="w-4 h-4 text-[#F0D9A8]/85" />
                )}
              </span>
            </button>

            {/* answer */}
            <div
              className={[
                'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              ].join(' ')}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-2 font-sans text-sm leading-6 text-[#E0D1B6]/75 max-w-[80ch]">
                  {item.a}
                </p>
              </div>
            </div>

            {/* divider */}
            <div className="h-px w-full bg-[#DDB982]/10" />
          </div>
        )
      })}
    </div>
  )
}
