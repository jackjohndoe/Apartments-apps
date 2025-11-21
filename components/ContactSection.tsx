"use client"

import { useState } from "react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission (you can replace this with actual API call)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    }, 1000)
  }

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-black dark:text-gray-300">
            We&apos;re here to help you find your perfect home
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-primary-yellow p-8 rounded-2xl text-center">
              <p className="text-lg font-medium text-black dark:text-white">
                Thank you! We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 text-black dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-100 dark:bg-gray-800 text-black dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:outline-none transition-all shadow-md"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-black dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-100 dark:bg-gray-800 text-black dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:outline-none transition-all shadow-md"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2 text-black dark:text-white"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-stone-100 dark:bg-gray-800 text-black dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:outline-none transition-all shadow-md"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-black dark:text-white"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-stone-100 dark:bg-gray-800 text-black dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:outline-none transition-all resize-none shadow-md"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-yellow text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}

              <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-primary-yellow/20 dark:bg-primary-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Email</h3>
                  <p className="text-black dark:text-gray-300">info@nigerianapartments.com</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-primary-yellow/20 dark:bg-primary-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📞</span>
                  </div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Phone</h3>
                  <p className="text-black dark:text-gray-300">+234 800 000 0000</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-primary-yellow/20 dark:bg-primary-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📍</span>
                  </div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Location</h3>
                  <p className="text-black dark:text-gray-300">Lagos, Nigeria</p>
                </div>
              </div>
        </div>
      </div>
    </section>
  )
}

