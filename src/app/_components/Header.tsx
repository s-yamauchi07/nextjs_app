"use client"

import Link from "next/link";
import useSupabaseSession from "../_hooks/useSupabaseSession"
import { supabase } from '@/utils/supabase'

const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  // useSupabaseSession HookからsessionとisLoadingを取得
  const { session, isLoading } = useSupabaseSession()
  
  return(
    <header className="bg-gray-800 p-6 flex justify-between text-white">
      <Link href="/" className="text-bold font-bold">
        Blog
      </Link>

      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <> 
              <Link href="/admin/posts" className="header-link">管理画面</Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact"  className="font-bold">お問い合わせ</Link>
              <Link href="/login" className="header-link">ログイン</Link>
            </>
          )
          }
        </div>
      )}
    </header>
  )
}

export default Header