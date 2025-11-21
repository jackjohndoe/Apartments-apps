"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface PaymentData {
  apartmentId: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalPrice: number
}

function PaymentPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [apartment, setApartment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("wallet")
  const [processing, setProcessing] = useState(false)

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

    // Get payment data from URL params
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const nights = searchParams.get("nights")
    const totalPrice = searchParams.get("totalPrice")
    const guests = searchParams.get("guests")

    if (checkIn && checkOut && nights && totalPrice) {
      setPaymentData({
        apartmentId: params.id as string,
        checkIn,
        checkOut,
        nights: parseInt(nights),
        guests: guests ? parseInt(guests) : 2,
        totalPrice: parseFloat(totalPrice),
      })
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
    if (!paymentData) return ""
    return `${formatDate(paymentData.checkIn)} – ${formatDate(paymentData.checkOut)}`
  }

  const calculateFees = () => {
    if (!paymentData) return { cleaning: 0, service: 0 }
    
    const cleaningFee = (paymentData.totalPrice / paymentData.nights) * 0.08
    const serviceFee = paymentData.totalPrice * 0.12
    
    return {
      cleaning: cleaningFee,
      service: serviceFee,
    }
  }

  const calculateFinalTotal = () => {
    if (!paymentData) return 0
    const fees = calculateFees()
    return paymentData.totalPrice + fees.cleaning + fees.service
  }

  const handlePayment = async () => {
    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      // Navigate to success page or back to featured homes
      router.push("/featured?payment=success")
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    )
  }

  if (!apartment || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-black dark:text-white text-lg mb-4">Payment information not found</p>
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
              Payment
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Booking Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Booking Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Property</span>
              <span className="text-black dark:text-white font-medium">{apartment.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Dates</span>
              <span className="text-black dark:text-white font-medium">{formatDateRange()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Guests</span>
              <span className="text-black dark:text-white font-medium">{paymentData.guests} {paymentData.guests === 1 ? 'guest' : 'guests'}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <span className="text-black dark:text-white font-semibold">Total</span>
              <span className="text-black dark:text-white font-bold text-lg">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Select Payment Method
          </h2>
          
          <div className="space-y-3">
            {/* Wallet Option */}
            <button
              onClick={() => {
                setSelectedPaymentMethod("wallet")
                // Navigate to wallet page with payment details
                const checkIn = paymentData?.checkIn || ""
                const checkOut = paymentData?.checkOut || ""
                const nights = paymentData?.nights || 0
                const guests = paymentData?.guests || 2
                router.push(
                  `/wallet?amount=${finalTotal}&apartmentId=${params.id}&checkIn=${checkIn}&checkOut=${checkOut}&nights=${nights}&guests=${guests}`
                )
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPaymentMethod === "wallet"
                  ? "border-primary-yellow bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-black dark:text-white">Wallet</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pay from your wallet balance</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === "wallet"
                    ? "border-primary-yellow bg-primary-yellow"
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  {selectedPaymentMethod === "wallet" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </button>

            {/* Transfer Option */}
            <button
              onClick={() => {
                setSelectedPaymentMethod("transfer")
                // Navigate to transfer payment page with payment details
                const checkIn = paymentData?.checkIn || ""
                const checkOut = paymentData?.checkOut || ""
                const nights = paymentData?.nights || 0
                const totalPrice = paymentData?.totalPrice || 0
                const guests = paymentData?.guests || 2
                router.push(
                  `/payment/${params.id}/transfer?checkIn=${checkIn}&checkOut=${checkOut}&nights=${nights}&totalPrice=${totalPrice}&guests=${guests}`
                )
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPaymentMethod === "transfer"
                  ? "border-primary-yellow bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-black dark:text-white">Transfer</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bank transfer or mobile money</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === "transfer"
                    ? "border-primary-yellow bg-primary-yellow"
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  {selectedPaymentMethod === "transfer" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </button>

            {/* Pay with Card Option */}
            <button
              onClick={() => {
                setSelectedPaymentMethod("card")
                // Navigate to card payment page with payment details
                const checkIn = paymentData?.checkIn || ""
                const checkOut = paymentData?.checkOut || ""
                const nights = paymentData?.nights || 0
                const totalPrice = paymentData?.totalPrice || 0
                const guests = paymentData?.guests || 2
                router.push(
                  `/payment/${params.id}/card?checkIn=${checkIn}&checkOut=${checkOut}&nights=${nights}&totalPrice=${totalPrice}&guests=${guests}`
                )
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPaymentMethod === "card"
                  ? "border-primary-yellow bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-black dark:text-white">Pay with Card</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Debit or credit card</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === "card"
                    ? "border-primary-yellow bg-primary-yellow"
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  {selectedPaymentMethod === "card" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-primary-yellow text-black py-4 rounded-xl hover:bg-yellow-400 transition-all font-semibold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ${formatPrice(finalTotal)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}

