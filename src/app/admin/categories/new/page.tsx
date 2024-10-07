"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RequestCategoryBody } from "@/app/_type/RequestCategoryBody";
import CategoryForm from "@/app/_components/CategoryForm";
import useSupabaseSession from "@/app/_hooks/useSupabaseSession";

const AddCategory: React.FC = () => {
  const { reset } = useForm<RequestCategoryBody>();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const onsubmit: SubmitHandler<RequestCategoryBody> = async (data) => {
    if (!token) return

    try {
      await fetch("/api/admin/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
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