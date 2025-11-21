"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import FavoriteButton from "@/components/FavoriteButton"
import GoogleMapsLoader from "@/components/GoogleMapsLoader"

declare global {
  interface Window {
    google: any
  }
}

interface Apartment {
  id: string
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  latitude: number | null
  longitude: number | null
  images: string[]
  bedrooms: number
  bathrooms: number
  amenities: string[]
  owner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export default function ApartmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [checkIn, setCheckIn] = useState<string>("")
  const [checkOut, setCheckOut] = useState<string>("")
  const [guests, setGuests] = useState<number>(2)
  const [showGuestWarning, setShowGuestWarning] = useState(false)
  
  // Calculate max guests (typically 2 per bedroom)
  const maxGuests = apartment ? apartment.bedrooms * 2 : 0
  
  // Check if guests exceed capacity when apartment loads
  useEffect(() => {
    if (apartment && guests > maxGuests) {
      setShowGuestWarning(true)
    } else {
      setShowGuestWarning(false)
    }
  }, [apartment, guests, maxGuests])
  
  // Calculate dates
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }
  
  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }
  
  const calculateTotal = () => {
    if (!apartment) return 0
    const days = calculateDays()
    const dailyRate = apartment.price / 30 // Convert monthly to daily
    return days * dailyRate
  }
  
  const formatDateRange = () => {
    if (!checkIn || !checkOut) return "Select dates"
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
  }

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await fetch(`/api/apartments/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setApartment(data)
        }
      } catch (error) {
        console.error("Error fetching apartment:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchApartment()
    }
  }, [params.id])

  useEffect(() => {
    if (apartment && apartment.latitude && apartment.longitude && mapRef.current) {
      const initMap = async () => {
        if (!window.google || !mapRef.current) return
        try {
          const { Map } = await window.google.maps.importLibrary("maps")
          
          const map = new Map(mapRef.current, {
            center: { lat: apartment.latitude!, lng: apartment.longitude! },
            zoom: 15,
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }],
              },
            ],
          })

          new window.google.maps.Marker({
            position: { lat: apartment.latitude!, lng: apartment.longitude! },
            map: map,
            title: apartment.title,
          })

          setMapLoaded(true)
        } catch (error) {
          console.error("Error initializing map:", error)
        }
      }

      if (typeof window !== "undefined" && window.google && window.google.maps) {
        initMap()
      } else {
        const checkGoogle = setInterval(() => {
          if (typeof window !== "undefined" && window.google && window.google.maps) {
            clearInterval(checkGoogle)
            initMap()
          }
        }, 100)
        
        // Cleanup after 10 seconds if still not loaded
        const timeout = setTimeout(() => {
          clearInterval(checkGoogle)
        }, 10000)

        return () => {
          clearInterval(checkGoogle)
          clearTimeout(timeout)
        }
      }
    }
  }, [apartment, mapRef])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase()
    if (lowerAmenity.includes("wifi") || lowerAmenity.includes("wi-fi")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      )
    } else if (lowerAmenity.includes("tv") || lowerAmenity.includes("television")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    } else if (lowerAmenity.includes("air") || lowerAmenity.includes("ac") || lowerAmenity.includes("conditioning")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
        </svg>
      )
    } else if (lowerAmenity.includes("kitchen")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    } else if (lowerAmenity.includes("washer") || lowerAmenity.includes("dryer") || lowerAmenity.includes("laundry")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    } else if (lowerAmenity.includes("balcony") || lowerAmenity.includes("terrace")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    } else if (lowerAmenity.includes("parking")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    } else if (lowerAmenity.includes("security")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    } else if (lowerAmenity.includes("pool")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    } else if (lowerAmenity.includes("gym")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }

  const nextImage = () => {
    if (apartment && apartment.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % apartment.images.length)
    }
  }

  const prevImage = () => {
    if (apartment && apartment.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + apartment.images.length) % apartment.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading apartment details...</p>
      </div>
    )
  }

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-black dark:text-white text-lg mb-4">Apartment not found</p>
          <Link
            href="/featured"
            className="text-primary-yellow hover:underline"
          >
            Back to featured homes
          </Link>
        </div>
      </div>
    )
  }

  const displayedAmenities = showAllAmenities ? apartment.amenities : apartment.amenities.slice(0, 6)

  return (
    <>
      <GoogleMapsLoader />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-24">
        {/* Image Gallery */}
        <div className="relative w-full h-[60vh] md:h-[70vh] bg-gray-50 dark:bg-gray-800">
          {apartment.images && apartment.images.length > 0 ? (
            <>
              <Image
                src={apartment.images[selectedImage]}
                alt={apartment.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Navigation Arrows */}
              {apartment.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Bookmark Button */}
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton apartment={apartment} />
              </div>

              {/* Image Dots */}
              {apartment.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {apartment.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === index ? "bg-white w-8" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title and Location */}
          <div className="pt-6 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">
              {apartment.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {apartment.city}, {apartment.state}
            </p>
          </div>

          {/* Host and Rating */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              {apartment.owner.image ? (
                <Image
                  src={apartment.owner.image}
                  alt={apartment.owner.name || "Host"}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-black dark:text-white font-semibold text-xl">
                  {apartment.owner.name?.[0] || apartment.owner.email[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-black dark:text-white">
                  Hosted by {apartment.owner.name || "Property Owner"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Superhost</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-primary-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-black dark:text-white">4.92</span>
              <span className="text-gray-600 dark:text-gray-400">(124)</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="flex items-center gap-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-black dark:text-white font-medium">{apartment.bedrooms * 2} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-black dark:text-white font-medium">{apartment.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-black dark:text-white font-medium">{apartment.bathrooms} Bathroom</span>
            </div>
          </div>

          {/* About this place */}
          <div className="py-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              About this place
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {apartment.description}
            </p>
            <button className="mt-4 text-black dark:text-white font-semibold underline">
              Read more
            </button>
          </div>

          {/* What this place offers */}
          {apartment.amenities && apartment.amenities.length > 0 && (
            <div className="py-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-gray-700 dark:text-gray-300">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                  </div>
                ))}
              </div>
              {apartment.amenities.length > 6 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4 text-black dark:text-white font-semibold underline"
                >
                  {showAllAmenities ? "Show less amenities" : "Show all amenities"}
                </button>
              )}
            </div>
          )}

          {/* Where you'll be */}
          {apartment.latitude && apartment.longitude && (
            <div className="py-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                Where you&apos;ll be
              </h2>
              <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                <div ref={mapRef} className="w-full h-full" />
                {!mapLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                  </div>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {apartment.city}, {apartment.state}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                The exact location is provided after booking.
              </p>
            </div>
          )}

          {/* Booking Calculator */}
          <div className="py-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
              Select your dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || getTomorrowDate()}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                />
              </div>
            </div>
            
            {calculateDays() > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatPrice(apartment.price / 30)} × {calculateDays()} {calculateDays() === 1 ? 'night' : 'nights'}
                    </span>
                    <span className="text-black dark:text-white font-medium">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-semibold text-black dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-black dark:text-white">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Number of Guests */}
          <div className="py-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Number of guests
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const newGuests = Math.max(1, guests - 1)
                  setGuests(newGuests)
                  setShowGuestWarning(false)
                }}
                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-primary-yellow hover:text-primary-yellow transition-colors"
                disabled={guests === 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xl font-semibold text-black dark:text-white min-w-[3rem] text-center">
                {guests}
              </span>
              <button
                onClick={() => {
                  const newGuests = Math.min(10, guests + 1)
                  setGuests(newGuests)
                  if (newGuests > maxGuests) {
                    setShowGuestWarning(true)
                  } else {
                    setShowGuestWarning(false)
                  }
                }}
                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-primary-yellow hover:text-primary-yellow transition-colors"
                disabled={guests === 10}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                {guests === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            {showGuestWarning && guests > maxGuests && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      This property can accommodate up to {maxGuests} {maxGuests === 1 ? 'guest' : 'guests'}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Please go back to look for options that can accommodate {guests} {guests === 1 ? 'guest' : 'guests'}.
                    </p>
                    <Link
                      href="/featured"
                      className="inline-block mt-2 text-sm font-semibold text-yellow-800 dark:text-yellow-200 hover:underline"
                    >
                      Browse other properties →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="py-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-primary-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-2xl font-semibold text-black dark:text-white">4.92</span>
              <span className="text-gray-600 dark:text-gray-400">·</span>
              <span className="text-gray-600 dark:text-gray-400">124 reviews</span>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const percentage = stars === 5 ? 92 : stars === 4 ? 5 : stars === 3 ? 2 : stars === 2 ? 1 : 0
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{stars} star</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-yellow rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{percentage}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Back Home Button */}
          <div className="py-8 text-center">
            <Link
              href="/featured"
              className="inline-flex items-center gap-2 bg-primary-yellow text-black px-8 py-3 rounded-full hover:bg-yellow-400 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back Home
            </Link>
          </div>
        </div>

        {/* Bottom Sticky Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                {calculateDays() > 0 ? (
                  <>
                    <p className="text-xl font-semibold text-black dark:text-white">
                      {formatPrice(calculateTotal())}
                      <span className="text-base font-normal text-gray-600 dark:text-gray-400"> total</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateRange()}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-black dark:text-white">
                      {formatPrice(apartment.price)}
                      <span className="text-base font-normal text-gray-600 dark:text-gray-400">/month</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select dates to see total</p>
                  </>
                )}
              </div>
              <button 
                onClick={() => {
                  if (calculateDays() > 0) {
                    const dailyRate = apartment.price / 30
                    const totalPrice = calculateTotal()
                    router.push(
                      `/booking/${apartment.id}?checkIn=${checkIn}&checkOut=${checkOut}&nights=${calculateDays()}&totalPrice=${totalPrice}&guests=${guests}`
                    )
                  } else {
                    // If no dates selected, use default values
                    const defaultCheckIn = getTomorrowDate()
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 2)
                    const defaultCheckOut = tomorrow.toISOString().split('T')[0]
                    const defaultNights = 1
                    const dailyRate = apartment.price / 30
                    const defaultTotal = dailyRate * defaultNights
                    router.push(
                      `/booking/${apartment.id}?checkIn=${defaultCheckIn}&checkOut=${defaultCheckOut}&nights=${defaultNights}&totalPrice=${defaultTotal}&guests=${guests}`
                    )
                  }
                }}
                className="bg-primary-yellow text-black px-8 py-3 rounded-full hover:bg-yellow-400 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
