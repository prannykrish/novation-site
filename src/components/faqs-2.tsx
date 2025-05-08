'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'What is Novation?',
answer: 'Novation is a risk analysis tool that predicts the likelihood of confusion for any name or design idea a user has for their product or business. It allows users with any level of trademark knowledge to research trademark insights and see the legal risks of any brand asset. The analysis that Novation provides is informational only and is not a substitute for legal advice.',
        },
        {
            id: 'item-2',
            question: 'How does Novation work?',
            answer: 'Through a comprehensive analysis, Novation predicts likelihood of confusion and provide its reasoning, statistics & analysis, and an audit trail. It lets users conduct a quick clearance search and see a comprehensive analysis in an easy-to-read format. The analysis that Novation provides is informational only and is not a substitute for legal advice.',
        },
        {
            id: 'item-3',
            question: 'Can I be a beta tester?',
            answer: <>Novation is currently in development but is looking for qualified beta testers to sign up. For inquiries or interest in beta testing, please email <span className="font-bold">info@novationapp.com</span></>,
        },
        {
            id: 'item-4',
            question: 'How can I be an early partner or endorser?',
            answer: <>If you would like to be an early partner or endorser of Novation, please email <span className="font-bold">info@novationapp.com</span></>,
        },
        {
            id: 'item-5',
            question: 'Does Novation support enterprise clients?',
            answer: <>For enterprise plan requests or purchase, please email <span className="font-bold">info@novationapp.com</span>.  See pricing for more information.</>,
        },
{
            id: 'item-6',
            question: 'Does Novation cost money?',
            answer: 'Novation offers a free plan to conduct limited analyses using a basic AI model. For more advanced tools and more comprehensive analysis, users can purchase a membership. See pricing for more information.',
        },

    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Questions? Answers.</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        Can't find what you're looking for? Reach out at
                        <span> </span>
                        <span className="text-primary font-medium hover:underline">info@novationapp.com</span>

                        {/* <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link> */}
                    </p>
                </div>
            </div>
        </section>
    )
}
