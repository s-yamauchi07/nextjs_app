import useSupabaseSession from '@/app/_hooks/useSupabaseSession'
import { useRouter } from "next/navigation"
import { useEffect } from 'react'

const useRouteGuard = () => {
  const router = useRouter();
  const { session } = useSupabaseSession();

  useEffect(()=> {
    if (session === undefined) return
    const fetcher = async () => {
      if (session === null) {
        router.replace('/login')
      }
    }
    fetcher()
  }, [router, session])
}

export default useRouteGuard;