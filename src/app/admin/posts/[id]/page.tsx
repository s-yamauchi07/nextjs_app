"use client"

import PostForm from "../../../_components/PostForm";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation"
import { useTheme } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material/Select';

import { PostRequestCategoryBody } from "@/app/_type/PostRequestCategoryBody";
import { RequestPostBody } from "@/app/_type/RequestPostBody";
import { PostProps } from "@/app/_type/PostProps";

const EditPost: React.FC<PostProps> = ({params}) => {
  const { id } = params
  const router = useRouter();
  const theme = useTheme();
  const [post, setPost] = useState<RequestPostBody>();
  const [categories, setCategories] = useState<PostRequestCategoryBody[]>([]);
  const [categoryName, setCategoryName] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PostRequestCategoryBody[]>([]);
  const { register, handleSubmit } = useForm<RequestPostBody>();

  // 記事データを取得
  useEffect(()=> {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${id}`)
        const data = await response.json();
        setPost(data.post);

        // 全カテゴリーを取得する
        const Allcategories = await fetch("/api/admin/categories")
        const categoryData = await Allcategories.json();
        // const AllCategoryLists = categoryData.categories.map((c: any) => c.name);
        setCategories(categoryData.categories)

        // カテゴリーのオブジェクトを取得
        const categoryLists = data.post.postCategories.map((c: any) => c.category);

        // カテゴリ名のリストをカテゴリーの初期値に設定
        const categoryNames = categoryLists.map((c: PostRequestCategoryBody) => c.name);
        setCategoryName(categoryNames);

      } catch(error) {
        console.log(error)
      }
    }
    fetchPost();
  }, []);

  // カテゴリーの選択
  const handleChange = (e: SelectChangeEvent<typeof categoryName>) => {
    const { target: { value }} = e;
    
    const selectedCategoryNames = typeof value === "string" ? value.split(",") : value;
    setCategoryName(selectedCategoryNames);

    // 選択されたカテゴリー名に基づいてselectedCategoriesを更新
    const updatedSelectedCategories = categories.filter((category) => 
      selectedCategoryNames.includes(category.name)
    );

    setSelectedCategories(updatedSelectedCategories);
  };


  //記事更新
  const onsubmit: SubmitHandler<RequestPostBody> = async (data) => {
    const updateData = {
      ...data,
      categories: selectedCategories,
    };

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      })
      router.push("/admin/posts")
      alert('記事を更新しました');
    } catch(error) {
      console.log(error);
      alert('記事の更新に失敗しました');
    }
  }

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
      onsubmit={onsubmit}
      handleChange={handleChange}
      handleDelete={handleDelete}
      categories={categories}
      categoryName={categoryName}
      post={post}
      isEdit={true}
    />
  )
}

export default EditPost;