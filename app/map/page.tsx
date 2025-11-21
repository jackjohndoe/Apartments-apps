"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import SearchBar from "@/components/SearchBar"
import MapView from "@/components/MapView"
import ApartmentCard from "@/components/ApartmentCard"

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
  latitude: number | null
  longitude: number | null
}

function MapPageContent() {
  const searchParams = useSearchParams()
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(true)

  useEffect(() => {
    const fetchApartments = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchParams.get("city")) params.append("city", searchParams.get("city")!)
      if (searchParams.get("state")) params.append("state", searchParams.get("state")!)
      if (searchParams.get("minPrice")) params.append("minPrice", searchParams.get("minPrice")!)
      if (searchParams.get("maxPrice")) params.append("maxPrice", searchParams.get("maxPrice")!)
      if (searchParams.get("bedrooms")) params.append("bedrooms", searchParams.get("bedrooms")!)

      try {
        const response = await fetch(`/api/apartments?${params.toString()}`)
        const data = await response.json()
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
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Stays in Nigeria</h1>
          <p className="text-gray-600 dark:text-gray-400">Find your perfect apartment</p>
        </div>
        
        <SearchBar />

        <div className="mb-6 flex gap-2 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setShowMap(false)}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              !showMap
                ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              showMap
                ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Map
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading apartments...</p>
          </div>
        ) : showMap ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 transition-all overflow-hidden">
            <MapView apartments={apartments} />
          </div>
        ) : (
          <div>
            {apartments.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No apartments found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {apartments.map((apartment) => (
                  <ApartmentCard key={apartment.id} apartment={apartment} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  )
}

