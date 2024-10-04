"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { PostProps } from "@/app/_type/PostProps";
import { Post } from "../../_type/AllPostBody";
import parse from 'html-react-parser';


const Detail: React.FC<PostProps> = ({params}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    const findPost = async() => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        const data = await response.json();
        setPost(data.post);
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    findPost();
  },[]);

  const changeDateFormat = (date: string) => new Date(date).toLocaleDateString('ja-JP');

  if(isLoading) return <div>読み込み中...</div>;
  if(!post) return <div>記事が見つかりませんでした。</div>;

  return(
    <div className="max-w-3xl m-auto pt-14">
      {/* <Image 
        src={post.thumbnailUrl}
        height={400}
        width={800}
        alt={post.title}
      /> */}
      <div className="p-4">
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">{changeDateFormat(post.createdAt)}</p>
          <div className="flex gap-2">
            {post.postCategories.map((c, index)=>{
              return(
                <span key={index} className="px-2 py-1 text-xs text-blue-600 border border-solid border-blue-600 rounded">
                  {c.category.name}
                </span>
              )
            })}
          </div>
        </div>
        <h2 className="text-2xl py-4">
          {post.title}
        </h2>
        <div>
          {parse(post.content)}
        </div>
      </div>
          
    </div>

  )
}

export default Detail;