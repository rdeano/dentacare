"use client"

import { useRequireAdmin } from "@/hooks/useRequireAuth"
import { useEffect } from "react"

export default function AdminHomePage() {

  useRequireAdmin()

  return (
    <>
      <p>Admin Home Page</p>
    </>
  )
}