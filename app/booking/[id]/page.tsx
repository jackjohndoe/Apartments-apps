"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface BookingData {
  apartmentId: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  basePrice: number
  totalPrice: number
}

function BookingConfirmationPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [apartment, setApartment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [guests, setGuests] = useState(2)

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

    // Get booking data from URL params
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const nights = searchParams.get("nights")
    const totalPrice = searchParams.get("totalPrice")
    const guestsParam = searchParams.get("guests")

    if (checkIn && checkOut && nights && totalPrice) {
      setBookingData({
        apartmentId: params.id as string,
        checkIn,
        checkOut,
        nights: parseInt(nights),
        guests: guestsParam ? parseInt(guestsParam) : 2,
        basePrice: parseFloat(totalPrice) / parseInt(nights),
        totalPrice: parseFloat(totalPrice),
      })
      if (guestsParam) {
        setGuests(parseInt(guestsParam))
      }
    }
  }, [params.id, searchParams])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatDateRange = () => {
    if (!bookingData) return ""
    return `${formatDate(bookingData.checkIn)} – ${formatDate(bookingData.checkOut)}`
  }

  const calculateFees = () => {
    if (!bookingData) return { cleaning: 0, service: 0 }
    
    const cleaningFee = bookingData.basePrice * 0.08 // 8% of base price
    const serviceFee = bookingData.totalPrice * 0.12 // 12% of total
    
    return {
      cleaning: cleaningFee,
      service: serviceFee,
    }
  }

  const calculateFinalTotal = () => {
    if (!bookingData) return 0
    const fees = calculateFees()
    return bookingData.totalPrice + fees.cleaning + fees.service
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    )
  }

  if (!apartment || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-black dark:text-white text-lg mb-4">Booking information not found</p>
          <Link
            href={`/apartments/${params.id}`}
            className="text-primary-yellow hover:underline"
          >
            Back to apartment details
          </Link>
        </div>
      </div>
    )
  }

  const fees = calculateFees()
  const finalTotal = calculateFinalTotal()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-black dark:text-white flex-1 text-center">
              Confirm and Book
            </h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Property Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-1">
                {apartment.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Entire apartment in {apartment.city}, {apartment.state}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hosted by {apartment.owner?.name || "Property Owner"}
              </p>
            </div>
            {apartment.images && apartment.images.length > 0 && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={apartment.images[0]}
                  alt={apartment.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Your Trip */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Your trip
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dates</p>
                <p className="text-black dark:text-white font-medium">
                  {formatDateRange()}
                </p>
              </div>
              <button
                onClick={() => router.push(`/apartments/${params.id}`)}
                className="text-primary-yellow hover:underline text-sm font-medium"
              >
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Guests</p>
                <p className="text-black dark:text-white font-medium">
                  {guests} {guests === 1 ? "guest" : "guests"}
                </p>
              </div>
              <button
                onClick={() => {
                  const newGuests = guests < 10 ? guests + 1 : guests
                  setGuests(newGuests)
                }}
                className="text-primary-yellow hover:underline text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Price details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                {formatPrice(bookingData.basePrice)} × {bookingData.nights} {bookingData.nights === 1 ? "night" : "nights"}
              </span>
              <span className="text-black dark:text-white font-medium">
                {formatPrice(bookingData.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Cleaning fee</span>
              <span className="text-black dark:text-white font-medium">
                {formatPrice(fees.cleaning)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Service fee</span>
              <span className="text-black dark:text-white font-medium">
                {formatPrice(fees.service)}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="text-lg font-semibold text-black dark:text-white">Total (NGN)</span>
              <span className="text-lg font-bold text-black dark:text-white">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Pay With Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Pay with
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              By selecting the button below, I agree to the Host&apos;s House Rules, Ground rules for guests, and the Guest Refund Policy. I also agree to pay the total amount shown, which includes Service Fees.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => {
              const checkIn = bookingData?.checkIn || ""
              const checkOut = bookingData?.checkOut || ""
              const nights = bookingData?.nights || 0
              const totalPrice = bookingData?.totalPrice || 0
              const guests = bookingData?.guests || 2
              router.push(
                `/payment/${params.id}?checkIn=${checkIn}&checkOut=${checkOut}&nights=${nights}&totalPrice=${totalPrice}&guests=${guests}`
              )
            }}
            className="w-full bg-primary-yellow text-black py-4 rounded-xl hover:bg-yellow-400 transition-all font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Confirm and Pay
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <BookingConfirmationPageContent />
    </Suspense>
  )
}

