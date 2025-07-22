'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from './logo'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const menuItems = [
  { name: 'Features', href: '/features' },
  { name: 'Our Vision', href: '/ourvision' }
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [navAnimated, setNavAnimated] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const alreadyAnimated = sessionStorage.getItem('navAnimated')
    if (!alreadyAnimated && pathname === '/') {
      setNavAnimated(true)
      sessionStorage.setItem('navAnimated', 'true')
    }
  }, [pathname])

  return (
    <header>
      <nav data-state={menuState && 'active'} className="fixed z-20 w-full px-2">
        <div className={cn(
          'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
          isScrolled && 'bg-background/30 max-w-4xl rounded-4xl border backdrop-blur-lg lg:px-5'
        )}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* LEFT SIDE - Logo */}
            <motion.div
              initial={navAnimated ? { x: '-50%', opacity: 0 } : false}
              animate={navAnimated ? { x: 0, opacity: 1 } : false}
              transition={{ duration: 0.8 }}
              className="flex w-full justify-between lg:w-auto"
            >
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </Link>
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>
            </motion.div>

            {/* CENTER MENU */}
            <motion.div
              initial={navAnimated ? { y: -20, opacity: 0 } : false}
              animate={navAnimated ? { y: 0, opacity: 1 } : false}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute inset-0 m-auto hidden size-fit lg:block"
            >
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={cn(
                          "text-muted-foreground hover:text-accent-foreground block duration-150 font-serif",
                          isActive && "text-[#f8e4b6]"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </motion.div>

            {/* RIGHT SIDE - Buttons */}
            <motion.div
              initial={navAnimated ? { x: '50%', opacity: 0 } : false}
              animate={navAnimated ? { x: 0, opacity: 1 } : false}
              transition={{ duration: 0.8 }}
              className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent"
            >
              {/* MOBILE DROPDOWN MENU */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className={cn(
                            "text-muted-foreground hover:text-accent-foreground block duration-150 font-serif",
                            isActive && "text-[#f8e4b6]"
                          )}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Button */}
              <motion.div
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.97 }}
                className="transition-transform duration-200"
              >
                <Link
                  href="/contactus"
                  className="bg-[#2b0d0d] hover:bg-[#3d1212] text-[#f8e4b6] px-4 py-2.5 text-[14px] rounded-lg font-serif font-medium border border-[#b8634c]/30 shadow-md transition-all duration-300"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </nav>
    </header>
  )
}
