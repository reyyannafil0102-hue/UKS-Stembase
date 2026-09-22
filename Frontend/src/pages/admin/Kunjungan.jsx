import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  HeartPulse,
  Home as HomeIcon,
  Lightbulb,
  LogOut,
  PackageSearch,
  Pill,
  Search,
  User,
  UsersRound,
} from "lucide-react";
import api from "../../services/api";

const menuItems = [
  ["Dashboard", "/admin", HomeIcon],
  ["Kunjungan UKS", "/admin/kunjungan", ClipboardCheck],
  ["Stok Obat", "/admin/obat", Pill],
  ["Inventaris", "/admin/inventaris", PackageSearch],
  ["Tips Kesehatan", "/admin/tips", Lightbulb],
  ["Event UKS", "/admin/event", CalendarDays],
  ["Data Pengguna", "/admin/users", UsersRound],
  ["Profil Saya", "/admin/profil", User],
];
const formatDate = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
const formatTime = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export default function Kunjungan() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [kunjungans, setKunjungans] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [tindakan, setTindakan] = useState("");
  const [saving, setSaving] = useState(false);
  const perPage = 8;

  useEffect(() => {
    const loadKunjungans = async () => {
      try {
        const response = await api.get("/admin/kunjungan");
        setKunjungans(response.data.kunjungans || []);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        setError(
          requestError.response?.data?.message ||
            "Data kunjungan belum dapat dimuat.",
        );
      } finally {
        setLoading(false);
      }
    };
    void loadKunjungans();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const openCompletionForm = (visit) => {
    setSelectedVisit(visit);
    setTindakan(visit.tindakan || "");
    setError("");
  };
  const closeCompletionForm = () => {
    if (saving) return;
    setSelectedVisit(null);
    setTindakan("");
  };
  const handleCompleteVisit = async (event) => {
    event.preventDefault();
    if (!selectedVisit || !tindakan.trim()) return;

    setSaving(true);
    setError("");
    try {
      const response = await api.put(`/admin/kunjungan/${selectedVisit.id}`, {
        tindakan: tindakan.trim(),
        status: "selesai",
      });
      const updatedVisit = response.data.kunjungan;
      setKunjungans((currentVisits) =>
        currentVisits.map((visit) =>
          visit.id === updatedVisit.id ? { ...visit, ...updatedVisit } : visit,
        ),
      );
      setSelectedVisit(null);
      setTindakan("");
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setError(
        requestError.response?.data?.message ||
          "Status kunjungan belum dapat diperbarui.",
      );
    } finally {
      setSaving(false);
    }
  };
  const filteredVisits = useMemo(
    () =>
      kunjungans.filter((visit) => {
        const name = visit.nama || visit.user?.name || "";
        return (
          name.toLowerCase().includes(search.toLowerCase()) &&
          (!date ||
            new Date(visit.waktu_masuk).toISOString().slice(0, 10) === date)
        );
      }),
    [date, kunjungans, search],
  );
  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / perPage));
  const visibleVisits = filteredVisits.slice(
    (page - 1) * perPage,
    page * perPage,
  );
  const monthlyVisits = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => {
        const monthDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth() - (3 - index),
          1,
        );
        const count = kunjungans.filter((visit) => {
          const visitDate = new Date(visit.waktu_masuk);
          return (
            visitDate.getFullYear() === monthDate.getFullYear() &&
            visitDate.getMonth() === monthDate.getMonth()
          );
        }).length;
        return {
          label: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
            monthDate,
          ),
          count,
        };
      }),
    [kunjungans],
  );
  const highestMonthlyVisits = Math.max(
    ...monthlyVisits.map((month) => month.count),
    1,
  );
  const visitorGroups = useMemo(() => {
    const groups = { Guru: 0, Siswa: 0 };
    kunjungans.forEach((visit) => {
      if (visit.jenis_pengguna === "Guru") groups.Guru += 1;
      else if (visit.jenis_pengguna === "Siswa") groups.Siswa += 1;
      else {
        const role = (visit.user?.role?.nama_role || "").toLowerCase();
        if (role.includes("guru")) groups.Guru += 1;
        else groups.Siswa += 1;
      }
    });
    return groups;
  }, [kunjungans]);
  const visitorTotal = Object.values(visitorGroups).reduce(
    (total, value) => total + value,
    0,
  );
  const visitorPercentages = Object.fromEntries(
    Object.entries(visitorGroups).map(([label, value]) => [
      label,
      visitorTotal ? Math.round((value / visitorTotal) * 100) : 0,
    ]),
  );
  const completedVisits = kunjungans.filter(
    (visit) => visit.status === "selesai",
  ).length;
  const waitingVisits = kunjungans.length - completedVisits;

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <HeartPulse size={27} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-emerald-700">
              UKS STEMBASE
            </h1>
            <p className="text-[10px] text-slate-400">
              Sehat, Peduli, Berprestasi
            </p>
          </div>
        </div>
        <nav className="px-4 py-6">
          {menuItems.map(([label, path, Icon]) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${path === "/admin/kunjungan" ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <main className="min-h-screen lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Data Kunjungan
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Dashboard &gt; Kunjungan UKS
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Notifikasi"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto admin"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={19} className="text-emerald-600" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-700">
                  Hai, {user?.name || "Administrator"}
                </p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-400">Total Kunjungan</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-800">
                {kunjungans.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-400">Menunggu Pemeriksaan</p>
              <p className="mt-2 text-3xl font-extrabold text-amber-500">
                {waitingVisits}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-400">Selesai Ditangani</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                {completedVisits}
              </p>
            </div>
          </div>
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Riwayat Kunjungan
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Kelola kunjungan guru dan siswa ke UKS.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <label className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3">
                  <Search size={17} className="text-slate-400" />
                  <span className="sr-only">Cari nama siswa</span>
                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Cari nama siswa..."
                    className="w-full bg-transparent text-sm outline-none sm:w-44"
                  />
                </label>
                <label className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3">
                  <CalendarDays size={17} className="text-slate-400" />
                  <span className="sr-only">Filter tanggal</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => {
                      setDate(event.target.value);
                      setPage(1);
                    }}
                    className="text-sm text-slate-600 outline-none"
                  />
                </label>
              </div>
            </div>
            {error && (
              <div className="mx-5 mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6">
                {error}
              </div>
            )}
            <div className="overflow-x-auto">
              {loading ? (
                <p className="px-6 py-10 text-sm text-slate-400">
                  Memuat data kunjungan...
                </p>
              ) : visibleVisits.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <CheckCircle2
                    size={30}
                    className="mx-auto text-emerald-500"
                  />
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    Tidak ada kunjungan yang sesuai.
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-205 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      {[
                        "No",
                        "Tanggal",
                        "Jenis",
                        "Nama",
                        "Kelas",
                        "Keluhan",
                        "Masuk",
                        "Status",
                        "Aksi",
                      ].map((heading) => (
                        <th key={heading} className="px-6 py-4 font-semibold">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleVisits.map((visit, index) => (
                      <tr key={visit.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-400">
                          {(page - 1) * perPage + index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                          {formatDate(visit.waktu_masuk)}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {visit.jenis_pengguna || "-"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {visit.nama || visit.user?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {visit.jenis_pengguna === "Guru"
                            ? "-"
                            : visit.kelas || visit.user?.kelas || "-"}
                        </td>
                        <td className="max-w-56 px-6 py-4 text-slate-500">
                          {visit.keluhan || "-"}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          <span className="flex items-center gap-2">
                            <Clock3 size={14} className="text-emerald-600" />
                            {formatTime(visit.waktu_masuk)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${visit.status === "selesai" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                          >
                            {visit.status || "menunggu"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {visit.status !== "selesai" && (
                            <button
                              type="button"
                              onClick={() => openCompletionForm(visit)}
                              className="whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              Tandai selesai
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:px-6">
              <span>
                Menampilkan {visibleVisits.length} dari {filteredVisits.length}{" "}
                kunjungan
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 font-semibold disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <span className="font-semibold text-slate-600">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-2 font-semibold disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </section>
          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-800">
                Grafik Pengunjung
              </h3>
            </div>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Kunjungan per bulan
                </p>
                <div className="mt-5 flex h-56 items-end gap-3 border-b border-slate-200 px-2 sm:gap-6">
                  {monthlyVisits.map((month, index) => (
                    <div
                      key={month.label}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div
                        className={`w-full max-w-16 rounded-t-lg ${index === 3 ? "bg-emerald-500" : "bg-emerald-200"}`}
                        style={{
                          height: `${Math.max((month.count / highestMonthlyVisits) * 88, month.count ? 8 : 3)}%`,
                        }}
                      />
                      <span className="text-xs capitalize text-slate-400">
                        {month.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="self-start text-sm font-semibold text-slate-500">
                  Kategori pengunjung
                </p>
                <div className="mt-4 flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-center">
                  <div
                    className="h-40 w-40 shrink-0 rounded-full"
                    role="img"
                    aria-label={`Grafik kategori pengunjung: Guru ${visitorPercentages.Guru} persen, Siswa ${visitorPercentages.Siswa} persen`}
                    style={{
                      background: `conic-gradient(#10b981 0 ${visitorPercentages.Guru}%, #64748b ${visitorPercentages.Guru}% 100%)`,
                    }}
                  />
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      Guru{" "}
                      <strong className="text-slate-700">
                        {visitorGroups.Guru} ({visitorPercentages.Guru}%)
                      </strong>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="h-3 w-3 rounded-full bg-slate-500" />
                      Siswa{" "}
                      <strong className="text-slate-700">
                        {visitorGroups.Siswa} ({visitorPercentages.Siswa}%)
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={handleCompleteVisit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-slate-800">
              Selesaikan kunjungan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Catat tindakan untuk {selectedVisit.nama || selectedVisit.user?.name || "pengunjung"}.
            </p>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Tindakan
              <textarea
                value={tindakan}
                onChange={(event) => setTindakan(event.target.value)}
                required
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm font-normal outline-none focus:border-emerald-500"
                placeholder="Contoh: Istirahat dan minum obat sesuai anjuran."
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCompletionForm}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving || !tindakan.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan sebagai selesai"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
