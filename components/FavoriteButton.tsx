"use client"

import { useState, useEffect } from "react"
import { isFavorite, toggleFavorite, FavoriteApartment } from "@/lib/favorites"

interface FavoriteButtonProps {
  apartment: FavoriteApartment
  className?: string
}

export default function FavoriteButton({ apartment, className = "" }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    setFavorited(isFavorite(apartment.id))
  }, [apartment.id])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(apartment)
    setFavorited(!favorited)
    
    // Trigger custom event to update other components
    window.dispatchEvent(new CustomEvent("favoritesUpdated"))
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all ${
        favorited
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/90 text-gray-700 hover:bg-white dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800"
      } shadow-md hover:shadow-lg ${className}`}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className="w-5 h-5"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}

