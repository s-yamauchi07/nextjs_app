"use client"

import PostForm from "../../../_components/PostForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { RequestPostBody } from "@/app/_type/RequestPostBody";
import { PostProps } from "@/app/_type/PostProps";

type apiResponse = {
  status: string
  post: RequestPostBody
}

const EditPost: React.FC<PostProps> = ({params}) => {
  const { id } = params
  const router = useRouter();
  const [post, setPost] = useState<RequestPostBody>();

  // 記事データを取得
  useEffect(()=> {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${id}`)
        const data: apiResponse = await response.json();
        setPost(data.post)
      } catch(error) {
        console.log(error)
      }
    }
    fetchPost();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        body: JSON.stringify(id)
      })
      const { status } = await response.json();
      if(status == "OK") {
        router.push("/admin/posts");
      }
    } catch(error) {
      console.log(error)
    }
  }

  if(!post) return <div>読み込み中...</div>

  return(
    <PostForm 
      handleDelete={handleDelete}
      post={post}
      isEdit={true}
    />
  )
}

export default EditPost;