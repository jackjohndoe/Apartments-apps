// Utility functions for managing favorites in localStorage

export interface FavoriteApartment {
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

const FAVORITES_KEY = "apartment_favorites"

export function getFavorites(): FavoriteApartment[] {
  if (typeof window === "undefined") return []
  
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error("Error reading favorites:", error)
    return []
  }
}

export function addToFavorites(apartment: FavoriteApartment): void {
  if (typeof window === "undefined") return
  
  try {
    const favorites = getFavorites()
    const exists = favorites.some((fav) => fav.id === apartment.id)
    
    if (!exists) {
      favorites.push(apartment)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  } catch (error) {
    console.error("Error adding to favorites:", error)
  }
}

export function removeFromFavorites(apartmentId: string): void {
  if (typeof window === "undefined") return
  
  try {
    const favorites = getFavorites()
    const filtered = favorites.filter((fav) => fav.id !== apartmentId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Error removing from favorites:", error)
  }
}

export function isFavorite(apartmentId: string): boolean {
  if (typeof window === "undefined") return false
  
  try {
    const favorites = getFavorites()
    return favorites.some((fav) => fav.id === apartmentId)
  } catch (error) {
    console.error("Error checking favorites:", error)
    return false
  }
}

export function toggleFavorite(apartment: FavoriteApartment): void {
  if (isFavorite(apartment.id)) {
    removeFromFavorites(apartment.id)
  } else {
    addToFavorites(apartment)
  }
}

