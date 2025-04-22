// app/pages/analytics.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AdminMenu from "../components/AdminMenu"
import { navItems } from "../navItems"
import { usePathname } from "next/navigation"

export default function AnalyticsPage() {
  const pathname = usePathname()
  
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [totalPatients, setTotalPatients] = useState<number>(0)
  const [totalBillingRecords, setTotalBillingRecords] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      // Fetch total revenue (sum of all amounts)
      const { data: billingData, error: billingError } = await supabase
        .from("billing")
        .select("amount")

      if (billingError) throw new Error(billingError.message)

      // Calculate total revenue
      const revenue = billingData.reduce((acc: number, billing: { amount: number }) => acc + billing.amount, 0)
      setTotalRevenue(revenue)
      setTotalBillingRecords(billingData.length)

      // Fetch total number of unique patients
      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("id")

      if (patientsError) throw new Error(patientsError.message)

      setTotalPatients(patientsData.length)

    } catch (error: any) {
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-64 w-full md:relative">
        <AdminMenu navItems={navItems} currentPath={pathname} />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Analytics</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-3xl font-bold text-blue-600">Php {totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700">Total Patients</h2>
            <p className="text-3xl font-bold text-green-600">{totalPatients}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700">Total Billing Records</h2>
            <p className="text-3xl font-bold text-yellow-600">{totalBillingRecords}</p>
          </div>
        </div>

      </div>
    </div>
  )
}
