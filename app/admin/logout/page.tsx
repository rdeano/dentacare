"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      router.replace('/admin/login')
    }

    logout()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Logging you out...</p>
    </div>
  )
}
