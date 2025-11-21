"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import BottomNavigation from "@/components/BottomNavigation"
import { isSignedIn, setSignedOut } from "@/lib/authState"

interface Booking {
  id: string
  apartmentId: string
  apartmentTitle: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled"
  image: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: "booking" | "payment" | "system"
  read: boolean
  date: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<"info" | "notifications" | "listings" | "bookings">("info")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  })

  useEffect(() => {
    // Load user info from session or localStorage
    if (session?.user) {
      setUserInfo({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        image: session.user.image || "",
      })
    } else {
      // Try to load from localStorage
      const savedUser = localStorage.getItem("user_info")
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          setUserInfo({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            image: user.image || "",
          })
        } catch (err) {
          console.error("Error parsing user info:", err)
        }
      }
    }

    // Load bookings from localStorage
    const savedBookings = localStorage.getItem("user_bookings")
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings))
      } catch (err) {
        console.error("Error parsing bookings:", err)
      }
    } else {
      // Sample bookings for demo
      setBookings([])
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("user_notifications")
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (err) {
        console.error("Error parsing notifications:", err)
      }
    } else {
      // Sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: "1",
          title: "Booking Confirmed",
          message: "Your booking for Modern 3-Bedroom Apartment has been confirmed",
          type: "booking",
          read: false,
          date: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Payment Successful",
          message: "Your payment of ₦2,500,000 has been processed successfully",
          type: "payment",
          read: false,
          date: new Date(Date.now() - 86400000).toISOString(),
        },
      ]
      setNotifications(sampleNotifications)
      localStorage.setItem("user_notifications", JSON.stringify(sampleNotifications))
    }
  }, [session])

  const handleLogout = () => {
    signOut({ redirect: false })
    setSignedOut()
    router.push("/")
  }

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    )
    setNotifications(updated)
    localStorage.setItem("user_notifications", JSON.stringify(updated))
  }

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
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
            Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-4">
            {userInfo.image ? (
              <Image
                src={userInfo.image}
                alt={userInfo.name || "User"}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-yellow flex items-center justify-center text-black text-2xl font-bold">
                {userInfo.name?.[0]?.toUpperCase() || userInfo.email[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {userInfo.name || "User"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{userInfo.email}</p>
              {userInfo.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "info"
                  ? "border-primary-yellow text-primary-yellow"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 relative ${
                activeTab === "notifications"
                  ? "border-primary-yellow text-primary-yellow"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "listings"
                  ? "border-primary-yellow text-primary-yellow"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Post Listings
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "bookings"
                  ? "border-primary-yellow text-primary-yellow"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Past Bookings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Information */}
            {activeTab === "info" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                  />
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem("user_info", JSON.stringify(userInfo))
                    alert("Profile updated successfully!")
                  }}
                  className="w-full bg-primary-yellow text-black py-3 rounded-xl hover:bg-yellow-400 transition-all font-semibold"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        notification.read
                          ? "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                          : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.read ? "bg-gray-300" : "bg-primary-yellow"
                          }`}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-black dark:text-white mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(notification.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Post Listings */}
            {activeTab === "listings" && (
              <div>
                <div className="text-center py-12">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    No Listings Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start listing your property to reach thousands of guests
                  </p>
                  <Link
                    href="/listings/new"
                    className="inline-block bg-primary-yellow text-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all font-semibold"
                  >
                    Post a Listing
                  </Link>
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      No Bookings Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Your booking history will appear here
                    </p>
                    <Link
                      href="/featured"
                      className="inline-block bg-primary-yellow text-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all font-semibold"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex gap-4">
                        {booking.image && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={booking.image}
                              alt={booking.apartmentTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-black dark:text-white mb-1">
                            {booking.apartmentTitle}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-black dark:text-white">
                              {formatPrice(booking.totalPrice)}
                            </p>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 py-4 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-semibold"
          >
            Log Out
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
