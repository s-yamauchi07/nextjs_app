"use client"

import SideBar  from "../../../_components/SideBar";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type PostForm = {
  title: string
  content: string
  thumbnailUrl: string
  categories:  { id: number }[]
}

type Category = {
  id: string
  name: string
}

const NewPost: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { register,handleSubmit } = useForm<PostForm>();

  // カテゴリー一覧を取得する
  useEffect(()=> {
    const AllCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        const { categories } = await response.json();
        setCategories(categories)
      } catch(error) {
        console.log(error)
      }
    }
    AllCategories();
  },[]);

  // 記事の新規登録を実装
  const onsubmit: SubmitHandler<PostForm> = async (data) => {
    //選択したcategoryのデータを連想配列を使って新しく配列作成
    const selectedCategories = data.categories.map((id) => ({id}));

    const postData = {
      ...data,
      categories: selectedCategories,
    };
    console.log(postData)
    try{
      await fetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      })
    }catch (error) {
      console.log(error)
      alert('記事投稿に失敗しました');
    }
  }

  return(
    <div className="flex">
      <SideBar />
      <div className="p-10 w-full">
        <h2 className="text-xl font-bold mb-6">
          記事作成
        </h2>

        <form 
          onSubmit={handleSubmit(onsubmit)}
          className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="title"
              className="mb-2"
            >
              タイトル
            </label>
            <input type="text"
              id="title"
              className="border border-solid border-gray-200 rounded-lg p-2"
              {...register("title")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="content"
              className="mb-2"
            >
              内容
            </label>
            <textarea
              id="content"
              className="border border-solid border-gray-200 rounded-lg p-2"
              {...register("content")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="thumbnailUrl"
              className="mb-2"
            >
              サムネイルURL
            </label>
            <input type="text"
              id="thumbnailUrl"
              className="border border-solid border-gray-200 rounded-lg p-2"
              {...register("thumbnailUrl")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="categories"
              className="mb-2"
            >
              カテゴリー
            </label>
            <select
              multiple 
              id="categories"
              className="border border-solid border-gray-200 rounded-lg p-2"
              {...register("categories")}        
            >
              <option value=""></option>
              {categories && categories.map((category) => {
                return(
                  <option 
                    key={category.id}
                    value={category.id}
                   >
                    {category.name}
                  </option>
                )
              })}
            </select>  
          </div>

          <div>
            <button 
              type="submit"
              className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewPost;
