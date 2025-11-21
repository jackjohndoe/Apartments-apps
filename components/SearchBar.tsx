"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Benin City",
  "Enugu",
  "Kaduna",
  "Aba",
  "Jos",
  "Ilorin",
  "Warri",
]

const NIGERIAN_STATES = [
  "Lagos State",
  "Abuja FCT",
  "Rivers State",
  "Oyo State",
  "Kano State",
  "Edo State",
  "Enugu State",
  "Kaduna State",
  "Abia State",
  "Plateau State",
  "Kwara State",
  "Delta State",
]

export default function SearchBar() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (searchParams.city) params.append("city", searchParams.city)
    if (searchParams.state) params.append("state", searchParams.state)
    if (searchParams.minPrice) params.append("minPrice", searchParams.minPrice)
    if (searchParams.maxPrice) params.append("maxPrice", searchParams.maxPrice)
    if (searchParams.bedrooms) params.append("bedrooms", searchParams.bedrooms)

    router.push(`/map?${params.toString()}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-all hover:shadow-xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City
          </label>
          <select
            id="city"
            name="city"
            value={searchParams.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary-yellow focus:border-primary-yellow"
          >
            <option value="">All Cities</option>
            {NIGERIAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State
          </label>
          <select
            id="state"
            name="state"
            value={searchParams.state}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary-yellow focus:border-primary-yellow"
          >
            <option value="">All States</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min Price (₦)
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={searchParams.minPrice}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary-yellow focus:border-primary-yellow"
          />
        </div>

        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={searchParams.bedrooms}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary-yellow focus:border-primary-yellow"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm hover:shadow-md"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

