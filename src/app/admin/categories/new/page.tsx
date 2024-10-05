"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RequestCategoryBody } from "@/app/_type/RequestCategoryBody";
import CategoryForm from "@/app/_components/CategoryForm";

const AddCategory: React.FC = () => {
  const { reset } = useForm<RequestCategoryBody>();
  const router = useRouter();

  const onsubmit: SubmitHandler<RequestCategoryBody> = async (data) => {
    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      })
      reset()
      router.push("/admin/categories")
    } catch(error) {
      console.log(error)
      alert('カテゴリー投稿に失敗しました');
    }
  }

  return(
    <CategoryForm
      onsubmit={onsubmit}
    />
  )
}

export default AddCategory;