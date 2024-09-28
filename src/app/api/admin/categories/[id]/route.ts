import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

// カテゴリー詳細表示のAPI
export const GET = async (request: NextRequest, { params}: { params: { id: string }}) => {
  const { id } = params

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id)
      },
    })

    return NextResponse.json({ status: 'OK', category: category}, { status: 200 })
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}