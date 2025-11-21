"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

interface PaymentData {
  apartmentId: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalPrice: number
}

function CardPaymentPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [apartment, setApartment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [error, setError] = useState<string>("")
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    phone: "",
  })

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
        setError("Failed to load apartment details. Please try again.")
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardDetails({ ...cardDetails, cardNumber: formatted })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setCardDetails({ ...cardDetails, expiryDate: formatted })
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3)
    setCardDetails({ ...cardDetails, cvv: value })
  }

  const validateForm = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid 16-digit card number")
      return false
    }

    if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
      setError("Please enter a valid expiry date (MM/YY)")
      return false
    }

    const [month, year] = cardDetails.expiryDate.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      setError("Please enter a valid month (01-12)")
      return false
    }

    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      setError("Card has expired. Please use a valid card")
      return false
    }

    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      setError("Please enter a valid CVV (3 digits)")
      return false
    }

    if (!cardDetails.cardholderName || cardDetails.cardholderName.trim().length < 2) {
      setError("Please enter the cardholder's name")
      return false
    }

    if (!cardDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardDetails.email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (!cardDetails.phone || cardDetails.phone.trim().length < 10) {
      setError("Please enter a valid phone number")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    if (!paymentData) {
      setError("Payment information is missing. Please go back and try again.")
      return
    }

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPaymentSuccess(true)
      setProcessing(false)

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push("/featured?payment=success")
      }, 2000)
    } catch (err) {
      console.error("Error processing payment:", err)
      setError("Payment failed. Please check your card details and try again.")
      setProcessing(false)
    }
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-8">
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
              Pay with Card
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Payment Success */}
        {paymentSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-600 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                  Payment Successful!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your payment has been processed. Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Payment Summary
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
              <span className="text-black dark:text-white font-semibold">Total Amount</span>
              <span className="text-black dark:text-white font-bold text-lg">{formatPrice(paymentData.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Card Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-6">
            Card Details
          </h2>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
                required
              />
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value.toUpperCase() })}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
                required
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={cardDetails.email}
                onChange={(e) => setCardDetails({ ...cardDetails, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={cardDetails.phone}
                onChange={(e) => setCardDetails({ ...cardDetails, phone: e.target.value })}
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your payment information is secure and encrypted. We do not store your card details.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing || paymentSuccess}
            className="w-full mt-6 bg-primary-yellow text-black py-4 rounded-xl hover:bg-yellow-400 transition-all font-semibold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : paymentSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Payment Successful
              </span>
            ) : (
              `Pay ${formatPrice(paymentData.totalPrice)}`
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function CardPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <CardPaymentPageContent />
    </Suspense>
  )
}

