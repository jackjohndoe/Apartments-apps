"use client"

import Link from "next/link"
import Image from "next/image"
import FavoriteButton from "./FavoriteButton"

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
}

interface ApartmentCardProps {
  apartment: Apartment
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="group relative">
      <Link
        href={`/apartments/${apartment.id}`}
        className="block"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="relative h-64 bg-gray-50 dark:bg-gray-700 overflow-hidden">
          {apartment.images && apartment.images.length > 0 ? (
            <Image
              src={apartment.images[0]}
              alt={apartment.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-500">
              No Image
            </div>
          )}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton apartment={apartment} />
          </div>
          </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">
              {apartment.title}
            </h3>
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">
            {formatPrice(apartment.price)}<span className="text-gray-600 dark:text-gray-400 font-normal text-sm">/month</span>
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
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
  )
}

