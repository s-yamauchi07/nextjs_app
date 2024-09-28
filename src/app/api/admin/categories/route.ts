import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient

// カテゴリー一覧の取得
export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ status: 'OK', categories: categories }, { status: 200 })
  } catch(error) {
    if (error instanceof Error) 
      return NextResponse.json({ status: error.message }, { status: 400})
  } 
};