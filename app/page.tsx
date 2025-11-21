"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import FeaturedApartments from "@/components/FeaturedApartments"
import ContactSection from "@/components/ContactSection"
import { isSignedIn } from "@/lib/authState"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is signed in (either via NextAuth or custom auth state)
    if (status === "loading") {
      return // Still checking session
    }
    
    if (session || isSignedIn()) {
      router.push("/featured")
    } else {
      setIsChecking(false)
    }
  }, [router, session, status])

  // Show loading state while checking, or show landing page if not signed in
  if (isChecking) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <AboutSection />
      <FeaturedApartments />
      <ContactSection />
    </main>
  )
}

