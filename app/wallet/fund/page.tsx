"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function FundWalletPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState<string>("")
  const [selectedBank, setSelectedBank] = useState<string>("gtb")
  const [copied, setCopied] = useState<string>("")
  const [error, setError] = useState<string>("")
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

  const handleContinue = async () => {
    try {
      setError("")
      setProcessing(true)

      if (!amount || amount.trim() === "") {
        setError("Please enter an amount to fund your wallet.")
        setProcessing(false)
        return
      }

      const parsedAmount = parseFloat(amount)
      if (isNaN(parsedAmount) || !isFinite(parsedAmount)) {
        setError("Please enter a valid amount.")
        setProcessing(false)
        return
      }

      if (parsedAmount <= 0) {
        setError("Amount must be greater than zero.")
        setProcessing(false)
        return
      }

      if (parsedAmount > 100000000) {
        setError("Amount is too large. Maximum is ₦100,000,000.")
        setProcessing(false)
        return
      }

      // Redirect back to wallet
      try {
        await router.push(`/wallet?funding=${parsedAmount}`)
      } catch (err) {
        console.error("Error navigating:", err)
        setError("Failed to navigate. Please try again.")
        setProcessing(false)
      }
    } catch (err) {
      console.error("Unexpected error in handleContinue:", err)
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
              Fund Wallet
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

        {/* Amount Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Enter Amount
          </h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              ₦
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            />
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
                <li>Transfer the exact amount to the account details above</li>
                <li>Use your registered name as the transfer reference</li>
                <li>Funds will be credited to your wallet within 24 hours</li>
                <li>Contact support if you don&apos;t receive your funds after 24 hours</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!amount || parseFloat(amount) <= 0 || processing}
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
            "I've Made the Transfer"
          )}
        </button>
      </div>
    </div>
  )
}

export default function FundWalletPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <FundWalletPageContent />
    </Suspense>
  )
}

