import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import smknLogo from "../../assets/images/Logo-SMKN-7-Semarang.png";
import uksLogo from "../../assets/images/logo_uks-removebg-preview.png";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        kelas: kelas || null,
      });

      setSuccess(
        response.data.message ||
          "Akun berhasil dibuat. Silakan cek email untuk verifikasi."
      );

      // Kosongkan form
      setName("");
      setEmail("");
      setKelas("");
      setPassword("");

    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;

        const firstError = Object.values(errors)[0]?.[0];

        setError(firstError || "Data yang dimasukkan tidak valid.");
      } else {
        setError(
          err.response?.data?.message ||
            "Gagal membuat akun. Silakan coba lagi."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 lg:flex">

      {/* =========================
          BAGIAN KIRI
      ========================== */}
      <section className="relative hidden min-h-screen overflow-hidden bg-linear-to-br from-emerald-100 via-green-50 to-white lg:flex lg:w-[58%] lg:items-center lg:justify-center">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/40" />

        <div className="absolute -bottom-48 -right-32 h-125 w-125 rounded-full bg-green-200/40" />

        <div className="absolute left-20 top-1/4 h-4 w-4 rounded-full bg-emerald-400/40" />

        <div className="absolute right-32 top-1/3 h-6 w-6 rounded-full bg-green-400/30" />

        <div className="relative z-10 px-10 text-center">

          <div className="mx-auto mb-7 flex items-center justify-center gap-6">

            <img
              src={smknLogo}
              alt="Logo SMKN 7 Semarang"
              className="h-40 w-40 object-contain drop-shadow-sm"
            />

            <img
              src={uksLogo}
              alt="Logo UKS"
              className="h-40 w-40 object-contain drop-shadow-sm"
            />

          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-800">
            UKS STEMBASE
          </h1>

          <p className="mt-3 text-lg font-medium text-emerald-700">
            Unit Kesehatan Sekolah
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Sehat, Peduli, Berprestasi
          </p>

          <p className="mt-6 text-xs text-slate-400">
            Sistem Informasi UKS-STEMBASE
          </p>

        </div>
      </section>

      {/* =========================
          REGISTER
      ========================== */}
      <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-[42%]">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Buat Akun
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Daftar untuk menggunakan sistem UKS-STEMBASE
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-3 block font-bold text-emerald-700 hover:text-emerald-800"
              >
                Kembali ke Login →
              </button>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Nama */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama Lengkap
                </label>

                <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">

                  <User
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">

                  <Mail
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email"
                    required
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

              {/* Kelas */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Kelas
                  <span className="ml-1 font-normal text-slate-400">
                    (opsional)
                  </span>
                </label>

                <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">

                  <School
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    type="text"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: XI RPL 1"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">

                  <Lock
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    minLength={8}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="flex shrink-0 text-slate-400 transition hover:text-emerald-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Register */}
              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Membuat Akun..." : "Buat Akun"}
              </button>

            </form>
          )}

          {/* Login */}
          {!success && (
            <div className="mt-7 text-center text-sm text-slate-500">

              Sudah punya akun?

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="ml-1 font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Login
              </button>

            </div>
          )}

          {/* Footer */}
          <p className="mt-12 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} UKS-STEMBASE
          </p>

        </div>
      </section>
    </div>
  );
}