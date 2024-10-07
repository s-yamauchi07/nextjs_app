import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

const checkAuthorization = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ status: error.message }, { status: 400 })
}

// カテゴリー一覧の取得
export const GET = async (request: NextRequest) => {
  checkAuthorization(request);

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

// カテゴリーの新規作成
export const POST = async (request: NextRequest) => {
  checkAuthorization(request);
  
  const body = await request.json()
  const { name } = body

  try {
    const data = await prisma.category.create({
      data: {
        name
      },
    })

    return NextResponse.json({ status: 'OK', message: '作成しました'}, { status: 200 })
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}