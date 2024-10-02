"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RequestCategoryBody } from "@/app/_type/RequestCategoryBody";

const AddCategory: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<RequestCategoryBody>();
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
    <div className="p-10 w-full">
      <h2 className="text-xl font-bold mb-6">
        カテゴリー作成
      </h2>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-4"
      >
        <label htmlFor="name">カテゴリー</label>
        <input type="type"
          id="name"
          className="border border-solid border-gray-200 rounded-lg p-2"
          {...register("name")}
        />
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
  )
}

export default AddCategory;