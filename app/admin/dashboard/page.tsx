"use client"

import { useRequireAdmin } from '@/hooks/useRequireAuth'
import Link from 'next/link'
import { FaUserInjured, FaCalendarAlt, FaFileInvoiceDollar, FaChartBar } from 'react-icons/fa'
import AdminMenu from '../components/AdminMenu'
import { navItems } from '../navItems'
import { usePathname } from 'next/navigation'

export default function AdminDashboardPage() {
  useRequireAdmin()
  const pathname = usePathname()

  const dashboardSections = [
    {
      title: 'Patient Records',
      description: 'Manage patient profiles, medical records, and history.',
      href: '/admin/patients',
      icon: <FaUserInjured className="text-blue-500 text-4xl" />,
    },
    {
      title: 'Appointments',
      description: 'Schedule, view, and update appointments.',
      href: '/admin/appointments',
      icon: <FaCalendarAlt className="text-green-500 text-4xl" />,
    },
    {
      title: 'Billing',
      description: 'Handle invoices, payments, and financial reports.',
      href: '/admin/billing',
      icon: <FaFileInvoiceDollar className="text-yellow-500 text-4xl" />,
    },
    {
      title: 'Analytics',
      description: 'Visualize data trends and monitor performance.',
      href: '/admin/analytics',
      icon: <FaChartBar className="text-purple-500 text-4xl" />,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-64 w-full md:relative">
        <AdminMenu navItems={navItems} currentPath={pathname} />
      </div>

       
      <main className="flex-1 min-h-screen p-8 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center">Admin Dashboard</h1>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {dashboardSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{section.title}</h2>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
