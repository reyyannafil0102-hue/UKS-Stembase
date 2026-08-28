import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  Edit3,
  HeartPulse,
  Home as HomeIcon,
  Lightbulb,
  LogOut,
  PackageSearch,
  Pill,
  Plus,
  Search,
  Trash2,
  User,
  UsersRound,
  X,
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
const storageUrl = "http://127.0.0.1:8000/storage";
const emptyForm = {
  nama_obat: "",
  kegunaan: "",
  stok: "",
  satuan: "",
  keterangan: "",
  foto: null,
};

export default function Obat() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [obats, setObats] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadObats = async () => {
      try {
        const response = await api.get("/obat");
        setObats(response.data.obats || []);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        setError("Data obat belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    };
    void loadObats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const categories = [
    ...new Set(obats.map((obat) => obat.kegunaan).filter(Boolean)),
  ];
  const filteredObats = useMemo(
    () =>
      obats.filter(
        (obat) =>
          obat.nama_obat.toLowerCase().includes(search.toLowerCase()) &&
          (!category || obat.kegunaan === category),
      ),
    [category, obats, search],
  );
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };
  const openEdit = (obat) => {
    setEditing(obat);
    setForm({
      nama_obat: obat.nama_obat,
      kegunaan: obat.kegunaan,
      stok: obat.stok,
      satuan: obat.satuan,
      keterangan: obat.keterangan || "",
      foto: null,
    });
    setFormError("");
    setShowForm(true);
  };
  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(false);
  };
  const updateForm = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const saveObat = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") payload.append(key, value);
    });
    try {
      const response = editing
        ? await api.post(`/admin/obat/${editing.id}?_method=PUT`, payload, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post("/admin/obat", payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      setObats((current) =>
        editing
          ? current.map((obat) =>
              obat.id === editing.id ? response.data.obat : obat,
            )
          : [response.data.obat, ...current],
      );
      closeForm();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message || "Obat belum dapat disimpan.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteObat = async (obat) => {
    if (!window.confirm(`Hapus obat ${obat.nama_obat}?`)) return;
    try {
      await api.delete(`/admin/obat/${obat.id}`);
      setObats((current) => current.filter((item) => item.id !== obat.id));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Obat belum dapat dihapus.",
      );
    }
  };

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
              className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${path === "/admin/obat" ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
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
              Kelola Obat
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Dashboard &gt; Stok Obat
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4">
              <Search size={18} className="text-slate-400" />
              <span className="sr-only">Cari obat</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama obat..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none"
            >
              <option value="">Semua kegunaan</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={openCreate}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={16} />
              Tambah Obat
            </button>
          </div>
          {error && (
            <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Daftar Obat
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Kelola stok dan informasi obat UKS.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {filteredObats.length} jenis
              </span>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <p className="px-6 py-10 text-sm text-slate-400">
                  Memuat data obat...
                </p>
              ) : filteredObats.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Pill size={30} className="mx-auto text-emerald-500" />
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    Belum ada obat yang sesuai.
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      {[
                        "No",
                        "Nama Obat",
                        "Stok",
                        "Satuan",
                        "Foto",
                        "Aksi",
                      ].map((heading) => (
                        <th key={heading} className="px-6 py-4 font-semibold">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredObats.map((obat, index) => (
                      <tr key={obat.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {obat.nama_obat}
                        </td>
                        <td
                          className={`px-6 py-4 font-bold ${obat.stok > 0 ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {obat.stok}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {obat.satuan}
                        </td>
                        <td className="px-6 py-4">
                          {obat.foto ? (
                            <img
                              src={`${storageUrl}/${obat.foto}`}
                              alt={obat.nama_obat}
                              className="h-11 w-11 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">
                              Tidak ada
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Edit ${obat.nama_obat}`}
                              onClick={() => openEdit(obat)}
                              className="rounded-lg bg-sky-50 p-2 text-sky-600 hover:bg-sky-100"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Hapus ${obat.nama_obat}`}
                              onClick={() => deleteObat(obat)}
                              className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </main>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={saveObat}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  {editing ? "Edit data" : "Data baru"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {editing ? "Edit Obat" : "Tambah Obat"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            {formError && (
              <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Nama Obat
                <input
                  name="nama_obat"
                  value={form.nama_obat}
                  onChange={updateForm}
                  required
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Kegunaan
                <input
                  name="kegunaan"
                  value={form.kegunaan}
                  onChange={updateForm}
                  required
                  placeholder="Contoh: Demam"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Stok
                <input
                  name="stok"
                  type="number"
                  min="0"
                  value={form.stok}
                  onChange={updateForm}
                  required
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Satuan
                <input
                  name="satuan"
                  value={form.satuan}
                  onChange={updateForm}
                  required
                  placeholder="Tablet / Botol"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Keterangan
                <textarea
                  name="keterangan"
                  value={form.keterangan}
                  onChange={updateForm}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Foto
                <input
                  name="foto"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={updateForm}
                  className="mt-2 block w-full rounded-lg border border-slate-200 p-2 text-sm font-normal text-slate-500"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Obat"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
