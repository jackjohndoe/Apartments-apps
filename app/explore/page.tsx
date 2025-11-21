"use client"

import { useState, useEffect } from "react"
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
  amenities: string[]
}

export default function ExplorePage() {
  const router = useRouter()
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    area: "",
    guests: "",
  })

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await fetch("/api/apartments")
        const data = await res.json()
        if (Array.isArray(data)) {
          setApartments(data)
          setFilteredApartments(data)
        } else {
          setApartments([])
          setFilteredApartments([])
        }
      } catch (error) {
        console.error("Error fetching apartments:", error)
        setApartments([])
        setFilteredApartments([])
      } finally {
        setLoading(false)
      }
    }
    fetchApartments()
  }, [])

  useEffect(() => {
    let filtered = [...apartments]

    // Filter by area (city or state)
    if (searchFilters.area) {
      const areaLower = searchFilters.area.toLowerCase()
      filtered = filtered.filter(
        (apt) =>
          apt.city.toLowerCase().includes(areaLower) ||
          apt.state.toLowerCase().includes(areaLower)
      )
    }

    // Filter by number of guests (bedrooms * 2 is the capacity)
    if (searchFilters.guests) {
      const guestsNum = parseInt(searchFilters.guests)
      if (!isNaN(guestsNum) && guestsNum > 0) {
        filtered = filtered.filter((apt) => apt.bedrooms * 2 >= guestsNum)
      }
    }

    setFilteredApartments(filtered)
  }, [searchFilters, apartments])

  const handleFilterChange = (field: string, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const clearFilters = () => {
    setSearchFilters({
      area: "",
      guests: "",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
            Explore Properties
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Search for your perfect home by area and accommodation capacity
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Area Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search by Area
              </label>
              <input
                type="text"
                value={searchFilters.area}
                onChange={(e) => handleFilterChange("area", e.target.value)}
                placeholder="City or State (e.g., Lagos, Abuja)"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                value={searchFilters.guests}
                onChange={(e) => handleFilterChange("guests", e.target.value)}
                placeholder="Enter number of guests"
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredApartments.length} {filteredApartments.length === 1 ? "property" : "properties"} found
                {(searchFilters.area || searchFilters.guests) && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 text-primary-yellow hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
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
        ) : filteredApartments.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-black dark:text-white text-lg mb-2">
              No properties found
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search filters
            </p>
            <button
              onClick={clearFilters}
              className="text-primary-yellow hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApartments.map((apartment) => (
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
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {apartment.bedrooms * 2} guests
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
      </div>
      <BottomNavigation />
    </div>
  )
}

