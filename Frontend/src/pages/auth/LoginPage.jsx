import { useState } from 'react'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('login attempt', form)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#E8F8F1]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.18),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(6,95,70,0.15),rgba(220,252,231,0.35))]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-6 rounded-[32px] border border-white/40 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:grid-cols-[1.3fr_1fr] md:p-10">
          <div className="hidden flex-col justify-center rounded-[28px] bg-[radial-gradient(circle_at_left,_rgba(16,185,129,0.32),transparent_55%)] p-8 text-slate-900 shadow-inner md:flex">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-green-700">UKS STEMBASE</span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Sistem Login Sekolah
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-700/90">
              Masuk untuk mengelola kunjungan & catatan kesehatan siswa. Tampilan awal ini dibuat untuk meniru gaya hijau lembut dan panel login modern.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Login</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Masuk</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.18em] text-slate-500">
                  <span>Username</span>
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Jiarra Martins"
                  className="mt-3 block w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.18em] text-slate-500">
                  <span>Email</span>
                </span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="hello@reallygreatsite.com"
                  className="mt-3 block w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.18em] text-slate-500">
                  <span>Password</span>
                </span>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="password123"
                  className="mt-3 block w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Sudah punya akun? Masuk</span>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800"
              >
                <span className="mr-2">↗</span>
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
