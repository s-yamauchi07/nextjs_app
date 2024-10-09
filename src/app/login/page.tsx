"use client"

import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"

type User = {
  email: string
  password: string
}

const Login = () => {
 
  const { register, handleSubmit } = useForm<User>();
  const router = useRouter()

  const onsubmit: SubmitHandler<User> = async (data) => {
    const { email, password } = data
    const { error } = await supabase.auth.signInWithPassword( {email, password}, )

    if (error) {
      alert('ログインに失敗しました')
    } else {
      router.replace('/admin/posts')
    }
  }


  return(
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit(onsubmit)} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900" >
            メールアドレス
          </label>
          <input type="email" 
            id="email" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@company.com"
            {...register("email", {
              required: true
            })}
           /> 
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900" >
            パスワード
          </label>
          <input type="password" 
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("password", {
              required: true
            })}
          />
        </div>
        <div>
          <button type="submit" 
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}
export default Login;