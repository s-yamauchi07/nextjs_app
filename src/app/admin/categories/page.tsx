"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { RequestCategoryBody } from "../../_type/RequestCategoryBody";
import useSupabaseSession from "@/app/_hooks/useSupabaseSession";

const AllCategories: React.FC = () => {
  const [categories, setCategories] = useState<RequestCategoryBody[]>([]);
  const { token } = useSupabaseSession()

  useEffect(() => {
    if (!token) return
    const AllCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        const { categories } = await response.json();
        setCategories(categories)
      } catch(error) {
        console.log(error)
      }
    }
    AllCategories();
  }, [token]);

  return(
    <div className="p-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          カテゴリー一覧
        </h2>
        <div>
          <button type="button"
            className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2"
          >
            <Link href="/admin/categories/new">新規作成</Link>
          </button>
        </div>
      </div>

      <div className="p-4">
        <ul>
          {categories.map((category) => {
            return(
              <li 
                key={category.id}
                className="font-bold text-lg py-2 border-b-2"
              >
              <Link href={`/admin/categories/${category.id}`}>
                {category.name}
              </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
export default AllCategories;