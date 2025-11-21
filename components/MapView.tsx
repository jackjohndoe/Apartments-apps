"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import GoogleMapsLoader from "./GoogleMapsLoader"

interface Apartment {
  id: string
  title: string
  price: number
  city: string
  state: string
  latitude: number | null
  longitude: number | null
}

interface MapViewProps {
  apartments: Apartment[]
  initialCenter?: { lat: number; lng: number }
}

const defaultCenter = {
  lat: 6.5244, // Lagos coordinates
  lng: 3.3792,
}

export default function MapView({ apartments, initialCenter }: MapViewProps) {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const center = initialCenter || defaultCenter

  useEffect(() => {
    const initMap = async () => {
      if (!window.google || !mapRef.current) return

      try {
        const { Map } = await window.google.maps.importLibrary("maps")
        
        const newMap = new Map(mapRef.current, {
          center: center,
          zoom: 10,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }],
            },
          ],
        })

        setMap(newMap)
        setIsLoaded(true)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    if (window.google && window.google.maps) {
      initMap()
    } else {
      // Wait for Google Maps to load
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle)
          initMap()
        }
      }, 100)

      return () => clearInterval(checkGoogle)
    }
  }, [center])

  useEffect(() => {
    if (!map || !isLoaded) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    const apartmentsWithLocation = apartments.filter(
      (apt) => apt.latitude !== null && apt.longitude !== null
    )

    // Create markers
    apartmentsWithLocation.forEach((apartment) => {
      if (!map) return

      const marker = new window.google.maps.Marker({
        position: {
          lat: apartment.latitude!,
          lng: apartment.longitude!,
        },
        map: map,
        title: apartment.title,
      })

      marker.addListener("click", () => {
        setSelectedApartment(apartment)
      })

      markersRef.current.push(marker)
    })
  }, [map, isLoaded, apartments])

  useEffect(() => {
    if (!map || !selectedApartment) {
      if (infoWindowRef.current) {
        infoWindowRef.current.close()
      }
      return
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      }).format(price)
    }

    const content = `
      <div style="padding: 8px; min-width: 200px;">
        <h3 style="font-weight: 600; margin-bottom: 4px; color: #000;">${selectedApartment.title}</h3>
        <p style="color: #FFD700; font-weight: bold; margin-bottom: 4px;">${formatPrice(selectedApartment.price)}/month</p>
        <p style="color: #666; font-size: 14px; margin-bottom: 8px;">${selectedApartment.city}, ${selectedApartment.state}</p>
        <a href="/apartments/${selectedApartment.id}" style="color: #FFD700; text-decoration: none; font-weight: 500; font-size: 14px;">View Details →</a>
      </div>
    `

    if (infoWindowRef.current) {
      infoWindowRef.current.close()
    }

    const infoWindow = new window.google.maps.InfoWindow({
      content: content,
    })

    infoWindow.setPosition({
      lat: selectedApartment.latitude!,
      lng: selectedApartment.longitude!,
    })

    infoWindow.open(map)
    infoWindowRef.current = infoWindow

    infoWindow.addListener("closeclick", () => {
      setSelectedApartment(null)
    })
  }, [map, selectedApartment])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-center px-4">
          Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
        </p>
      </div>
    )
  }

  return (
    <>
      <GoogleMapsLoader />
      <div className="w-full relative">
        {!isLoaded && (
          <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg absolute inset-0 z-10">
            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        )}
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-lg"
          style={{ minHeight: "600px" }}
        />
      </div>
    </>
  )
}

