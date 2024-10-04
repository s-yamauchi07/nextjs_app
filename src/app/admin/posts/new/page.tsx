"use client"

import PostForm from "../../../_components/PostForm";
import { useState, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation"
import { SelectChangeEvent } from '@mui/material/Select';
import { RequestCategoryBody } from "@/app/_type/RequestCategoryBody";
import { RequestPostBody } from "@/app/_type/RequestPostBody";


const NewPost: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<RequestCategoryBody[]>([]);
  const [categoryName, setCategoryName] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<RequestCategoryBody[]>([]);

  const handleChange = (e: SelectChangeEvent<typeof categoryName>) => {
    const { target: { value },} = e;
    const selectedCategoryNames = typeof value === "string" ? value.split(",") : value;
    setCategoryName(selectedCategoryNames);

    // 選択されたカテゴリー名に基づいて、selectedCategoriesを更新
    const updatedSelectedCategories = categories.filter((category) => 
      selectedCategoryNames.includes(category.name)
    );
    setSelectedCategories(updatedSelectedCategories);
  };

  // カテゴリー一覧を取得する
  useEffect(()=> {
    const allCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        const { categories } = await response.json();
        setCategories(categories)

      } catch(error) {
        console.log(error)
      }
    }
    allCategories();
  },[]);

  // 記事の新規登録を実装
  const onsubmit: SubmitHandler<RequestPostBody> = async (data) => {
    const postData = {
      ...data,
      categories: selectedCategories
    };
    
    try{
      await fetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      })
      router.push("/admin/posts");
      alert("記事を投稿しました")
    } catch (error) {
      console.log(error)
      alert('記事投稿に失敗しました');
    }
  }

  return(
    <PostForm 
      categoryName={categoryName}
      categories={categories}
      handleChange={handleChange}
      onsubmit={onsubmit}
    />
  )
}

export default NewPost;
