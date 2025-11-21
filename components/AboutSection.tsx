export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-black dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to find your perfect home
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-primary-yellow/30 dark:border-primary-yellow/20 shadow-sm hover:shadow-lg transition-all hover:border-primary-yellow">
            <div className="w-16 h-16 bg-primary-yellow/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
              Verified Listings
            </h3>
            <p className="text-black dark:text-gray-300">
              All properties are verified and trusted
            </p>
          </div>

          <div className="bg-primary-yellow dark:bg-primary-yellow p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-primary-yellow">
            <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Map View
            </h3>
            <p className="text-black">
              Explore locations visually on our interactive map
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-primary-yellow/30 dark:border-primary-yellow/20 shadow-sm hover:shadow-lg transition-all hover:border-primary-yellow">
            <div className="w-16 h-16 bg-primary-yellow/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
              Transparent Pricing
            </h3>
            <p className="text-black dark:text-gray-300">
              Clear pricing in Nigerian Naira, no hidden fees
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
