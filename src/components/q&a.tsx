'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'What is Novation?',
      answer:
        'Novation is building an AI-native legal infrastructure to maximize the output and efficiency of every legal process and system. Our first tool is an AI Trademark Analyst, allowing IP professionals and law firms to analyze, research, and monitor trademarks like never before.',
    },
    {
      id: 'item-2',
      question: 'How does Novation work?',
      answer:
        'Our first product, the AI Trademark Analyst, lets users analyze any trademark concept and immediately see a comprehensive knockout search. Users can also monitor their trademark and manage their portfolio.  The analysis that Novation provides is informational only and is not a substitute for legal advice.',
    },
    {
      id: 'item-3',
      question: 'How long does it take to analyze a trademark?',
      answer:
        'The initial demo version of the AI Trademark Analyst can conduct a comprehensive knockout search in under 20 seconds. With Novation AI, legal processes will become easier and faster than ever.',
    },
    {
      id: 'item-4',
      question: 'Who does Novation support?',
      answer:
        'Novation will initially work with IP law firms, but will scale as we develop new systems to all types of law firms, businesses, and governments.',
    },
    {
      id: 'item-5',
      question: 'Will I be able to register IP?',
      answer: 'Yes! In the future, you will be able to file and register IP on our site in a way never before imagined.',
    },
    {
      id: 'item-6',
      question: 'How can I be an early partner or beta tester?',
      answer: <>For interests in partnerships or testing, please email <span className="font-bold">info@novationapp.com</span>.</>,
    },
  ]

  return (
    <section className="relative py-24 md:py-36 text-white overflow-hidden bg-gradient-to-b from-[#1a0000] via-black to-[#1a0000]">
      {/* Glow Overlay */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-[#8B0000] to-transparent opacity-30 blur-3xl -z-10" />
        <div className="mx-auto max-w-6xl px-4 md:px-6 flex flex-col md:flex-row gap-12">
          {/* Left Column */}
          <div className="md:w-1/3">
            <h2 className="text-4xl font-serif font-normal text-white leading-tight mb-2">
              Questions?
            </h2>
            <span className="text-4xl font-serif font-normal text-[#a84242] block mb-6">
              Answers.
            </span>
            <p className="text-sm font-serif text-[#d9d9d9]">
              Can’t find the answers you were looking for? <br />
              Reach out to us at{' '}
              <span className="text-[#a84242] font-medium">info@novationapp.com</span>
            </p>
          </div>

          {/* Right Column – FAQ Accordion */}
          <div className="md:w-2/3 bg-gradient-to-b from-[#1a0000] via-[#0a0000] to-[#1a0000] rounded-3xl border border-[#a43a47]/20 px-6 py-3 backdrop-blur-sm shadow-md">
            <Accordion
              type="single"
              collapsible
              className="w-full"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-white/10"
                >
                  <AccordionTrigger className="text-left text-base font-serif font-medium text-white hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e0e0e0] font-serif mt-2 text-sm">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
    </section>
  )
}
