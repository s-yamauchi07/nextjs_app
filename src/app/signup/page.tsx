"use client"

import { supabase } from "@/utils/supabase"
import { useForm, SubmitHandler } from "react-hook-form"

type User = {
  email: string
  password: string
}

const SignUp = () => {
  const { register, handleSubmit, reset } = useForm<User>({
    defaultValues: {
      email: "name@company.com",
      password: "••••••••"
    }
  });

  const onsubmit: SubmitHandler<User> = async(data) => {
    const { email, password } = data
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `http://localhost:3000/login`,}, })

    if (error) {
      alert('登録に失敗しました')
    } else {
      reset()
      alert('確認メールを送信しました')
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("password", {
              required: true
            })}
           />
        </div>
        <div>
          <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >
            登録
          </button>
        </div>
      </form>
    </div> 
  )
}

export default SignUp;
