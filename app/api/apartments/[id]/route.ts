import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Sample apartments data
const sampleApartments: Record<string, any> = {
  "sample-1": {
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
      email: "contact@premiumproperties.com",
      phone: null,
      image: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  "sample-2": {
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
      email: "contact@elitehomes.com",
      phone: null,
      image: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  "sample-3": {
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
      email: "contact@abujaproperties.com",
      phone: null,
      image: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  "sample-4": {
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
      email: "contact@riversrealty.com",
      phone: null,
      image: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  "sample-5": {
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
      email: "contact@oyoproperties.com",
      phone: null,
      image: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  "sample-6": {
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
      email: "contact@kanoestates.com",
      phone: null,
      image: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if it's a sample apartment first
    if (sampleApartments[params.id]) {
      return NextResponse.json(sampleApartments[params.id])
    }

    const apartment = await prisma.apartment.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          }
        }
      }
    })

    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      )
    }

    // Convert JSON strings to arrays for SQLite
    const formattedApartment = {
      ...apartment,
      images: typeof apartment.images === 'string' ? JSON.parse(apartment.images || '[]') : apartment.images,
      amenities: typeof apartment.amenities === 'string' ? JSON.parse(apartment.amenities || '[]') : apartment.amenities,
    }

    return NextResponse.json(formattedApartment)
  } catch (error) {
    console.error("Error fetching apartment:", error)
    // If database error and it's a sample ID, return sample data
    if (sampleApartments[params.id]) {
      return NextResponse.json(sampleApartments[params.id])
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

