import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestResetLink = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/forgot-password", { email });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Email reset belum dapat dikirim. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-5 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-9">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Kembali ke login
        </Link>
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Mail size={23} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-800">
          Lupa password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat
          password baru.
        </p>

        {message && (
          <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={requestResetLink} className="mt-6 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Email akun
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="nama@email.com"
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim tautan reset"}
          </button>
        </form>
      </section>
    </main>
  );
}
