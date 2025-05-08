"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Replace so the user doesn't go back to this redirect page
    router.replace("/dashboard/assets")
  }, [router])

  return null
}