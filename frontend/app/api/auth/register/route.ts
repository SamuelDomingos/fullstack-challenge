import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, condominiumName, address } = body

    if (!email || !password || !name || !condominiumName || !address) {
      return NextResponse.json(
        { error: "All fields (email, password, name, condominiumName, address) are required" },
        { status: 400 }
      )
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    })

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const result = await prisma.$transaction(async (tx) => {
        const condominium = await tx.condominium.create({
          data: {
            name: condominiumName,
            address: address,
          },
        })

        const user = await tx.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            role: "ADMIN",
            condominiumId: condominium.id,
          },
        })

        return { user, condominium }
      })

      return NextResponse.json(
        { message: "User and Condominium created successfully", userId: result.user.id },
        { status: 201 }
      )
    } catch (error) {
      console.error("Transaction error:", error)
      return NextResponse.json(
        { error: "Internal server error during registration" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
