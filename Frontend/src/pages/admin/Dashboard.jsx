import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, PackageSearch, Pill, User, UsersRound } from "lucide-react";
import api from "../../services/api";

const menuItems = [
	{ label: "Dashboard", path: "/admin", icon: HomeIcon },
	{ label: "Kunjungan UKS", path: "/admin/kunjungan", icon: ClipboardCheck },
	{ label: "Stok Obat", path: "/admin/obat", icon: Pill },
	{ label: "Inventaris", path: "/admin/inventaris", icon: PackageSearch },
	{ label: "Tips Kesehatan", path: "/admin/tips", icon: Lightbulb },
	{ label: "Event UKS", path: "/admin/event", icon: CalendarDays },
	{ label: "Data Pengguna", path: "/admin/users", icon: UsersRound },
	{ label: "Profil Saya", path: "/admin/profil", icon: User },
];

const formatTime = (date) => new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));

export default function Dashboard() {
	const navigate = useNavigate();
	const [user] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("user")) || null;
		} catch {
			return null;
		}
	});
	const [dashboard, setDashboard] = useState(null);
	const [kunjungans, setKunjungans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				const [dashboardResponse, kunjunganResponse] = await Promise.all([api.get("/admin/dashboard"), api.get("/admin/kunjungan")]);
				setDashboard(dashboardResponse.data.dashboard || {});
				setKunjungans(kunjunganResponse.data.kunjungans || []);
			} catch (requestError) {
				if (requestError.response?.status === 401) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					navigate("/login");
					return;
				}
				setError(requestError.response?.data?.message || "Data dashboard belum dapat dimuat.");
			} finally {
				setLoading(false);
			}
		};

		void loadDashboard();
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	const today = new Date().toDateString();
	const todayVisits = kunjungans.filter((visit) => new Date(visit.waktu_masuk).toDateString() === today);
	const stats = [
		{ label: "Kunjungan Hari Ini", value: dashboard?.kunjungan_hari_ini ?? 0, detail: "Siswa", icon: ClipboardCheck, color: "bg-emerald-50 text-emerald-600" },
		{ label: "Total Jenis Obat", value: dashboard?.total_jenis_obat ?? 0, detail: "Jenis tersedia", icon: Pill, color: "bg-sky-50 text-sky-600" },
		{ label: "Event Aktif", value: dashboard?.event_aktif ?? 0, detail: "Event mendatang", icon: CalendarDays, color: "bg-amber-50 text-amber-600" },
		{ label: "Total Kunjungan", value: dashboard?.total_kunjungan ?? 0, detail: "Seluruh waktu", icon: UsersRound, color: "bg-violet-50 text-violet-600" },
	];

	return (
		<div className="min-h-screen bg-slate-100">
			<aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
				<div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><HeartPulse size={27} className="text-emerald-600" /></div><div><h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1><p className="mt-0.5 text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p></div></div>
				<nav className="px-4 py-6">{menuItems.map(({ label, path, icon: Icon }) => <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${path === "/admin" ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>)}</nav>
				<div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"><LogOut size={18} />Logout</button></div>
			</aside>

			<main className="min-h-screen lg:ml-64">
				<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10"><div><h2 className="text-2xl font-extrabold text-slate-800">Beranda</h2><p className="mt-1 text-sm text-slate-400">Dashboard admin UKS STEMBASE</p></div><div className="flex items-center gap-5"><button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-100">{user?.foto ? <img src={user.foto} alt="Foto admin" className="h-full w-full object-cover" /> : <User size={19} className="text-emerald-600" />}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Administrator"}</p><p className="text-xs text-slate-400">Administrator</p></div></div></div></header>

				<div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
					<section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm"><HeartPulse size={22} /></div><div><h3 className="text-lg font-bold text-emerald-800">Selamat datang, {user?.name || "Administrator"}</h3><p className="mt-1 text-sm text-emerald-700/70">Pantau aktivitas dan layanan UKS dari satu tempat.</p></div></div></section>

					{error && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
					<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, detail, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon size={20} /></div><p className="mt-4 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-3xl font-extrabold text-slate-800">{loading ? "-" : value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></article>)}</div>

					<section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h3 className="text-lg font-bold text-slate-800">Kunjungan Hari Ini</h3><p className="mt-1 text-sm text-slate-400">Daftar kunjungan terbaru yang masuk hari ini.</p></div><button type="button" onClick={() => navigate("/admin/kunjungan")} className="flex w-fit items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"><ClipboardCheck size={15} />Lihat Semua</button></div><div className="overflow-x-auto">{loading ? <p className="px-6 py-8 text-sm text-slate-400">Memuat kunjungan...</p> : todayVisits.length === 0 ? <div className="px-6 py-10 text-center"><CheckCircle2 size={28} className="mx-auto text-emerald-500" /><p className="mt-2 text-sm font-semibold text-slate-600">Belum ada kunjungan hari ini.</p></div> : <table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-4 font-semibold">No</th><th className="px-6 py-4 font-semibold">Nama</th><th className="px-6 py-4 font-semibold">Kelas</th><th className="px-6 py-4 font-semibold">Keluhan</th><th className="px-6 py-4 font-semibold">Jam Masuk</th><th className="px-6 py-4 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{todayVisits.slice(0, 8).map((visit, index) => <tr key={visit.id} className="transition hover:bg-slate-50"><td className="px-6 py-4 text-slate-400">{index + 1}</td><td className="px-6 py-4 font-semibold text-slate-700">{visit.nama || visit.user?.name || "-"}</td><td className="px-6 py-4 text-slate-500">{visit.kelas || visit.user?.kelas || "-"}</td><td className="max-w-56 px-6 py-4 text-slate-500">{visit.keluhan || "-"}</td><td className="px-6 py-4 text-slate-500"><span className="flex items-center gap-2"><Clock3 size={14} className="text-emerald-600" />{formatTime(visit.waktu_masuk)}</span></td><td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${visit.status === "selesai" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{visit.status || "menunggu"}</span></td></tr>)}</tbody></table>}</div></section>
				</div>
			</main>
		</div>
	);
}
