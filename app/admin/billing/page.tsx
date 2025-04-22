"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { usePathname, useRouter } from "next/navigation"
import AdminMenu from "../components/AdminMenu"
import { navItems } from "../navItems"
import { useRequireAdmin } from "@/hooks/useRequireAuth"

export default function BillingPage() {
  useRequireAdmin()

  const pathname = usePathname()
  const router = useRouter()

  const [billingRecords, setBillingRecords] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([]) // New state for patients
  const [formData, setFormData] = useState({
    patient_id: "",
    amount: "",
    status: "pending",
    due_date: "",
    payment_date: "",
    description: "", // New field for description
  })
  const [editing, setEditing] = useState(false)
  const [editingBillingId, setEditingBillingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch billing records and patients
  const fetchBillingRecords = async () => {
    const { data, error } = await supabase.from("billing").select("*")
    if (error) {
      setError(error.message)
    } else {
      setBillingRecords(data)
    }
  }

  const fetchPatients = async () => {
    const { data, error } = await supabase.from("patients").select("id, first_name, last_name")
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
        .from("billing")
        .update(formData)
        .eq("id", editingBillingId)
      if (!error) {
        resetForm()
        fetchBillingRecords()
      } else setError(error.message)
    } else {
      const { error } = await supabase.from("billing").insert([formData])
      if (!error) {
        resetForm()
        fetchBillingRecords()
      } else setError(error.message)
    }
  }

  const handleEdit = (billing: any) => {
    setEditing(true)
    setEditingBillingId(billing.id)
    setFormData({
      patient_id: billing.patient_id,
      amount: billing.amount,
      status: billing.status,
      due_date: billing.due_date,
      payment_date: billing.payment_date || "",
      description: billing.description || "", // Set description if available
    })
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("billing").delete().eq("id", id)
    if (!error) fetchBillingRecords()
    else setError(error.message)
  }

  const resetForm = () => {
    setEditing(false)
    setEditingBillingId(null)
    setFormData({
      patient_id: "",
      amount: "",
      status: "pending",
      due_date: "",
      payment_date: "",
      description: "", // Reset description
    })
    setError(null)
  }

  useEffect(() => {
    fetchBillingRecords()
    fetchPatients() // Fetch patients along with billing records
  }, [])

  // Helper function to get patient name by patient_id
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown"
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-64 w-full md:relative">
        <AdminMenu navItems={navItems} currentPath={pathname} />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Manage Billing</h1>

        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Patient"
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
              type="select"
              options={patients.map((patient) => ({
                value: patient.id,
                label: `${patient.first_name} ${patient.last_name}`,
              }))}
            />
            <InputField
              label="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              type="number"
            />
            <InputField
              label="Due Date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              type="date"
            />
            <InputField
              label="Payment Date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              type="date"
            />
            <InputField
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              type="select"
              options={[
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
                { value: "canceled", label: "Canceled" },
              ]}
            />
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                rows={4}
              />
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            {editing ? "Update Billing" : "Add Billing"}
          </button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Billing Records</h2>
          <div className="space-y-4">
            {billingRecords.map((billing) => (
              <div
                key={billing.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="font-semibold text-gray-800">
                    {getPatientName(billing.patient_id)} {/* Display patient name */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount: Php {billing.amount}</p>
                    <p className="text-sm text-gray-500">Status: {billing.status}</p>
                    <p className="text-sm text-gray-500">Due Date: {billing.due_date}</p>
                    {billing.payment_date && (
                      <p className="text-sm text-gray-500">Payment Date: {billing.payment_date}</p>
                    )}
                    {billing.description && (
                      <p className="text-sm text-gray-500 mt-2 italic">Description: {billing.description}</p>
                    )}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(billing)}
                    className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(billing.id)}
                    className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  options,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  options?: { value: string; label: string }[] // for select input
}) {
  const id = label.toLowerCase().replace(" ", "_")
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">{label}</label>
      {type === "select" ? (
        <select
          id={id}
          name={id}
          className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
          value={value}
          onChange={onChange as any}
          required
        >
          <option value=""></option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
          value={value}
          onChange={onChange}
          required
        />
      )}
    </div>
  )
}
