"use client"

import Image from "next/image";
import type { MicroCmsPost } from "../../_type/MicroCmsPost";
import { useEffect, useState } from "react";
import parse from 'html-react-parser';

type Props = {
  params: {
    id: string;
  };
}

const Detail: React.FC<Props> = ({params}) => {
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    const findPost = async() => {
      try {
        const response = await fetch(`https://g0x5w95t7h.microcms.io/api/v1/posts/${params.id}`, {
          headers: {
            'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        });
        const data = await response.json();
        setPost(data);
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
      <Image 
        src={post.thumbnail.url}
        height={400}
        width={800}
        alt={post.title}
      />
      <div className="p-4">
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">{changeDateFormat(post.createdAt)}</p>
          <div className="flex gap-2">
            {post.categories.map((category, index)=>{
              return(
                <span key={index} className="px-2 py-1 text-xs text-blue-600 border border-solid border-blue-600 rounded">
                  {category.name}
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