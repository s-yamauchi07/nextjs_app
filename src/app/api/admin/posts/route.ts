import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { RequestPostBody } from "../../../_type/RequestPostBody";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
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
  try {
    const body = await request.json()
    const { title, content, thumbnailUrl, categories}: RequestPostBody  = body

    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
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