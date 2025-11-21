import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const state = searchParams.get("state")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const bedrooms = searchParams.get("bedrooms")
    const featured = searchParams.get("featured")

    const where: any = {}

    if (city) {
      where.city = { contains: city, mode: "insensitive" }
    }

    if (state) {
      where.state = { contains: state, mode: "insensitive" }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms)
    }

    try {
      const apartments = await prisma.apartment.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: featured === "true" ? { createdAt: "desc" } : { createdAt: "desc" },
        take: featured === "true" ? 20 : undefined,
      })

      // Convert JSON strings to arrays for SQLite
      const formattedApartments = apartments.map(apt => ({
        ...apt,
        images: typeof apt.images === 'string' ? JSON.parse(apt.images || '[]') : apt.images,
        amenities: typeof apt.amenities === 'string' ? JSON.parse(apt.amenities || '[]') : apt.amenities,
      }))

          // If no apartments found and featured is requested, return sample apartments with real images
          if (formattedApartments.length === 0 && featured === "true") {
        const sampleApartments = [
          {
            id: "sample-1",
            title: "Modern 3-Bedroom Apartment in Victoria Island",
            description: "Spacious and elegantly furnished 3-bedroom apartment with stunning city views. Features modern kitchen, marble bathrooms, and a private balcony. Perfect for families or professionals.",
            price: 2500000,
            address: "15A Ahmadu Bello Way, Victoria Island",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.4281,
            longitude: 3.4219,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop"
            ],
            bedrooms: 3,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Premium Properties Ltd",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-2",
            title: "Luxury 2-Bedroom Penthouse in Lekki",
            description: "Beautifully designed penthouse with panoramic ocean views. Features high-end finishes, open-plan living area, and premium amenities. Ideal for executives and expatriates.",
            price: 3500000,
            address: "Plot 12, Admiralty Way, Lekki Phase 1",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.4654,
            longitude: 3.4738,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym", "Concierge"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Elite Homes",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-3",
            title: "Cozy 1-Bedroom Studio in Garki",
            description: "Well-maintained studio apartment in a secure estate. Perfect for young professionals. Close to shopping centers and business districts. Fully furnished and ready to move in.",
            price: 800000,
            address: "Block 12, Garki II, Area 8",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912173-6719d44e1e5e?w=800&h=600&fit=crop"
            ],
            bedrooms: 1,
            bathrooms: 1,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Abuja Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-4",
            title: "Spacious 4-Bedroom Family Home in Port Harcourt",
            description: "Large family home with beautiful garden and ample parking space. Features modern kitchen, multiple living areas, and children's play area. Perfect for large families.",
            price: 1800000,
            address: "15 Woji Road, GRA Phase 2",
            city: "Port Harcourt",
            state: "Rivers State",
            latitude: 4.8156,
            longitude: 7.0498,
            images: [
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
            ],
            bedrooms: 4,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Garden", "Playground"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Rivers Realty",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-5",
            title: "Elegant 2-Bedroom Apartment in Ibadan",
            description: "Charming apartment in a quiet neighborhood. Features traditional Nigerian design elements with modern amenities. Close to universities and markets.",
            price: 600000,
            address: "Plot 8, Bodija Estate, Ibadan",
            city: "Ibadan",
            state: "Oyo State",
            latitude: 7.3775,
            longitude: 3.9470,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Oyo Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-6",
            title: "Contemporary 3-Bedroom Duplex in Kano",
            description: "Modern duplex with contemporary design. Features spacious rooms, modern kitchen, and private garden. Located in a secure gated community.",
            price: 1200000,
            address: "No. 25, Nassarawa GRA, Kano",
            city: "Kano",
            state: "Kano State",
            latitude: 12.0022,
            longitude: 8.5919,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 3,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Garden"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Kano Estates",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-7",
            title: "Stylish 2-Bedroom Apartment in Ikeja",
            description: "Modern apartment in the heart of Ikeja. Close to shopping malls, restaurants, and business centers. Features contemporary design and premium finishes.",
            price: 1500000,
            address: "15 Oba Akran Avenue, Ikeja",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.5244,
            longitude: 3.3792,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Gym"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Ikeja Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-8",
            title: "Luxury 5-Bedroom Mansion in Asokoro",
            description: "Magnificent mansion in the prestigious Asokoro district. Features grand living spaces, private pool, and extensive gardens. Perfect for high-profile families.",
            price: 5000000,
            address: "Plot 25, Asokoro District",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 5,
            bathrooms: 4,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym", "Garden", "Concierge"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Premium Estates",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-9",
            title: "Comfortable 1-Bedroom Apartment in Surulere",
            description: "Cozy apartment in a vibrant neighborhood. Walking distance to markets, schools, and transport hubs. Great for young professionals and students.",
            price: 700000,
            address: "12 Bode Thomas Street, Surulere",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.4924,
            longitude: 3.3558,
            images: [
              "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912173-6719d44e1e5e?w=800&h=600&fit=crop"
            ],
            bedrooms: 1,
            bathrooms: 1,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Surulere Realty",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-10",
            title: "Elegant 3-Bedroom Apartment in Wuse 2",
            description: "Beautifully designed apartment in a prime location. Features modern amenities, spacious rooms, and excellent security. Close to embassies and business districts.",
            price: 2200000,
            address: "Plot 8, Wuse Zone 2",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
            ],
            bedrooms: 3,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Abuja Premium",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-11",
            title: "Modern 2-Bedroom Flat in Yaba",
            description: "Contemporary flat in a developing area. Great investment opportunity. Features modern finishes and is close to tech hubs and universities.",
            price: 1200000,
            address: "45 Herbert Macaulay Way, Yaba",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.5023,
            longitude: 3.3779,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Yaba Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-12",
            title: "Spacious 4-Bedroom Duplex in Gwarinpa",
            description: "Large family duplex in a secure estate. Features multiple living areas, modern kitchen, and private garden. Perfect for extended families.",
            price: 2800000,
            address: "Block 12, Gwarinpa Estate",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 4,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Garden", "Playground"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Gwarinpa Estates",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
            return NextResponse.json(sampleApartments)
          }

          return NextResponse.json(formattedApartments || [])
    } catch (dbError) {
      // If database is not set up and featured is requested, return sample apartments
      if (featured === "true") {
        const sampleApartments = [
          {
            id: "sample-1",
            title: "Modern 3-Bedroom Apartment in Victoria Island",
            description: "Spacious and elegantly furnished 3-bedroom apartment with stunning city views. Features modern kitchen, marble bathrooms, and a private balcony. Perfect for families or professionals.",
            price: 2500000,
            address: "15A Ahmadu Bello Way, Victoria Island",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.4281,
            longitude: 3.4219,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop"
            ],
            bedrooms: 3,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Premium Properties Ltd",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-2",
            title: "Luxury 2-Bedroom Penthouse in Lekki",
            description: "Beautifully designed penthouse with panoramic ocean views. Features high-end finishes, open-plan living area, and premium amenities. Ideal for executives and expatriates.",
            price: 3500000,
            address: "Plot 12, Admiralty Way, Lekki Phase 1",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.4654,
            longitude: 3.4738,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym", "Concierge"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Elite Homes",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-3",
            title: "Cozy 1-Bedroom Studio in Garki",
            description: "Well-maintained studio apartment in a secure estate. Perfect for young professionals. Close to shopping centers and business districts. Fully furnished and ready to move in.",
            price: 800000,
            address: "Block 12, Garki II, Area 8",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912173-6719d44e1e5e?w=800&h=600&fit=crop"
            ],
            bedrooms: 1,
            bathrooms: 1,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Abuja Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-4",
            title: "Spacious 4-Bedroom Family Home in Port Harcourt",
            description: "Large family home with beautiful garden and ample parking space. Features modern kitchen, multiple living areas, and children's play area. Perfect for large families.",
            price: 1800000,
            address: "15 Woji Road, GRA Phase 2",
            city: "Port Harcourt",
            state: "Rivers State",
            latitude: 4.8156,
            longitude: 7.0498,
            images: [
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
            ],
            bedrooms: 4,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Garden", "Playground"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Rivers Realty",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-5",
            title: "Elegant 2-Bedroom Apartment in Ibadan",
            description: "Charming apartment in a quiet neighborhood. Features traditional Nigerian design elements with modern amenities. Close to universities and markets.",
            price: 600000,
            address: "Plot 8, Bodija Estate, Ibadan",
            city: "Ibadan",
            state: "Oyo State",
            latitude: 7.3775,
            longitude: 3.9470,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Oyo Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-6",
            title: "Contemporary 3-Bedroom Duplex in Kano",
            description: "Modern duplex with contemporary design. Features spacious rooms, modern kitchen, and private garden. Located in a secure gated community.",
            price: 1200000,
            address: "No. 25, Nassarawa GRA, Kano",
            city: "Kano",
            state: "Kano State",
            latitude: 12.0022,
            longitude: 8.5919,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 3,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Garden"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Kano Estates",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-7",
            title: "Stylish 2-Bedroom Apartment in Ikeja",
            description: "Modern apartment in the heart of Ikeja. Close to shopping malls, restaurants, and business centers. Features contemporary design and premium finishes.",
            price: 1500000,
            address: "15 Oba Akran Avenue, Ikeja",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.5244,
            longitude: 3.3792,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Gym"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Ikeja Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-8",
            title: "Luxury 5-Bedroom Mansion in Asokoro",
            description: "Magnificent mansion in the prestigious Asokoro district. Features grand living spaces, private pool, and extensive gardens. Perfect for high-profile families.",
            price: 5000000,
            address: "Plot 25, Asokoro District",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 5,
            bathrooms: 4,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym", "Garden", "Concierge"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Premium Estates",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-9",
            title: "Comfortable 1-Bedroom Apartment in Surulere",
            description: "Cozy apartment in a vibrant neighborhood. Walking distance to markets, schools, and transport hubs. Great for young professionals and students.",
            price: 700000,
            address: "12 Bode Thomas Street, Surulere",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.4924,
            longitude: 3.3558,
            images: [
              "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912173-6719d44e1e5e?w=800&h=600&fit=crop"
            ],
            bedrooms: 1,
            bathrooms: 1,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Surulere Realty",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-10",
            title: "Elegant 3-Bedroom Apartment in Wuse 2",
            description: "Beautifully designed apartment in a prime location. Features modern amenities, spacious rooms, and excellent security. Close to embassies and business districts.",
            price: 2200000,
            address: "Plot 8, Wuse Zone 2",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
            ],
            bedrooms: 3,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Swimming Pool", "Gym"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Abuja Premium",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-11",
            title: "Modern 2-Bedroom Flat in Yaba",
            description: "Contemporary flat in a developing area. Great investment opportunity. Features modern finishes and is close to tech hubs and universities.",
            price: 1200000,
            address: "45 Herbert Macaulay Way, Yaba",
            city: "Lagos",
            state: "Lagos State",
            latitude: 6.5023,
            longitude: 3.3779,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Yaba Properties",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "sample-12",
            title: "Spacious 4-Bedroom Duplex in Gwarinpa",
            description: "Large family duplex in a secure estate. Features multiple living areas, modern kitchen, and private garden. Perfect for extended families.",
            price: 2800000,
            address: "Block 12, Gwarinpa Estate",
            city: "Abuja",
            state: "Abuja FCT",
            latitude: 9.0765,
            longitude: 7.3986,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
            ],
            bedrooms: 4,
            bathrooms: 3,
            amenities: ["WiFi", "Air Conditioning", "Parking", "Security", "Garden", "Playground"],
            ownerId: "sample-owner",
            owner: {
              id: "sample-owner",
              name: "Gwarinpa Estates",
              image: null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
        return NextResponse.json(sampleApartments)
      }
      console.error("Database error:", dbError)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error fetching apartments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      address,
      city,
      state,
      latitude,
      longitude,
      images,
      bedrooms,
      bathrooms,
      amenities,
    } = body

    if (!title || !description || !price || !address || !city || !state) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Determine ownerId (best-effort; fall back for UI-only mode)
    let ownerId = "sample-owner"
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        ownerId = session.user.id as string
      }
    } catch (ownerError) {
      console.error("Error resolving owner for apartment (non-fatal):", ownerError)
    }

    try {
      const apartment = await prisma.apartment.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          address,
          city,
          state,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          images: JSON.stringify(images || []) as any, // Convert array to JSON string for SQLite
          bedrooms: parseInt(bedrooms) || 1,
          bathrooms: parseInt(bathrooms) || 1,
          amenities: JSON.stringify(amenities || []) as any, // Convert array to JSON string for SQLite
          ownerId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      })

      // Convert JSON strings back to arrays for response
      const formattedApartment = {
        ...apartment,
        images: typeof apartment.images === 'string' ? JSON.parse(apartment.images) : apartment.images,
        amenities: typeof apartment.amenities === 'string' ? JSON.parse(apartment.amenities) : apartment.amenities,
      }

      return NextResponse.json(formattedApartment, { status: 201 })
    } catch (dbError) {
      console.error("Database error creating apartment, falling back to UI-only listing:", dbError)

      // UI-only fallback: return a mock listing so the flow continues without a DB
      const now = new Date()
      const fallbackApartment = {
        id: `ui-${Date.now()}`,
        title,
        description,
        price: parseFloat(price),
        address,
        city,
        state,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: images || [],
        bedrooms: parseInt(bedrooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        amenities: amenities || [],
        ownerId,
        owner: {
          id: ownerId,
          name: "Demo Owner",
          image: null,
        },
        createdAt: now,
        updatedAt: now,
      }

      return NextResponse.json(fallbackApartment, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating apartment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

