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

function TransferPaymentPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [apartment, setApartment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [selectedBank, setSelectedBank] = useState<string>("gtb")
  const [copied, setCopied] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [processing, setProcessing] = useState(false)

  // Account details for different banks
  const bankAccounts = {
    gtb: {
      name: "Guaranty Trust Bank",
      accountName: "Apartments Nigeria Ltd",
      accountNumber: "0123456789",
    },
    access: {
      name: "Access Bank",
      accountName: "Apartments Nigeria Ltd",
      accountNumber: "9876543210",
    },
    firstbank: {
      name: "First Bank of Nigeria",
      accountName: "Apartments Nigeria Ltd",
      accountNumber: "1122334455",
    },
    uba: {
      name: "United Bank for Africa",
      accountName: "Apartments Nigeria Ltd",
      accountNumber: "5566778899",
    },
  }

  const currentAccount = bankAccounts[selectedBank as keyof typeof bankAccounts]

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

  const copyToClipboard = async (text: string, type: string) => {
    try {
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.opacity = "0"
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand("copy")
          setCopied(type)
          setTimeout(() => setCopied(""), 2000)
        } catch (err) {
          console.error("Fallback copy failed:", err)
          setError("Failed to copy. Please copy manually.")
        } finally {
          document.body.removeChild(textArea)
        }
        return
      }

      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error("Error copying to clipboard:", err)
      setError("Failed to copy to clipboard. Please copy manually.")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleConfirmPayment = async () => {
    try {
      setError("")
      setProcessing(true)

      if (!paymentData) {
        setError("Payment information is missing. Please go back and try again.")
        setProcessing(false)
        return
      }

      // Simulate payment confirmation
      setTimeout(() => {
        setPaymentConfirmed(true)
        setProcessing(false)
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push("/featured?payment=success")
        }, 2000)
      }, 1500)
    } catch (err) {
      console.error("Error confirming payment:", err)
      setError("Failed to confirm payment. Please try again.")
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
              Bank Transfer Payment
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

        {/* Payment Confirmed Success */}
        {paymentConfirmed && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-600 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                  Payment Confirmed!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your payment has been confirmed. Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Summary */}
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

        {/* Bank Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Select Bank
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(bankAccounts).map(([key, bank]) => (
              <button
                key={key}
                onClick={() => setSelectedBank(key)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedBank === key
                    ? "border-primary-yellow bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <p className="font-semibold text-black dark:text-white text-sm">
                  {bank.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Account Details
          </h2>
          <div className="space-y-4">
            {/* Account Name */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Name</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-black dark:text-white">
                  {currentAccount.accountName}
                </p>
                <button
                  onClick={() => copyToClipboard(currentAccount.accountName, "name")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {copied === "name" ? (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Account Number */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Number</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-black dark:text-white font-mono">
                  {currentAccount.accountNumber}
                </p>
                <button
                  onClick={() => copyToClipboard(currentAccount.accountNumber, "number")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {copied === "number" ? (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bank Name</p>
              <p className="text-lg font-semibold text-black dark:text-white">
                {currentAccount.name}
              </p>
            </div>

            {/* Amount to Pay */}
            <div className="p-4 bg-primary-yellow/10 dark:bg-primary-yellow/20 rounded-xl border-2 border-primary-yellow">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount to Transfer</p>
              <p className="text-2xl font-bold text-black dark:text-white">
                {formatPrice(paymentData.totalPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                Payment Instructions
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                <li>Transfer the exact amount ({formatPrice(paymentData.totalPrice)}) to the account details above</li>
                <li>Use your registered name as the transfer reference</li>
                <li>After making the transfer, click &quot;I&apos;ve Made the Transfer&quot; below</li>
                <li>Your booking will be confirmed once payment is verified (within 24 hours)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirm Payment Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={processing || paymentConfirmed}
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
          ) : paymentConfirmed ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Payment Confirmed
            </span>
          ) : (
            "I've Made the Transfer"
          )}
        </button>
      </div>
    </div>
  )
}

export default function TransferPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <TransferPaymentPageContent />
    </Suspense>
  )
}

