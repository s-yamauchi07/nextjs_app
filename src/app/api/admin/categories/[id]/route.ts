import { RequestCategoryBody } from "@/app/_type/RequestCategoryBody";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

const checkAuthorization = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ status: error.message }, { status: 400 })
}

// カテゴリー詳細表示のAPI
export const GET = async (request: NextRequest, { params}: { params: { id: string }}) => {
  checkAuthorization(request);  
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

// カテゴリー編集のAPI
export const PUT = async (request: NextRequest, { params}: { params: { id: string }}) => {
  checkAuthorization(request);  

  const { id } = params
  const body = await request.json()
  const { name }: RequestCategoryBody = body

  try {
    const category = await prisma.category.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name
      },
    })

    return NextResponse.json({ status: 'OK', category: category }, { status: 200 })
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// カテゴリー削除のAPI
export const DELETE = async (request: NextRequest, { params }: { params: { id: string} }) => {
  checkAuthorization(request);
  
  const { id } = params

  try{
    await prisma.category.delete({
      where: {
        id: parseInt(id)
      },
    })

    return NextResponse.json({ status: 'OK', message: 'カテゴリーを削除しました'} , { status: 200 })
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
