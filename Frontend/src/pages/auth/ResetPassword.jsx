import { useState } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/reset-password", {
        token,
        email: searchParams.get("email"),
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/login", {
        replace: true,
        state: { message: response.data.message },
      });
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors;
      setError(
        validationErrors
          ? Object.values(validationErrors)[0]?.[0]
          : requestError.response?.data?.message ||
              "Password belum dapat diatur ulang. Silakan minta tautan baru.",
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
          <LockKeyhole size={23} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-800">
          Buat password baru
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Gunakan password minimal 8 karakter dan konfirmasikan kembali.
        </p>

        {error && (
          <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={resetPassword} className="mt-6 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">
            Password baru
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Konfirmasi password baru
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Atur ulang password"}
          </button>
        </form>
      </section>
    </main>
  );
}
