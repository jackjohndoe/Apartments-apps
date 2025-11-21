"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

interface Transaction {
  id: string
  type: "deposit" | "payment" | "refund"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
}

function WalletPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [processing, setProcessing] = useState(false)
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Get payment data from URL if coming from payment page
  const paymentAmount = searchParams.get("amount")
  const apartmentId = searchParams.get("apartmentId")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const nights = searchParams.get("nights")
  const guests = searchParams.get("guests")
  const funding = searchParams.get("funding")

  // Parse nights and guests as numbers for consistent comparison/formatting
  const nightsNumber = nights ? parseInt(nights, 10) || 0 : 0
  const guestsNumber = guests ? parseInt(guests, 10) || 0 : 0

  useEffect(() => {
    try {
      setLoading(true)
      setError("")

      // Load wallet balance from localStorage
      try {
        const savedBalance = localStorage.getItem("wallet_balance")
        if (savedBalance) {
          const parsedBalance = parseFloat(savedBalance)
          if (!isNaN(parsedBalance) && isFinite(parsedBalance)) {
            setBalance(parsedBalance)
          } else {
            setBalance(0)
          }
        } else {
          setBalance(0)
        }
      } catch (err) {
        console.error("Error loading wallet balance:", err)
        setBalance(0)
      }

      // Load transaction history from localStorage
      try {
        const savedTransactions = localStorage.getItem("wallet_transactions")
        if (savedTransactions) {
          const parsedTransactions = JSON.parse(savedTransactions)
          if (Array.isArray(parsedTransactions)) {
            setTransactions(parsedTransactions)
          } else {
            setTransactions([])
          }
        } else {
          setTransactions([])
        }
      } catch (err) {
        console.error("Error loading transaction history:", err)
        setTransactions([])
      }

      // If coming from fund page, show success message
      if (funding) {
        try {
          // Remove funding param from URL
          const url = new URL(window.location.href)
          url.searchParams.delete("funding")
          window.history.replaceState({}, "", url.toString())
        } catch (err) {
          console.error("Error updating URL:", err)
        }
      }
    } catch (err) {
      console.error("Error initializing wallet:", err)
      setError("Failed to load wallet data. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }, [funding])

  useEffect(() => {
    // Check if balance is insufficient when payment amount or balance changes
    if (paymentAmount) {
      try {
        const amount = parseFloat(paymentAmount)
        if (!isNaN(amount) && isFinite(amount)) {
          if (balance < amount) {
            setShowInsufficientFunds(true)
          } else {
            setShowInsufficientFunds(false)
          }
        }
      } catch (err) {
        console.error("Error checking payment amount:", err)
      }
    }
  }, [balance, paymentAmount])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }


  const handleMakePayment = async () => {
    try {
      setError("")
      
      if (!paymentAmount) {
        // If no payment amount, go back to featured homes
        try {
          await router.push("/featured")
        } catch (err) {
          console.error("Error navigating:", err)
          setError("Failed to navigate. Please try again.")
        }
        return
      }

      const amount = parseFloat(paymentAmount)
      if (isNaN(amount) || !isFinite(amount) || amount <= 0) {
        setError("Invalid payment amount. Please try again.")
        return
      }

      if (balance < amount) {
        setError("Insufficient balance. Please fund your wallet first.")
        setShowInsufficientFunds(true)
        return
      }

      setProcessing(true)
      
      try {
        const newBalance = balance - amount
        if (newBalance < 0) {
          throw new Error("Balance would be negative")
        }

        // Update balance in localStorage
        try {
          localStorage.setItem("wallet_balance", newBalance.toString())
        } catch (err) {
          throw new Error("Failed to save balance to storage")
        }

        // Add payment transaction with booking details
        const bookingDetails = apartmentId 
          ? `Apartment booking (${checkIn || "N/A"} - ${checkOut || "N/A"}, ${nightsNumber} ${nightsNumber === 1 ? 'night' : 'nights'}, ${guestsNumber} ${guestsNumber === 1 ? 'guest' : 'guests'})`
          : "Apartment booking"

        const newTransaction: Transaction = {
          id: `txn-${Date.now()}`,
          type: "payment",
          amount: amount,
          description: bookingDetails,
          date: new Date().toISOString(),
          status: "completed",
        }

        const updatedTransactions = [newTransaction, ...transactions]
        
        // Update transactions in localStorage
        try {
          localStorage.setItem("wallet_transactions", JSON.stringify(updatedTransactions))
        } catch (err) {
          throw new Error("Failed to save transaction history")
        }

        setBalance(newBalance)
        setTransactions(updatedTransactions)
        setProcessing(false)

        // Redirect to success page
        try {
          await router.push("/featured?payment=success")
        } catch (err) {
          console.error("Error navigating to success page:", err)
          setError("Payment successful but failed to redirect. Please go to featured homes manually.")
          setProcessing(false)
        }
      } catch (err) {
        console.error("Error processing payment:", err)
        setError(err instanceof Error ? err.message : "Failed to process payment. Please try again.")
        setProcessing(false)
      }
    } catch (err) {
      console.error("Unexpected error in handleMakePayment:", err)
      setError("An unexpected error occurred. Please try again.")
      setProcessing(false)
    }
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
              Wallet
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-black dark:text-white">Loading wallet...</p>
          </div>
        ) : (
          <>
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-primary-yellow to-yellow-400 rounded-2xl p-6 mb-6 shadow-lg">
          <p className="text-sm text-black/70 mb-2 font-medium">Wallet Balance</p>
          <p className="text-4xl font-bold text-black mb-1">{formatPrice(balance)}</p>
          {paymentAmount && (
            <p className="text-sm text-black/70">
              Payment required: {formatPrice(parseFloat(paymentAmount))}
            </p>
          )}
        </div>

        {/* Insufficient Funds Notification */}
        {showInsufficientFunds && paymentAmount && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Insufficient Funds
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Your wallet balance ({formatPrice(balance)}) is less than the required payment amount ({formatPrice(parseFloat(paymentAmount))}). 
                  Please fund your wallet to complete the payment.
                </p>
                <button
                  onClick={() => router.push("/wallet/fund")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  Fund Wallet Now
                </button>
              </div>
              <button
                onClick={() => setShowInsufficientFunds(false)}
                className="flex-shrink-0 p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => router.push("/wallet/fund")}
            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-primary-yellow dark:hover:border-primary-yellow transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary-yellow/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-semibold text-black dark:text-white">Fund Wallet</span>
            </div>
          </button>

              <button
                onClick={handleMakePayment}
                disabled={processing || !paymentAmount || balance < parseFloat(paymentAmount || "0")}
                className={`border-2 rounded-xl p-4 transition-all relative ${
                  balance >= parseFloat(paymentAmount || "0") && paymentAmount
                    ? "bg-primary-yellow border-primary-yellow hover:bg-yellow-400"
                    : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    balance >= parseFloat(paymentAmount || "0") && paymentAmount
                      ? "bg-black/10"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}>
                    <svg className={`w-6 h-6 ${
                      balance >= parseFloat(paymentAmount || "0") && paymentAmount
                        ? "text-black"
                        : "text-gray-500 dark:text-gray-400"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className={`font-semibold ${
                    balance >= parseFloat(paymentAmount || "0") && paymentAmount
                      ? "text-black"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    Make Payment
                  </span>
                </div>
                {balance < parseFloat(paymentAmount || "0") && paymentAmount && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </div>
                )}
              </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Transaction History
          </h2>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "deposit"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : transaction.type === "payment"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}>
                      {transaction.type === "deposit" ? (
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      ) : transaction.type === "payment" ? (
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-black dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === "deposit"
                        ? "text-green-600 dark:text-green-400"
                        : transaction.type === "payment"
                        ? "text-red-600 dark:text-red-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}>
                      {transaction.type === "deposit" ? "+" : "-"}
                      {formatPrice(transaction.amount)}
                    </p>
                    <p className={`text-xs mt-1 ${
                      transaction.status === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : transaction.status === "pending"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>

    </div>
  )
}

export default function WalletPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <WalletPageContent />
    </Suspense>
  )
}

