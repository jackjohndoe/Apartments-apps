"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

export default function HeroSection() {
  const { data: session } = useSession()

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop')"
        }}
      />
      {/* Black overlay to darken the image */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none"
        style={{
          opacity: 0.4
        }}
      />
      {/* Gradient overlay that fades to background at the bottom */}
      <div 
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.8) 85%, white 100%)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(17,24,39,0.3) 70%, rgba(17,24,39,0.8) 85%, rgb(17,24,39) 100%)'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
        <div className="max-w-3xl">
          {/* Content */}
          <div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-xl font-medium">
              Discover amazing apartments across Nigeria
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {!session && (
                <>
                  <Link
                    href="/map"
                    className="bg-white dark:bg-gray-800 text-black dark:text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl border-2 border-primary-yellow"
                  >
                    Explore Apartments
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-primary-yellow text-black px-8 py-4 rounded-lg text-base font-semibold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl"
                  >
                    List Your Property
                  </Link>
                </>
              )}
              {session && (
                <Link
                  href="/map"
                  className="bg-white dark:bg-gray-800 text-black dark:text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl border-2 border-primary-yellow"
                >
                  Browse Apartments
                </Link>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-4xl font-bold text-white">500+</div>
                <div className="text-white text-sm mt-1 font-medium">Properties</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">50+</div>
                <div className="text-white text-sm mt-1 font-medium">Cities</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

