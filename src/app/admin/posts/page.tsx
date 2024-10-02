"use client"

import SideBar from "@/app/_components/SideBar";
import Link from "next/link";
import { useState, useEffect } from "react";

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
}

const AllPost: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(()=> {
    const AllPost = async () => {
      try {
        const response = await fetch("/api/admin/posts")
        const data = await response.json();
        setPosts(data.posts);
      } catch(error) {
        console.log(error);
      }
    }
    AllPost();
  }, []);

  const changeDateFormat = (date: any) => new Date(date).toLocaleDateString('ja-JP')

  return(
    <div className="flex">
      <SideBar />
      <div className="p-10 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            記事一覧
          </h2>
          <div>
            <button type="button"
              className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
            >
              <Link href="/admin/categories/new">新規作成</Link>
            </button>
          </div>
        </div>

        <div className="p-4">
          <ul>
            {posts.map((post) => {
              return(
                <li 
                  key={post.id}
                  className="py-4 border-b-2"
                >
                <Link href={`/admin/posts/${post.id}`} className="font-bold text-lg">
                  {post.title}
                </Link>
                <p className="text-gray-400">
                  {changeDateFormat(post.createdAt)}
                </p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>

  )
}

export default AllPost;