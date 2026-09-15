import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, ClipboardCheck, Edit3, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, PackageSearch, Pill, Plus, Search, Trash2, User, UsersRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const menuItems = [
  ["Dashboard", "/admin", HomeIcon], ["Kunjungan UKS", "/admin/kunjungan", ClipboardCheck], ["Stok Obat", "/admin/obat", Pill],
  ["Inventaris", "/admin/inventaris", PackageSearch], ["Tips Kesehatan", "/admin/tips", Lightbulb], ["Event UKS", "/admin/event", CalendarDays],
  ["Data Pengguna", "/admin/users", UsersRound], ["Profil Saya", "/admin/profil", User],
];
const storageUrl = "http://127.0.0.1:8000/storage";
const emptyForm = { nama_barang: "", jumlah: "", satuan: "", keterangan: "", foto: null };

export default function Inventaris() {
  const navigate = useNavigate();
  const [user] = useState(() => { try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; } });
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try { const response = await api.get("/inventaris"); setItems(response.data.inventaris || []); }
      catch (requestError) { if (requestError.response?.status === 401) { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); return; } setError("Data inventaris belum dapat dimuat."); }
      finally { setLoading(false); }
    };
    void loadItems();
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };
  const filteredItems = useMemo(() => items.filter((item) => item.nama_barang.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const openCreate = () => { setEditing(null); setForm(emptyForm); setPreviewImage(null); setFormError(""); setShowForm(true); };
  const openEdit = (item) => { setEditing(item); setForm({ nama_barang: item.nama_barang, jumlah: item.jumlah, satuan: item.satuan, keterangan: item.keterangan || "", foto: null }); setPreviewImage(item.foto ? `${storageUrl}/${item.foto}` : null); setFormError(""); setShowForm(true); };
  const closeForm = () => { setEditing(null); setForm(emptyForm); setPreviewImage(null); setFormError(""); setShowForm(false); };
  const updateForm = (event) => { const { name, value, files } = event.target; if (name === "foto" && files?.[0]) setPreviewImage(URL.createObjectURL(files[0])); setForm((current) => ({ ...current, [name]: files ? files[0] : value })); };

  const saveItem = async (event) => {
    event.preventDefault(); setSaving(true); setFormError("");
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => { if (value !== null && value !== "") payload.append(key, value); });
    try {
      const response = editing
        ? await api.post(`/admin/inventaris/${editing.id}?_method=PUT`, payload, { headers: { "Content-Type": "multipart/form-data" } })
        : await api.post("/admin/inventaris", payload, { headers: { "Content-Type": "multipart/form-data" } });
      setItems((current) => editing ? current.map((item) => item.id === editing.id ? response.data.inventaris : item) : [response.data.inventaris, ...current]);
      closeForm();
    } catch (requestError) { setFormError(requestError.response?.data?.message || "Inventaris belum dapat disimpan."); }
    finally { setSaving(false); }
  };
  const deleteItem = async (item) => {
    if (!window.confirm(`Hapus inventaris ${item.nama_barang}?`)) return;
    try { await api.delete(`/admin/inventaris/${item.id}`); setItems((current) => current.filter((entry) => entry.id !== item.id)); }
    catch (requestError) { setError(requestError.response?.data?.message || "Inventaris belum dapat dihapus."); }
  };

  return <div className="min-h-screen bg-slate-100">
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block"><div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50"><HeartPulse size={27} className="text-emerald-600" /></div><div><h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1><p className="text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p></div></div><nav className="px-4 py-6">{menuItems.map(([label, path, Icon]) => <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${path === "/admin/inventaris" ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>)}</nav><div className="absolute bottom-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"><LogOut size={18} />Logout</button></div></aside>
    <main className="min-h-screen lg:ml-64"><header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10"><div><h2 className="text-2xl font-extrabold text-slate-800">Kelola Inventaris</h2><p className="mt-1 text-sm text-slate-400">Dashboard &gt; Inventaris</p></div><div className="flex items-center gap-5"><button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-100">{user?.foto ? <img src={user.foto} alt="Foto admin" className="h-full w-full object-cover" /> : <User size={19} className="text-emerald-600" />}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Administrator"}</p><p className="text-xs text-slate-400">Administrator</p></div></div></div></header>
      <div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12"><div className="flex flex-col gap-3 sm:flex-row"><label className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4"><Search size={18} className="text-slate-400" /><span className="sr-only">Cari inventaris</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama barang..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></label><button type="button" onClick={openCreate} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"><Plus size={16} />Tambah Inventaris</button></div>{error && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6"><div><h3 className="text-lg font-bold text-slate-800">Daftar Inventaris</h3><p className="mt-1 text-sm text-slate-400">Kelola stok dan informasi inventaris UKS.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{filteredItems.length} jenis</span></div><div className="overflow-x-auto">{loading ? <p className="px-6 py-10 text-sm text-slate-400">Memuat data inventaris...</p> : filteredItems.length === 0 ? <div className="px-6 py-12 text-center"><PackageSearch size={30} className="mx-auto text-emerald-500" /><p className="mt-2 text-sm font-semibold text-slate-600">Belum ada inventaris yang sesuai.</p></div> : <table className="w-full min-w-225 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{["No", "Nama Barang", "Jumlah", "Satuan", "Foto", "Keterangan", "Aksi"].map((heading) => <th key={heading} className="px-6 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredItems.map((item, index) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-6 py-4 text-slate-400">{index + 1}</td><td className="px-6 py-4 font-semibold text-slate-700">{item.nama_barang}</td><td className={`px-6 py-4 font-bold ${item.jumlah > 0 ? "text-emerald-600" : "text-red-500"}`}>{item.jumlah}</td><td className="px-6 py-4 text-slate-500">{item.satuan}</td><td className="px-6 py-4">{item.foto ? <img src={`${storageUrl}/${item.foto}`} alt={item.nama_barang} className="h-11 w-11 rounded-lg object-cover" /> : <span className="text-xs text-slate-400">Tidak ada</span>}</td><td className="max-w-64 px-6 py-4 text-slate-500">{item.keterangan || "-"}</td><td className="px-6 py-4"><div className="flex items-center gap-2"><button type="button" aria-label={`Edit ${item.nama_barang}`} onClick={() => openEdit(item)} className="rounded-lg bg-sky-50 p-2 text-sky-600 hover:bg-sky-100"><Edit3 size={15} /></button><button type="button" aria-label={`Hapus ${item.nama_barang}`} onClick={() => deleteItem(item)} className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>}</div></section>
      </div></main>
    {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={saveItem} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{editing ? "Edit data" : "Data baru"}</p><h3 className="mt-1 text-xl font-bold text-slate-800">{editing ? "Edit Inventaris" : "Tambah Inventaris"}</h3></div><button type="button" aria-label="Tutup" onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div>{formError && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>}<div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Nama Barang<input name="nama_barang" value={form.nama_barang} onChange={updateForm} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700">Jumlah<input name="jumlah" type="number" min="0" value={form.jumlah} onChange={updateForm} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700">Satuan<input name="satuan" value={form.satuan} onChange={updateForm} required placeholder="Buah / Unit" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700">Foto<input name="foto" type="file" accept="image/png,image/jpeg,image/webp" onChange={updateForm} className="mt-2 block w-full rounded-lg border border-slate-200 p-2 text-sm font-normal text-slate-500" />{previewImage && <img src={previewImage} alt="Preview inventaris" className="mt-3 h-24 w-full rounded-lg bg-slate-50 object-contain" />}</label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Keterangan<textarea name="keterangan" value={form.keterangan} onChange={updateForm} rows={4} className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500" /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={closeForm} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">Batal</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Inventaris"}</button></div></form></div>}
  </div>;
}