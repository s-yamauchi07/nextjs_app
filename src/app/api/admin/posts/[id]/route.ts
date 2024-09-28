import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { RequestBody } from "../../../../_type/RequestBody";

const prisma = new PrismaClient

// 記事詳細取得のAPI
export const GET = async (request: NextRequest, { params }: { params: { id: string }}) => {
  const { id } = params 

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select:{
                id: true,
                name: true
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ status: 'OK', post: post}, { status: 200 })
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// 記事更新のAPI
export const PUT = async(request: NextRequest, {params}: { params: { id: string } }) => {
  const { id } = params

  const body = await request.json()
  const { title, content, thumbnailUrl, categories}: RequestBody  = body

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title,
        content,
        thumbnailUrl
      },
    })

    // 記事とカテゴリーの中間テーブルを削除(該当のpostIdを持つレコードを全て削除)
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: parseInt(id),
          categoryId: category.id,
        },
      })
    }

    return NextResponse.json({ status: 'OK', post: post }, { status: 200} )
  } catch(error) {
    if(error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// 記事削除のAPI
export const DELETE = async (request: NextRequest, { params}: { params: { id: string } }) => {
  const { id } = params

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id)
      },
    })

    return NextResponse.json({ status: 'OK'}, { status: 200 })
  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}