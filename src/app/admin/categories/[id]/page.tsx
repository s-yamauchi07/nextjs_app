"use client"

import SideBar from "@/app/_components/SideBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {
  params: {
    id: string
  }
}

type Category = {
  id: string
  name: string
}


const EditCategories: React.FC<Props> = ({params}) => {
  const { id } = params
  const router = useRouter();
  const [category, setCategory] = useState<Category>();
  const { register, handleSubmit, setValue } = useForm<Category>();
  
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
  
  const onsubmit: SubmitHandler<Category> = async(data) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data), 
      })
      const updateCategory = await response.json();
      setValue("name", updateCategory.category.name);
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
      console.log(status)
      if(status == "OK") {
        router.push("/admin/categories");
      }
    } catch(error) {
      console.log(error)
    }
  }

  if(!category) return <div>読み込み中...</div>

  return(
    <div className="flex">
      <SideBar />
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
    </div>
  )
}

export default EditCategories;