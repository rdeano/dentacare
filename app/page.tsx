
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <header className="flex justify-between items-center p-6 shadow">
        <h1 className="text-2xl font-bold">DentaCare</h1>
      </header>

      <section className="text-center mt-20 px-6">
        <h2 className="text-4xl font-bold mb-4">Welcome to DentaCare</h2>
        <p className="text-lg mb-8">Your All-in-One Dental Clinic Management System</p>
        <a href="/admin/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Login to Dashboard
        </a>
      </section>

      <section className="mt-20 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {[
          { title: "Patient Records", icon: "🦷", desc: "View and update patient histories easily." },
          { title: "Appointments", icon: "📅", desc: "Schedule and manage visits smoothly." },
          { title: "Billing", icon: "💳", desc: "Automate invoices and payments." },
          { title: "Analytics", icon: "📈", desc: "Track performance and trends." },
        ].map((f, i) => (
          <div key={i} className="border rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="text-center text-sm text-gray-500 mt-20 mb-6">
        © {new Date().getFullYear()} DentaCare. All rights reserved.
      </footer>
    </main>
  );
}
