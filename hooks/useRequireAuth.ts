// hooks/useRequireAuth.ts
"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const useRequireAdmin = () => {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Not logged in → redirect to login
        return router.replace('/admin/login')
      }


      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role === 'admin') {
        // Logged in as admin → redirect to dashboard
        // router.replace('/admin')
      } else {
        // Logged in but not admin → redirect to login
        router.replace('/admin/login')
      }
    }

    checkSession()
  }, [router])
}
