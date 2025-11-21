import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          apartments: {
            orderBy: { createdAt: "desc" }
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      // Remove password from response and ensure apartments is an array
      const { password, ...userWithoutPassword } = user
      
      // Convert JSON strings to arrays for SQLite apartments
      const formattedApartments = (userWithoutPassword.apartments || []).map((apt: any) => ({
        ...apt,
        images: typeof apt.images === 'string' ? JSON.parse(apt.images || '[]') : apt.images,
        amenities: typeof apt.amenities === 'string' ? JSON.parse(apt.amenities || '[]') : apt.amenities,
      }))
      
      const userResponse = {
        ...userWithoutPassword,
        apartments: Array.isArray(formattedApartments) 
          ? formattedApartments 
          : []
      }

      return NextResponse.json(userResponse)
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        { error: "Internal server error", apartments: [] },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, image } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(image && { image }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

