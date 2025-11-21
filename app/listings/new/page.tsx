"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BottomNavigation from "@/components/BottomNavigation"

export default function NewListingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    bedrooms: "1",
    bathrooms: "1",
    amenities: "",
  })
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []

    // Limit each file to 5MB
    const maxSizeBytes = 5 * 1024 * 1024
    const validFiles: File[] = []
    let rejected = 0

    files.forEach((file) => {
      if (file.size <= maxSizeBytes) {
        validFiles.push(file)
      } else {
        rejected += 1
      }
    })

    if (rejected > 0) {
      setError(
        `${rejected} file${rejected > 1 ? "s" : ""} exceeded 5MB and were not added. Please select files under 5MB.`
      )
    } else {
      setError("")
    }

    setMediaFiles(validFiles)
    setError("")
    setSuccess("")
  }

  useEffect(() => {
    // Generate previews for selected media
    const urls = mediaFiles.map((file) => URL.createObjectURL(file))
    setMediaPreviews(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [mediaFiles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic required fields
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim()
    ) {
      setError("Please fill in all required fields (title, description, price, address, city, state).")
      return
    }

    // Bedrooms and bathrooms validation
    const bedroomsNum = parseInt(formData.bedrooms, 10)
    const bathroomsNum = parseInt(formData.bathrooms, 10)
    if (!bedroomsNum || bedroomsNum <= 0 || !bathroomsNum || bathroomsNum <= 0) {
      setError("Please enter valid numbers for bedrooms and bathrooms (at least 1).")
      return
    }

    // Media required
    if (mediaFiles.length === 0) {
      setError("Please upload at least one photo or video of your property.")
      return
    }

    setLoading(true)

    try {
      const amenitiesArray = formData.amenities
        ? formData.amenities.split(",").map((item) => item.trim()).filter(Boolean)
        : []

      const body = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        address: formData.address,
        city: formData.city.trim(),
        state: formData.state.trim(),
        bedrooms: bedroomsNum.toString(),
        bathrooms: bathroomsNum.toString(),
        // For now, media upload is UI-only; backend still expects image URLs.
        // We send an empty array here or you can later plug in a real upload service.
        images: [],
        amenities: amenitiesArray,
      }

      const response = await fetch("/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || "Failed to create listing. You may need to be signed in.")
        setLoading(false)
        return
      }

      const created = await response.json()
      setSuccess("Listing created successfully!")
      setLoading(false)

      // Redirect to apartment details after short delay
      setTimeout(() => {
        if (created?.id) {
          router.push(`/apartments/${created.id}`)
        } else {
          router.push("/featured")
        }
      }, 1500)
    } catch (err) {
      console.error("Error creating listing:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-20 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
            Post a Listing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your property with guests looking for a home in Nigeria.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Modern 3-Bedroom Apartment in Victoria Island"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your property, its features, and what makes it special."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2500000"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street and house number"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Lagos"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Lagos State"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Photos / Video
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-4 py-6 bg-gray-50 dark:bg-gray-800/60 flex flex-col items-center justify-center text-center">
              <svg
                className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h2l.4-1.2A2 2 0 017.3 2h9.4a2 2 0 011.9 1.3L19 5h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm4 4a3 3 0 106 0 3 3 0 00-6 0z"
                />
              </svg>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                Upload photos or a short video of your property
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                You can select multiple files. Supported: images and MP4 video.
              </p>
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Choose files
                <input
                  type="file"
                  multiple
                  accept="image/*,video/mp4"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </label>
              {mediaFiles.length > 0 && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {mediaFiles.length} file{mediaFiles.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            {mediaPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {mediaPreviews.slice(0, 6).map((src, index) => (
                  <div
                    key={index}
                    className="relative w-full pb-[75%] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Parking, Security, Air Conditioning"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-primary-yellow text-black py-3 rounded-xl hover:bg-yellow-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting listing..." : "Post Listing"}
          </button>
        </form>
      </div>
      <BottomNavigation />
    </div>
  )
}


