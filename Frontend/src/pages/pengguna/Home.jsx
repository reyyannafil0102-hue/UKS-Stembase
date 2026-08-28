import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  LogOut,
  HeartPulse,
  ClipboardCheck,
  Pill,
  Lightbulb,
  CalendarDays,
  Home as HomeIcon,
  PackageSearch,
} from "lucide-react";

import schoolImage from "../../assets/images/Logo-SMKN-7-Semarang.png";
import MobileMenu from "../../components/MobileMenu";

export default function Home() {
  const navigate = useNavigate();

  // =========================
  // DATA USER
  // =========================
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Data user tidak valid:", error);
      return null;
    }
  });

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

        {/* =========================
            LOGO SIDEBAR
        ========================== */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <HeartPulse
              size={27}
              className="text-emerald-600"
            />
          </div>

          <div>
            <h1 className="text-base font-extrabold text-emerald-700">
              UKS STEMBASE
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Sehat, Peduli, Berprestasi
            </p>
          </div>

        </div>

        {/* =========================
            MENU
        ========================== */}
        <nav className="px-4 py-6">

          {/* Dashboard */}
          <button
            type="button"
            onClick={() => navigate("/Dashboard")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
          >
            <HomeIcon size={18} />
            Dashboard
          </button>

          {/* Absensi */}
          <button
            type="button"
            onClick={() => navigate("/absensi-uks")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
          >
            <ClipboardCheck size={18} />
            Absensi UKS
          </button>

          {/* Stok Obat */}
          <button
            type="button"
            onClick={() => navigate("/stok-obat")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
          >
            <Pill size={18} />
            Stok Obat
          </button>

          {/* Inventaris */}
          <button
            type="button"
            onClick={() => navigate("/inventaris")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
          >
            <PackageSearch size={18} />
            Inventaris
          </button>

          {/* Tips Kesehatan */}
          <button
            type="button"
            onClick={() => navigate("/tips-kesehatan")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
          >
            <Lightbulb size={18} />
            Tips Kesehatan
          </button>

          {/* Event */}
          <button
            type="button"
            onClick={() => navigate("/event-uks")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
          >
            <CalendarDays size={18} />
            Event UKS
          </button>

          {/* Profil */}
          <button
            type="button"
            onClick={() => navigate("/profil")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
          >
            <User size={18} />
            Profil Saya
          </button>

        </nav>

        {/* =========================
            LOGOUT
        ========================== */}
        <div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>
      <MobileMenu currentPath="/Dashboard" onLogout={handleLogout} />


      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="min-h-screen lg:ml-64">

        {/* =================================================
            HEADER
        ================================================== */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">

          {/* Judul */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Sistem Informasi UKS Stembase SMKN 7 Semarang
            </p>
          </div>

          {/* Bagian kanan */}
          <div className="flex items-center gap-5">

            {/* Notifikasi */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
            >
              <Bell size={21} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3">

              {/* Foto */}
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-100">

                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User
                    size={21}
                    className="text-emerald-600"
                  />
                )}

              </div>

              {/* Nama */}
              <div className="hidden sm:block">

                <p className="text-sm font-bold text-slate-700">
                  Hai, {user?.name || "Pengguna"}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Siswa
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================== */}
        <div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">

          {/* =================================================
              BANNER
          ================================================== */}
          <div className="relative h-64 overflow-hidden rounded-2xl shadow-md sm:h-72 lg:h-80">

            <img
              src={schoolImage}
              alt="Background UKS STEMBASE"
              className="h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Gradient tambahan */}
            <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent" />

            {/* Text Banner */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white sm:left-12 lg:left-14">

              <p className="text-sm font-semibold uppercase tracking-widest text-white/85">
                Selamat Datang
              </p>

              <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                UKS STEMBASE
              </h1>

              <p className="mt-3 text-base font-medium text-white/90 sm:text-lg">
                Sehat, Peduli, Berprestasi
              </p>

            </div>

          </div>


          {/* =================================================
              MENU UTAMA
          ================================================== */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            {/* =========================
                ABSENSI
            ========================== */}
            <div className="group flex min-h-70 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                <ClipboardCheck
                  size={31}
                  className="text-emerald-600"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Absensi Kunjungan
              </h3>

              <p className="mt-2 max-w-57.5 text-sm leading-6 text-slate-400">
                Isi form jika ingin berkunjung ke UKS.
              </p>

              <button
                type="button"
                onClick={() => navigate("/absensi-uks")}
                className="mt-6 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Isi Absensi
              </button>

            </div>


            {/* =========================
                STOK OBAT
            ========================== */}
            <div className="group flex min-h-70 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <Pill
                  size={31}
                  className="text-blue-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Stok Obat
              </h3>

              <p className="mt-2 max-w-57.5 text-sm leading-6 text-slate-400">
                Lihat stok obat yang tersedia di UKS.
              </p>

              <button
                type="button"
                onClick={() => navigate("/stok-obat")}
                className="mt-6 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Lihat Obat
              </button>

            </div>


            {/* =========================
                TIPS KESEHATAN
            ========================== */}
            <div className="group flex min-h-70 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                <Lightbulb
                  size={31}
                  className="text-orange-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Tips Kesehatan
              </h3>

              <p className="mt-2 max-w-57.5 text-sm leading-6 text-slate-400">
                Informasi kesehatan dan gaya hidup sehat.
              </p>

              <button
                type="button"
                onClick={() => navigate("/tips-kesehatan")}
                className="mt-6 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Lihat Tips
              </button>

            </div>


            {/* =========================
                EVENT
            ========================== */}
            <div className="group flex min-h-70 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
                <CalendarDays
                  size={31}
                  className="text-purple-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Event UKS
              </h3>

              <p className="mt-2 max-w-57.5 text-sm leading-6 text-slate-400">
                Informasi kegiatan terbaru UKS sekolah.
              </p>

              <button
                type="button"
                onClick={() => navigate("/event-uks")}
                className="mt-6 rounded-lg bg-purple-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
              >
                Lihat Event
              </button>

            </div>

          </div>


          {/* =================================================
              INFORMASI TAMBAHAN
          ================================================== */}
          <div className="mt-7">

            {/* Card informasi */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <HeartPulse
                    size={25}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    UKS STEMBASE
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Sehat, Peduli, Berprestasi
                  </p>
                </div>

              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Selamat datang di Sistem Informasi UKS-STEMBASE.
                Gunakan menu yang tersedia untuk mengakses berbagai
                layanan kesehatan sekolah.
              </p>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================== */}
          <div className="mt-8 pb-4 text-center">

            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} UKS-STEMBASE
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}