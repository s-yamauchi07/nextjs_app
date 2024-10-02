"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form";
import { PostRequestCategoryBody } from "../../../_type/PostRequestCategoryBody";
import { PostProps } from "@/app/_type/PostProps";

const EditCategories: React.FC<PostProps> = ({params}) => {
  const { id } = params
  const router = useRouter();
  const [category, setCategory] = useState<PostRequestCategoryBody>();
  const { register, handleSubmit, setValue } = useForm<PostRequestCategoryBody>();
  
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
    <div className="p-10 w-full">
      <h2 className="text-xl font-bold mb-6">
        カテゴリー編集
      </h2>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-4"
      >
        <label htmlFor="name">カテゴリー名</label>
        <input type="text"
          id="name"
          className="border border-solid border-gray-200 rounded-lg p-2"
          {...register("name")}
        />
        <div className="flex gap-2">
          <button 
            type="submit"
            className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
          >
            更新
          </button>
          <button 
            type="button"
            className="bg-red-600 text-white font-bold rounded-lg px-4 py-2"
            onClick={() => handleDelete()}
          >
            削除
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCategories;