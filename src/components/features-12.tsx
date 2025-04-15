'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChartBarIncreasingIcon,Bot, Users, SquareActivity, Database, Fingerprint, IdCard } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BorderBeam } from '@/components/magicui/border-beam'

export default function Features() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    const images = {
        'item-1': {
            image: '/charts.png',
            alt: 'Database visualization',
        },
        'item-2': {
            image: '/music.png',
            alt: 'Security authentication',
        },
        'item-3': {
            image: '/mail2.png',
            alt: 'Identity management',
        },
        'item-4': {
            image: '/payments.png',
            alt: 'Analytics dashboard',
        },
    }

    return (
        <>
        <section className="pt-24 pb-12 md:py-20 lg:py-32">
            <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block "></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-6xl">What Can Novation Do?</h2>
                    <p>Novation is evolving to be more than just a database. It provides clear and instant trademark insight on every single idea you’re considering - fast, simple, and built for creators.</p>
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Database className="size-4" />
                                    Database Visualization
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Upload and track current brand assets you’re using and see what others in similar niches are using. Get inspired by their ideas, and message them through Novation to work together or ask to use variations of their brand assets. Maintain that professional courtesy you’ve been waiting for. </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Bot className="size-4" />
                                    AI Trademark Analyst 
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Use our AI to upload names or design ideas you have for your products, or interact with Novation AI to generate ideas tailored to your business needs. Novation provides detailed trademark insight for every idea, allowing you to research like an expert and fully understand the legal implications of your ideas. No more flying blind. </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <SquareActivity className="size-4" />
                                    Trademark Monitoring 
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Track the health of your assets, 24/7. Continuously monitor the legal implications and standings, and know if and why certain things will happen. </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Users className="size-4" />
                                    Community & Guidance 
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Have access to similar users and legal experts who provide all the information and insights they have to make you more knowledgable. View their messages & videos and message them to connect and learn from them. Gain the confidence and knowledge to scale and grow your business beyond your wildest dreams.</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    {/* Add the asterisk note here */}


                    <div className="bg-card relative flex overflow-hidden rounded-3xl border p-2">

                        <div className="bg-background relative w-full rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeItem}-id`}
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
                                    <Image
                                        src={images[activeItem].image}
                                        className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                        alt={images[activeItem].alt}
                                        width={1207}
                                        height={929}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <BorderBeam
                            duration={6}
                            size={200}
                            className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
                        />
                    </div>
                </div>
            </div>
            <p className="text-muted-foreground text-xs italic text-center mt-4">
        * The analysis Novation provides is informational only and not a substitute for legal advice.
    </p>
        </section>
        
    </>
    )
}
