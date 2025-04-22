"use client";

import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
  
    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
  
    // If there's an error during sign up, show the error
    if (signUpError) {
      setError(signUpError.message)
      return
    }
  
    // Get the user ID from the data
    const userId = data.user?.id
    if (userId) {
      // Directly insert the user profile with the role 'admin' into the profiles table
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, role: 'admin' }])
  
      // If there's an error during the insertion, show the error
      if (insertError) {
        setError('User created, but failed to set admin role.')
        return
      }
  
      // After successful user creation and role assignment, redirect to login page
      router.push('/admin/login')
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Admin Registration</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register as Admin
        </button>
      </form>
    </div>
  )
}
