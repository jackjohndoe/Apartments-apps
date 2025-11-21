"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getFavorites, FavoriteApartment } from "@/lib/favorites"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteApartment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = () => {
      setFavorites(getFavorites())
      setLoading(false)
    }

    loadFavorites()

    // Listen for favorites updates
    const handleUpdate = () => {
      loadFavorites()
    }

    window.addEventListener("favoritesUpdated", handleUpdate)

    return () => {
      window.removeEventListener("favoritesUpdated", handleUpdate)
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            My Favorites
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your saved apartments
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-black dark:text-white text-lg mb-2">
              No favorites yet
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring and add apartments to your favorites!
            </p>
            <Link
              href="/featured"
              className="inline-block bg-primary-yellow text-black px-6 py-3 rounded-full hover:bg-yellow-400 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Browse Featured Homes
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((apartment) => (
              <Link
                key={apartment.id}
                href={`/apartments/${apartment.id}`}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col">
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

