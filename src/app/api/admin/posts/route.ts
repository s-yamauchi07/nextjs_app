import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from '@/utils/supabase'

const prisma = new PrismaClient();

const checkAuthorization = async (request: NextRequest) => {
  // headersからtokenを受け取り、supabaseに送信。送信結果がnullかundefinedだったら''をtokenに代入。
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  // supabaseにからエラー返却されたら、レスポンスでエラーを返す。
  if (error) return NextResponse.json({ status: error.message }, { status: 400 })
}

export const GET = async (request: NextRequest) => {
  checkAuthorization(request);

  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ status: 'OK', posts: posts}, { status: 200 })
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
};

export const POST = async (request: NextRequest) => {
  checkAuthorization(request);
  
  try {
    const body = await request.json()
    const { title, content, thumbnailImageKey, categories}  = body

    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: parseInt(category.id as unknown as string, 10),
          postId: data.id,
        },
      })
    }

    return NextResponse.json({ status: 'OK', message: '作成しました', id: data.id })
  } catch(error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message}, { status: 400 })
    }
  }
}