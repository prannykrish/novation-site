'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from '@/components/hero5-header'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ProductFrame } from '@/components/product-frame'

interface RotatingWordsProps {
    words: string[]
    className?: string
    interval?: number
    style?: React.CSSProperties
}

export const RotatingWords = ({ words, className, interval = 3000 }: RotatingWordsProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
        }, interval)

        return () => clearInterval(timer)
    }, [words.length, interval])

    return (
        <div className="relative inline-block" style={{ minWidth: '230px', height: '1.2em' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    className={`absolute left-1/2 transform -translate-x-1/2 ${className}`}
                    transition={{ staggerChildren: 0.03 }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {words[currentIndex].split('').map((char, index) => (
                        <motion.span
                            key={index}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    x: -10,
                                    filter: "blur(4px)"
                                },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    filter: "blur(0px)",
                                    transition: {
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }
                                },
                                exit: {
                                    opacity: 0,
                                    x: 10,
                                    filter: "blur(4px)",
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeIn"
                                    }
                                }
                            }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    const productImagesData = [
        {
            id: 1,
            lightSrc: "/images/lightproduct.png",
            darkSrc: "/images/darkproduct.png",
            alt: "App screen 1",
        },
        {
            id: 2,
            lightSrc: "/images/lightproduct.png",
            darkSrc: "/images/darkproduct.png",
            alt: "App screen 2",
        },
        {
            id: 3,
            lightSrc: "/images/lightproduct.png",
            darkSrc: "/images/darkproduct.png",
            alt: "App screen 3",
        },
    ];
    // Create a key for each item that will be stable across re-renders for the duplicated list
    const imagesToScroll = [
        ...productImagesData.map(img => ({ ...img, uniqueKey: `frame-${img.id}-original` })),
        ...productImagesData.map(img => ({ ...img, uniqueKey: `frame-${img.id}-duplicate` }))
    ];

    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        {/* <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            {/* <Image
                                src="https://res.cloudinary.com/dg4jhba5c/image/upload/v1741605538/night-background_ni3vqb.jpg"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            /> */}
                        {/* </AnimatedGroup> */}
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pr-4 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">AI features coming soon</span>
                                        {/* <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span> */}

                                        {/* <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div> */}
                                    </Link>
                                </AnimatedGroup>

                                <div className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    <div className="flex flex-col items-center">
                                        <TextEffect
                                            preset="fade-in-blur"
                                            speedSegment={0.3}
                                            as="h1"
                                            className="mb-4">
                                            Trademark clarity,
                                        </TextEffect>

                                        <div className="flex justify-center w-full mt-2">
                                            <RotatingWords
                                                words={["instantly.", "accurately.", "rapidly.", "finally."]}
                                                className="font-bold"
                                                style={{ color: '#00000' }} // Any hex, RGB, or named color
                                                interval={3000}
                                            />
                                            {/* <span className="ml-1">.</span> */}
                                        </div>
                                     
                                    </div>
                                </div>

                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                    Upload a name or design and get clear, accurate, and fast trademark insight - no legal knowledge required.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="/signin">
                                                <span className="text-nowrap">Get Started</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="/features">
                                            <span className="text-nowrap">Learn more</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative mt-8 overflow-hidden sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="mx-auto max-w-full">
                                    <motion.div
                                        className="flex"
                                        style={{ width: '350%' }}
                                        animate={{
                                            x: ['0%', '-50%'],
                                        }}
                                        transition={{
                                            ease: 'linear',
                                            duration: 45,
                                            repeat: Infinity,
                                        }}
                                    >
                                        {imagesToScroll.map((imageData) => (
                                            // Each child takes 1/6th of the motion.div's width, so each is 100% of the viewport width
                                            <div key={imageData.uniqueKey} className="w-[calc(100%/6)] flex-shrink-0">
                                                <ProductFrame
                                                    lightSrc={imageData.lightSrc}
                                                    darkSrc={imageData.darkSrc}
                                                    alt={imageData.alt}
                                                />
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            {/* <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span>Our Supporter</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link> */}
                            <div  className="block text-sm duration-150 hover:opacity-75">
                            <span>Our Supporters</span>
                            </div>
                            
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="/images/Nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="/images/awsblack.svg"
                                    alt="AWS Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="/images/microsoft-black.svg"
                                    alt="Microsoft Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="/images/notion.svg"
                                    alt="Microsoft Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
