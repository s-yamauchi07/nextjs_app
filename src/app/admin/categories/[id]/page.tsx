"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form";
import { PostRequestCategoryBody } from "../../../_type/PostRequestCategoryBody";
import { PostProps } from "@/app/_type/PostProps";
import CategoryForm from "@/app/_components/CategoryForm";

const EditCategories: React.FC<PostProps> = ({params}) => {
  const { id } = params
  const router = useRouter();
  const [category, setCategory] = useState<PostRequestCategoryBody>();
  const { setValue } = useForm<PostRequestCategoryBody>();
  
  useEffect(() => {
    const findCategory = async () => {
      try{
        const response = await fetch(`/api/admin/categories/${id}`)
        const data = await response.json();
        setCategory(data.category)

        setValue("name", data.category.name);
      } catch(error) {
        console.log(error)
      }
    }
    findCategory();
  }, []);
  
  const onsubmit: SubmitHandler<PostRequestCategoryBody> = async(data) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
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
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
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