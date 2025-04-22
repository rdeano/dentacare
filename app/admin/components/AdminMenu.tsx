"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react" // icons (install lucide-react if needed)

export default function AdminMenu({ navItems, currentPath }: { navItems: any[], currentPath: string }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gray-800 text-white md:h-full md:sticky md:top-0">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Admin Menu</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className={`${open ? "block" : "hidden"} md:block p-4 space-y-2`}>
        {navItems.map((item,index) => (
          <Link
            key={index}
            href={item.href}
            className={`block py-2 px-3 rounded-lg hover:bg-gray-700 ${
              currentPath === item.href ? "bg-gray-700" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
