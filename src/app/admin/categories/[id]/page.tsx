"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form";
import { RequestCategoryBody } from "../../../_type/RequestCategoryBody";
import { PostProps } from "@/app/_type/PostProps";
import CategoryForm from "@/app/_components/CategoryForm";
import useSupabaseSession from "@/app/_hooks/useSupabaseSession";

const EditCategories: React.FC<PostProps> = ({params}) => {
  const { id } = params
  const router = useRouter();
  const [category, setCategory] = useState<RequestCategoryBody>();
  const { setValue } = useForm<RequestCategoryBody>();
  const { token } = useSupabaseSession();
  
  useEffect(() => {
    if (!token) return

    const findCategory = async () => {
      try{
        const response = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        const data = await response.json();
        setCategory(data.category)

        setValue("name", data.category.name);
      } catch(error) {
        console.log(error)
      }
    }
    findCategory();
  }, [token]);
  
  const onsubmit: SubmitHandler<RequestCategoryBody> = async(data) => {
    if (!token) return 

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        method: "PUT",
        body: JSON.stringify(data), 
      })
      const updateCategory = await response.json();

      setValue("name", updateCategory.category.name);
      router.push("/admin/categories")
      alert("カテゴリーを更新しました")
    }catch(error){
      console.log(error)
    }
  }

  const handleDelete = async() => {
    if (!token) return
    
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        method: "DELETE",
        body: JSON.stringify(id)
      })
      const { status } = await response.json();
      alert("カテゴリーを削除しました")
      if(status == "OK") {
        router.push("/admin/categories");
      }
    } catch(error) {
      console.log(error)
    }
  }

  if(!category) return <div>読み込み中...</div>

  return(
    <CategoryForm
      onsubmit={onsubmit}
      handleDelete={handleDelete}
      isEdit={true}
      category={category}
    />
  )
}

export default EditCategories;