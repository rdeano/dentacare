"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { usePathname } from "next/navigation"
import AdminMenu from "../components/AdminMenu"
import { navItems } from "../navItems"
import { useRequireAdmin } from "@/hooks/useRequireAuth"

export default function PatientsPage() {
  useRequireAdmin()

  const pathname = usePathname()

  const [patients, setPatients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    phone: "",
    address: ""
  })
  const [editing, setEditing] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = async () => {
    const { data, error } = await supabase.from("patients").select("*")
    if (error) {
      setError(error.message)
    } else {
      setPatients(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      const { error } = await supabase
        .from("patients")
        .update(formData)
        .eq("id", editingPatientId)
      if (!error) {
        resetForm()
        fetchPatients()
      } else setError(error.message)
    } else {
      const { error } = await supabase.from("patients").insert([formData])
      if (!error) {
        resetForm()
        fetchPatients()
      } else setError(error.message)
    }
  }

  const handleEdit = (patient: any) => {
    setEditing(true)
    setEditingPatientId(patient.id)
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      dob: patient.dob,
      email: patient.email,
      phone: patient.phone,
      address: patient.address || ""
    })
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("patients").delete().eq("id", id)
    if (!error) fetchPatients()
    else setError(error.message)
  }

  const resetForm = () => {
    setEditing(false)
    setEditingPatientId(null)
    setFormData({
      first_name: "",
      last_name: "",
      dob: "",
      email: "",
      phone: "",
      address: ""
    })
    setError(null)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-64 w-full md:relative">
        <AdminMenu navItems={navItems} currentPath={pathname} />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Manage Patients</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <InputField label="First Name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                <InputField label="Last Name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                <InputField type="date" label="Date of Birth" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                <InputField type="email" label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <InputField label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <div className="col-span-1 sm:col-span-2">
                  <InputField label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
              <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                {editing ? "Update Patient" : "Add Patient"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-2 w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* Patients List Section */}
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">Patients List</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-base sm:text-lg font-bold">
                      {patient.first_name[0]}{patient.last_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">{patient.first_name} {patient.last_name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{patient.email} · {patient.phone}</p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">{patient.address}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(patient)} className="text-xs sm:text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md">Edit</button>
                    <button onClick={() => handleDelete(patient.id)} className="text-xs sm:text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, type = "text", value, onChange }: { label: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const id = label.toLowerCase().replace(" ", "_")
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        className="w-full p-2 sm:p-3 mt-1 border border-gray-300 rounded-lg"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  )
}
