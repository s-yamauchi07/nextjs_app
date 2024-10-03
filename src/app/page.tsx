"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import parse from 'html-react-parser';

type Category = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

type Post = {
  id: number
  title: string
  content: string
  createdAt: string
  postCategories: { category: Category }[]
  thumbnailUrl: string
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAllPosts = async() => {
      try{
        const response = await fetch("/api/posts")
        const data  = await response.json();
        setPosts(data.posts);
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getAllPosts();
  },[]);

  const changeDateFormat = (date: string) => new Date(date).toLocaleDateString('ja-JP');

  if (isLoading) return <div>読み込み中...</div>;
  if (!posts.length) return <div>記事が見つかりませんでした。</div>;

  return (
    <main className="pt-10">
      <ul className="flex flex-col gap-8">
        {posts.map((post)=> {
          return(
            <li key={post.id} className="m-auto p-4 border border-solid border-gray-300 w-11/12 max-w-3xl">
              <Link href={`/posts/${post.id}`}>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-400">{changeDateFormat(post.createdAt)}</p>
                  <div className="flex gap-2">
                    {post.postCategories.map((postCategory, index)=>{
                      return(
                        <span key={index} className="px-2 py-1 text-xs text-blue-600 border border-solid border-blue-600 rounded">
                          {postCategory.category.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <h2 className="text-2xl py-4">
                  {post.title}
                </h2>
                <div className="line-clamp-2">
                  {parse(post.content)}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  );
}

export default Home;
