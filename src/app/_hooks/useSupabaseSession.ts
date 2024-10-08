import { supabase } from "@/utils/supabase"
import { Session } from "@supabase/supabase-js"
import { useState, useEffect} from "react"
import { usePathname } from 'next/navigation'

const useSupabaseSession = () => {
  // undefined: ログイン状態ロード中, null: 未ログイン, Session:ログイン状態
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(()=> {
    const fetcher = async () => {
      const { data: { session },} = await supabase.auth.getSession()
      setSession(session)
      setToken(session?.access_token || null);
      setIsLoading(false)
    }
    fetcher();
  },[pathname])
  return { session, isLoading, token }
}

export default useSupabaseSession;
