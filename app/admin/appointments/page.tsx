"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { usePathname, useRouter } from "next/navigation"
import AdminMenu from "../components/AdminMenu"
import { navItems } from "../navItems"
import { useRequireAdmin } from "@/hooks/useRequireAuth"

export default function AppointmentsPage() {
  useRequireAdmin();

  const pathname = usePathname()
  const router = useRouter()

  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([]) // Fetch list of patients
  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_date: "",
    reason: "",
    status: "scheduled"
  })
  const [editing, setEditing] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch appointments
  const fetchAppointments = async () => {
    const { data, error } = await supabase.from("appointments").select("*").order("appointment_date", { ascending: true })
    if (error) {
      setError(error.message)
    } else {
      setAppointments(data)
    }
  }

  // Fetch patients for dropdown
  const fetchPatients = async () => {
    const { data, error } = await supabase.from("patients").select("*")
    if (error) {
      setError(error.message)
    } else {
      setPatients(data)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      const { error } = await supabase
        .from("appointments")
        .update(formData)
        .eq("id", editingAppointmentId)
      if (!error) {
        resetForm()
        fetchAppointments()
      } else setError(error.message)
    } else {
      const { error } = await supabase.from("appointments").insert([formData])
      if (!error) {
        resetForm()
        fetchAppointments()
      } else setError(error.message)
    }
  }

  // Handle editing an appointment
  const handleEdit = (appointment: any) => {
    setEditing(true)
    setEditingAppointmentId(appointment.id)
    setFormData({
      patient_id: appointment.patient_id,
      appointment_date: appointment.appointment_date,
      reason: appointment.reason,
      status: appointment.status
    })
  }

  // Handle deleting an appointment
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id)
    if (!error) fetchAppointments()
    else setError(error.message)
  }

  // Reset form
  const resetForm = () => {
    setEditing(false)
    setEditingAppointmentId(null)
    setFormData({
      patient_id: "",
      appointment_date: "",
      reason: "",
      status: "scheduled"
    })
    setError(null)
  }

  // Helper function to get patient name by patient_id
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown"
  }
  const getPatientAddress = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient ? `${patient.address}` : "Unknown"
  }

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchAppointments()
    fetchPatients()
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-64 w-full md:relative">
        <AdminMenu navItems={navItems} currentPath={pathname} />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Manage Appointments</h1>

        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="patient_id" className="block text-sm font-semibold text-gray-700">Patient</label>
              <select
                id="patient_id"
                name="patient_id"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                required
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Appointment Date"
              type="datetime-local"
              value={formData.appointment_date}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
            />
            <InputField
              label="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

          </div>
          <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            {editing ? "Update Appointment" : "Add Appointment"}
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

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Appointments List</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold text-gray-800">Patient : {getPatientName(appointment.patient_id)}</p>
                    <p className="font-semibold text-gray-800">Address : {getPatientAddress(appointment.patient_id)}</p>
                    <p className="text-sm text-gray-500">Reason : {appointment.reason} </p>
                    <p className="text-sm text-gray-500">Status : {appointment.status}</p>
                    <p className="text-sm text-gray-500">{new Date(appointment.appointment_date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(appointment)} className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md">Edit</button>
                  <button onClick={() => handleDelete(appointment.id)} className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md">Delete</button>
                </div>
              </div>
            ))}
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
        className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  )
}
