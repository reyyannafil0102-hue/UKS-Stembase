import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, CheckCircle2, ClipboardCheck, Droplets, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, MapPin, PackageSearch, Pill, Search, Sparkles, Stethoscope, User } from "lucide-react";
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

const cardStyles = [
	{ background: "bg-rose-100", icon: Droplets, iconColor: "text-red-600", button: "bg-emerald-600 hover:bg-emerald-700" },
	{ background: "bg-sky-100", icon: Stethoscope, iconColor: "text-sky-600", button: "bg-emerald-600 hover:bg-emerald-700" },
	{ background: "bg-emerald-100", icon: Sparkles, iconColor: "text-emerald-600", button: "bg-emerald-600 hover:bg-emerald-700" },
	{ background: "bg-amber-100", icon: CheckCircle2, iconColor: "text-amber-600", button: "bg-emerald-600 hover:bg-emerald-700" },
];

const formatDate = (date) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));

export default function EventUKS() {
	const navigate = useNavigate();
	const [user] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("user")) || null;
		} catch {
			return null;
		}
	});
	const [events, setEvents] = useState([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadEvents = async () => {
			try {
				const response = await api.get("/events");
				setEvents(response.data.events || []);
			} catch (requestError) {
				if (requestError.response?.status === 401) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					navigate("/login");
					return;
				}
				setError("Data event belum dapat dimuat.");
			} finally {
				setLoading(false);
			}
		};

		void loadEvents();
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	const filteredEvents = events.filter((event) => event.judul.toLowerCase().includes(search.toLowerCase()));
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return (
		<div className="min-h-screen bg-slate-100">
			<aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
				<div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><HeartPulse size={27} className="text-emerald-600" /></div>
					<div><h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1><p className="mt-0.5 text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p></div>
				</div>
				<nav className="px-4 py-6">
					{menuItems.map(({ label, path, icon: Icon }) => {
						const active = path === "/event-uks";
						return <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${active ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>;
					})}
				</nav>
				<div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"><LogOut size={18} />Logout</button></div>
			</aside>
			<MobileMenu currentPath="/event-uks" onLogout={handleLogout} />

			<main className="min-h-screen lg:ml-64">
				<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">
					<div><h2 className="text-2xl font-extrabold text-slate-800">Event UKS</h2><p className="mt-1 text-sm text-slate-400">Dashboard &gt; Event UKS</p></div>
					<div className="flex items-center gap-5"><button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"><Bell size={21} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-100">{user?.foto ? <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" /> : <User size={21} className="text-emerald-600" />}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Pengguna"}</p><p className="mt-0.5 text-xs text-slate-400">Siswa</p></div></div></div>
				</header>

				<div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
					<div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5"><div className="flex items-center gap-2 text-emerald-700"><HeartPulse size={18} /><h3 className="font-bold">Kegiatan UKS</h3></div><p className="mt-1 text-sm text-slate-500">Temukan berbagai kegiatan kesehatan dan acara UKS di sekolah.</p></div>
					<label className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10"><Search size={18} className="shrink-0 text-slate-400" /><span className="sr-only">Cari event</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari event..." className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" /></label>
					{error && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
					{loading ? <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-400 shadow-sm">Memuat event...</div> : filteredEvents.length === 0 ? <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">Tidak ada event yang sesuai.</div> : <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{filteredEvents.map((event, index) => { const style = cardStyles[index % cardStyles.length]; const Icon = style.icon; const eventDate = new Date(event.tanggal); eventDate.setHours(0, 0, 0, 0); const status = eventDate < today ? "Event Telah Berakhir" : eventDate.getTime() === today.getTime() ? "Telah Hadir" : "Segera Hadir"; const isPast = status === "Event Telah Berakhir"; return <article key={event.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`flex h-36 items-center justify-center ${style.background}`}>{event.gambar ? <img src={event.gambar} alt={event.judul} className="h-full w-full object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm"><Icon size={38} className={style.iconColor} /></div>}</div><div className="p-5"><h3 className="min-h-12 text-base font-bold text-slate-800">{event.judul}</h3><div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600"><CalendarDays size={14} />{formatDate(event.tanggal)}</div><div className="mt-1 flex items-center gap-2 text-xs text-slate-400"><MapPin size={14} />{event.lokasi}</div><p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{event.deskripsi}</p><span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isPast ? "bg-slate-100 text-slate-500" : status === "Telah Hadir" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{status}</span><button type="button" disabled={isPast} className={`mt-4 w-full rounded-lg px-4 py-2.5 text-xs font-bold text-white transition ${isPast ? "cursor-not-allowed bg-slate-300" : status === "Telah Hadir" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-400 hover:bg-amber-500"}`}>{isPast ? "Event Selesai" : status === "Telah Hadir" ? "Berlangsung" : "Akan Datang"}</button></div></article>; })}</div>}
					<div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"><Bell size={16} className="text-emerald-600" /><span><span className="font-bold text-emerald-600">Informasi Event:</span> Pantau halaman ini untuk mengetahui kegiatan UKS terbaru.</span></div>
				</div>
			</main>
		</div>
	);
}
