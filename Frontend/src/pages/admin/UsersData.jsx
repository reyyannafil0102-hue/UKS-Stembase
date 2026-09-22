import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardCheck, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, PackageSearch, Pill, Search, User, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const menuItems = [
  ["Dashboard", "/admin", HomeIcon], ["Kunjungan UKS", "/admin/kunjungan", ClipboardCheck],
  ["Stok Obat", "/admin/obat", Pill], ["Inventaris", "/admin/inventaris", PackageSearch],
  ["Tips Kesehatan", "/admin/tips", Lightbulb], ["Event UKS", "/admin/event", CalendarDays],
  ["Data Pengguna", "/admin/users", UsersRound], ["Profil Saya", "/admin/profil", User],
];

export default function UsersData() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([api.get("/admin/users"), api.get("/admin/roles")]);
        setUsers(usersResponse.data.users || []);
        setRoles(rolesResponse.data.roles || []);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        setError(requestError.response?.data?.message || "Data pengguna belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    };
    void loadUsers();
  }, [navigate]);

  const filteredUsers = useMemo(() => users.filter((item) => `${item.name} ${item.email} ${item.kelas || ""}`.toLowerCase().includes(search.toLowerCase())), [search, users]);
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };
  const updateRole = async (id, role_id) => {
    setSavingId(id);
    setError("");
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role_id });
      setUsers((current) => current.map((item) => item.id === id ? response.data.user : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Role pengguna belum dapat diubah.");
    } finally { setSavingId(null); }
  };

  return <div className="min-h-screen bg-slate-100">
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block"><div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50"><HeartPulse size={27} className="text-emerald-600" /></div><div><h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1><p className="text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p></div></div><nav className="px-4 py-6">{menuItems.map(([label, path, Icon]) => <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${path === "/admin/users" ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>)}</nav><div className="absolute bottom-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"><LogOut size={18} />Logout</button></div></aside>
    <main className="min-h-screen lg:ml-64"><header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10"><div><h2 className="text-2xl font-extrabold text-slate-800">Data Pengguna</h2><p className="mt-1 text-sm text-slate-400">Dashboard &gt; Data Pengguna</p></div><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100"><User size={19} className="text-emerald-600" /></div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Administrator"}</p><p className="text-xs text-slate-400">Administrator</p></div></div></header>
      <div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12"><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h3 className="text-lg font-bold text-slate-800">Daftar Pengguna</h3><p className="mt-1 text-sm text-slate-400">Kelola data dan role pengguna UKS.</p></div><label className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3"><Search size={17} className="text-slate-400" /><span className="sr-only">Cari pengguna</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau email..." className="w-full bg-transparent text-sm outline-none sm:w-56" /></label></div>{error && <div className="mx-5 mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}<div className="overflow-x-auto">{loading ? <p className="px-6 py-10 text-sm text-slate-400">Memuat data pengguna...</p> : <table className="w-full min-w-190 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{["No", "Nama", "Email", "Kelas", "Role"].map((heading) => <th key={heading} className="px-6 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredUsers.map((item, index) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-6 py-4 text-slate-400">{index + 1}</td><td className="px-6 py-4 font-semibold text-slate-700">{item.name}</td><td className="px-6 py-4 text-slate-500">{item.email}</td><td className="px-6 py-4 text-slate-500">{item.kelas || "-"}</td><td className="px-6 py-4"><select value={item.role_id} disabled={item.id === user?.id || savingId === item.id} onChange={(event) => updateRole(item.id, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-50">{roles.map((role) => <option key={role.id} value={role.id}>{role.nama_role}</option>)}</select></td></tr>)}</tbody></table>}</div><div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:px-6">Menampilkan {filteredUsers.length} pengguna</div></section></div>
    </main>
  </div>;
}
