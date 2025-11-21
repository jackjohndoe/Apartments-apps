"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ThemeToggle from "./ThemeToggle"
import { isSignedIn, setSignedOut } from "@/lib/authState"

export default function Navigation() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isUserSignedIn, setIsUserSignedIn] = useState(false)

  useEffect(() => {
    // Check initial auth state
    setIsUserSignedIn(isSignedIn())

    // Listen for auth state changes
    const handleAuthChange = () => {
      setIsUserSignedIn(isSignedIn())
    }

    window.addEventListener("authStateChanged", handleAuthChange)
    return () => window.removeEventListener("authStateChanged", handleAuthChange)
  }, [])

  const handleSignOut = async () => {
    // Clear custom UI auth state
    setSignedOut()

    // Clear NextAuth session if it exists, but keep control of redirect
    if (session) {
      try {
        await signOut({ redirect: false })
      } catch (err) {
        console.error("Error during NextAuth sign out:", err)
      }
    }

    // Always send user back to the landing page
    router.push("/")
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <svg
              className="w-10 h-10 text-primary-yellow"
              viewBox="0 0 100 100"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left side - thick line from lower-left, slopes up, turns right (L-shape chevron) */}
              <path
                d="M15 80 L15 55 L35 35 L50 35 L50 55 L35 55 Z"
                fill="currentColor"
              />
              {/* Right side - two parallel lines forming roof, extending downwards */}
              <path
                d="M50 35 L65 35 L65 55 L50 55 Z"
                fill="currentColor"
              />
              <path
                d="M65 35 L85 55 L85 80 L65 55 Z"
                fill="currentColor"
              />
              {/* Small solid square at bottom center */}
              <rect
                x="42"
                y="82"
                width="16"
                height="16"
                fill="currentColor"
              />
            </svg>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <Link
              href="/"
              className="text-black dark:text-white hover:text-primary-yellow transition-colors font-medium text-sm"
            >
              Home
            </Link>
            <Link
              href="/map"
              className="text-black dark:text-white hover:text-primary-yellow transition-colors font-medium text-sm"
            >
              Explore
            </Link>
            <Link
              href="/favorites"
              className="text-black dark:text-white hover:text-primary-yellow transition-colors font-medium text-sm"
            >
              Favorites
            </Link>
            {isUserSignedIn || session ? (
              <>
                {session && (
                  <Link
                    href="/profile"
                    className="text-black dark:text-white hover:text-primary-yellow transition-colors font-medium text-sm"
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="bg-primary-yellow text-black px-5 py-2.5 rounded-full hover:bg-yellow-400 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-black dark:text-white hover:text-primary-yellow transition-colors font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-yellow text-black px-5 py-2.5 rounded-full hover:bg-yellow-400 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="text-black dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/"
              className="block text-black dark:text-white hover:text-primary-yellow transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/map"
              className="block text-black dark:text-white hover:text-primary-yellow transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Map View
            </Link>
            <Link
              href="/favorites"
              className="block text-black dark:text-white hover:text-primary-yellow transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Favorites
            </Link>
            {isUserSignedIn || session ? (
              <>
                {session && (
                  <Link
                    href="/profile"
                    className="block text-black dark:text-white hover:text-primary-yellow transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full bg-primary-yellow text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="block text-black dark:text-white hover:text-primary-yellow transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block bg-primary-yellow text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors font-semibold text-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

