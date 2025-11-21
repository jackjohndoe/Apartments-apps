"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import FavoriteButton from "@/components/FavoriteButton"
import BottomNavigation from "@/components/BottomNavigation"

interface Apartment {
  id: string
  title: string
  description: string
  price: number
  city: string
  state: string
  images: string[]
  bedrooms: number
  bathrooms: number
}

export default function FeaturedPropertiesPage() {
  const router = useRouter()
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)

  const handleMoreClick = () => {
    router.refresh()
    window.location.reload()
  }

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await fetch("/api/apartments?featured=true")
        const data = await res.json()
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setApartments(data)
        } else {
          console.error("Invalid data format:", data)
          setApartments([])
        }
      } catch (error) {
        console.error("Error fetching apartments:", error)
        setApartments([])
      } finally {
        setLoading(false)
      }
    }
    fetchApartments()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Featured Homes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Handpicked selections from across Nigeria
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-gray-50 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : apartments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-black dark:text-white text-lg">
              No featured apartments available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apartments.map((apartment) => (
              <div key={apartment.id} className="group relative">
                <Link
                  href={`/apartments/${apartment.id}`}
                  className="block cursor-pointer"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col cursor-pointer">
                    <div className="relative h-64 bg-gray-50 overflow-hidden">
                      {apartment.images && apartment.images.length > 0 ? (
                        <Image
                          src={apartment.images[0]}
                          alt={apartment.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-3 right-3 z-10">
                        <FavoriteButton apartment={apartment} />
                      </div>
                    </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold text-black dark:text-white line-clamp-2 flex-1">
                        {apartment.title}
                      </h3>
                    </div>
                    <p className="text-black dark:text-white font-medium mb-2">
                      {formatPrice(apartment.price)}
                      <span className="text-gray-600 dark:text-gray-400 font-normal text-sm">/month</span>
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-auto">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {apartment.city}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        {apartment.bedrooms} bed · {apartment.bathrooms} bath
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            ))}
          </div>
        )}

        {!loading && apartments.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleMoreClick}
              className="bg-primary-yellow text-black px-8 py-3 rounded-full hover:bg-yellow-400 transition-all font-medium shadow-sm hover:shadow-md"
            >
              More
            </button>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  )
}

