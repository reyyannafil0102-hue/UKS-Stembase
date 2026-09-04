import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, ClipboardCheck, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, PackageSearch, Pill, Search, User } from "lucide-react";
import api from "../../services/api";
import MobileMenu from "../../components/MobileMenu";

const menuItems = [
	{ label: "Dashboard", path: "/Dashboard", icon: HomeIcon },
	{ label: "Absensi UKS", path: "/absensi-uks", icon: ClipboardCheck },
	{ label: "Stok Obat", path: "/stok-obat", icon: Pill },
	{ label: "Inventaris", path: "/inventaris", icon: PackageSearch },
	{ label: "Tips Kesehatan", path: "/tips-kesehatan", icon: Lightbulb },
	{ label: "Event UKS", path: "/event-uks", icon: CalendarDays },
	{ label: "Profil Saya", path: "/profil", icon: User },
];

const colorClasses = ["bg-emerald-50", "bg-rose-50", "bg-sky-50", "bg-orange-50", "bg-amber-50", "bg-violet-50"];
const storageUrl = "http://127.0.0.1:8000/storage";

const getObatImageUrl = (foto) => {
	if (!foto) return "";
	if (/^https?:\/\//i.test(foto)) return foto;
	return `${storageUrl}/${foto.replace(/^\/+/, "")}`;
};

export default function StokObat() {
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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

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
				setError("Data stok obat belum dapat dimuat.");
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

	const filteredObats = obats.filter((obat) => obat.nama_obat.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="min-h-screen bg-slate-100">
			<aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
				<div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><HeartPulse size={27} className="text-emerald-600" /></div>
					<div><h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1><p className="mt-0.5 text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p></div>
				</div>
				<nav className="px-4 py-6">
					{menuItems.map(({ label, path, icon: Icon }) => {
						const active = path === "/stok-obat";
						return <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${active ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>;
					})}
				</nav>
				<div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"><LogOut size={18} />Logout</button></div>
			</aside>
			<MobileMenu currentPath="/stok-obat" onLogout={handleLogout} />

			<main className="min-h-screen lg:ml-64">
				<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">
					<div><h2 className="text-2xl font-extrabold text-slate-800">Stok Obat</h2><p className="mt-1 text-sm text-slate-400">Dashboard &gt; Stok Obat</p></div>
					<div className="flex items-center gap-5"><button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"><Bell size={21} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-100">{user?.foto ? <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" /> : <User size={21} className="text-emerald-600" />}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Pengguna"}</p><p className="mt-0.5 text-xs text-slate-400">Siswa</p></div></div></div>
				</header>

				<div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
					<div className="flex flex-col gap-3 sm:flex-row"><label className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10"><Search size={18} className="shrink-0 text-slate-400" /><span className="sr-only">Cari nama obat</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama obat..." className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" /></label></div>
					{error && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
					  {loading ? <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-400 shadow-sm">Memuat stok obat...</div> : filteredObats.length === 0 ? <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">Tidak ada obat yang sesuai.</div> : <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredObats.map((obat, index) => <article key={obat.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`flex h-48 items-center justify-center ${colorClasses[index % colorClasses.length]}`}>{obat.foto ? <img src={getObatImageUrl(obat.foto)} alt={obat.nama_obat} className="h-full w-full object-contain p-4" /> : <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-sm"><Pill size={38} className="text-emerald-600" /></div>}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-base font-bold text-slate-800">{obat.nama_obat}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{obat.kegunaan}</p></div><div className="text-right"><p className="text-xs text-slate-400">Stok</p><p className={`text-lg font-bold ${obat.stok > 0 ? "text-emerald-600" : "text-red-500"}`}>{obat.stok}</p></div></div><span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{obat.satuan}</span></div></article>)}</div>}
					<div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">Total jenis obat tersedia: <span className="font-bold text-emerald-600">{filteredObats.length} jenis</span></div>
				</div>
			</main>
		</div>
	);
}
