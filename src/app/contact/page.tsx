"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

type FormValue = {
  name: string,
  email: string,
  message: string
}

const Contact: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValue>();
  const onsubmit: SubmitHandler<FormValue> = async(data) => {
    try {
      await axios.post("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", data);
      reset();
      alert('送信しました');
    }catch(error){
      console.log(error);
      alert('送信に失敗しました');
    }
  };

  return(
    <div className="pt-10 m-auto max-w-3xl">
      <h2 className="text-xl font-bold mb-10">
        問い合わせフォーム
      </h2>
      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-6"noValidate>
        <div className="flex items-center">
          <label htmlFor="name" className="w-60">お名前</label>
          <div className='w-full flex flex-col'>
            <input type="text" 
              id="name" 
              className="border border-solid border-gray-300 rounded-lg p-4"
              disabled={isSubmitting}
              {...register('name', {
                required: 'お名前は必須です。',
                maxLength: {
                  value: 30,
                  message: "お名前は30文字以内で入力してください",
                },
              })}
            />
            <p className="text-sm text-red-700">{errors.name?.message}</p>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="email" className="w-60">メールアドレス</label>
          <div className="w-full flex flex-col">
            <input type="text"
              id="email"
              className="border border-solid border-gray-300 rounded-lg p-4"
              disabled={isSubmitting}
              {...register('email', {
                required: 'メールアドレスは必須です。',
                pattern: {
                  value: /[a-z\d+\-.]+@([a-z\d-]+(?:\.[a-z]+)*)/i,
                  message: 'メールアドレスの形式で入力してください。'
                }
              })}
            />
            <p className="text-sm text-red-700">{errors.email?.message}</p>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="message" className="w-60">本文</label>
          <div className="w-full flex flex-col">
            <textarea id="message"
              className="h-60 border border-solid border-gray-300 rounded-lg p-4"
              disabled={isSubmitting}
              {...register('message', {
                required: '本文は必須です。',
                maxLength: {
                  value: 500,
                  message: '本文は500文字以内で入力してください。'
                }
              })}
            />
            <p className="text-sm text-red-700">{errors.message?.message}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button type="submit"
            className="bg-gray-800 text-white font-bold rounded-lg px-4 py-2"
            disabled={isSubmitting}
          >
            送信
          </button>
          <button type="button"
            onClick={() => reset()}
            className="bg-gray-300 text-white font-bold rounded-lg px-4 py-2"
            disabled={isSubmitting}
          >
            クリア
          </button>
        </div>
      </form>
    </div>
  )
}

export default Contact;