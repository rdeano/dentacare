"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const waitForSession = async () => {
    for (let i = 0; i < 10; i++) {
      const { data: { session } } = await supabase.auth.getSession();
      console.log(session, 'session');
      if (session) {
        // Force set the session in the cookie (ensures the server sees it)
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        
        alert("Session set, redirecting...");
        // Force a full page reload with window.location.href to trigger middleware
        window.location.href = '/admin/dashboard';
        return;
      }
  
      // Wait 300ms before retrying
      await new Promise((r) => setTimeout(r, 300));
    }
  
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Reset error message on submit

    // Sign in using Supabase authentication
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // Handle authentication failure
      setError('Invalid credentials, please try again.')
      return
    }

    if (data.user) {
      // Check if the email is confirmed
      if (!data.user.email_confirmed_at) {
        setError('Please verify your email to complete the login process.')
        return
      }

      // Optionally, you can check if the user has the "admin" role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        setError('Error fetching user profile.')
        return
      }

      // Check if the user has an admin role
      if (profileData?.role === 'admin') {
        // alert("went here?")
        // router.push('/admin/dashboard') // Redirect to admin dashboard
        waitForSession();
        // const loggedIn = await waitForSession()

        // if (loggedIn) {
        //   router.push('/admin/dashboard')
        // } else {
        //   setError('Login successful, but session not ready. Try refreshing.')
        // }
      } else {
        setError('You do not have admin access.')
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 mb-4">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
