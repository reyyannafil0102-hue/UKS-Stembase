import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, ClipboardCheck, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, PackageSearch, Pill, User } from "lucide-react";
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

const tipColors = ["bg-orange-50", "bg-sky-50", "bg-amber-50", "bg-rose-50", "bg-emerald-50", "bg-violet-50"];

export default function TipsKesehatan() {
	const navigate = useNavigate();
	const [user] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("user")) || null;
		} catch {
			return null;
		}
	});
	const [tips, setTips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadTips = async () => {
			try {
				const response = await api.get("/tips");
				setTips(response.data.tips || []);
			} catch (requestError) {
				if (requestError.response?.status === 401) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					navigate("/login");
					return;
				}
				setError("Data tips kesehatan belum dapat dimuat.");
			} finally {
				setLoading(false);
			}
		};

		void loadTips();
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-slate-100">
			<aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
				<div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><HeartPulse size={27} className="text-emerald-600" /></div>
					<div><h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1><p className="mt-0.5 text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p></div>
				</div>
				<nav className="px-4 py-6">
					{menuItems.map(({ label, path, icon: Icon }) => {
						const active = path === "/tips-kesehatan";
						return <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${active ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>;
					})}
				</nav>
				<div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"><LogOut size={18} />Logout</button></div>
			</aside>
			<MobileMenu currentPath="/tips-kesehatan" onLogout={handleLogout} />

			<main className="min-h-screen lg:ml-64">
				<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">
					<div><h2 className="text-2xl font-extrabold text-slate-800">Tips Kesehatan</h2><p className="mt-1 text-sm text-slate-400">Dashboard &gt; Tips Kesehatan</p></div>
					<div className="flex items-center gap-5"><button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"><Bell size={21} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-100">{user?.foto ? <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" /> : <User size={21} className="text-emerald-600" />}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Pengguna"}</p><p className="mt-0.5 text-xs text-slate-400">Siswa</p></div></div></div>
				</header>

				<div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
					<section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><h3 className="text-lg font-bold text-emerald-700">💚 Tips Sehat untuk Siswa</h3><p className="mt-1 text-sm text-emerald-700/70">Kebiasaan sederhana sehari-hari dapat membantu menjaga tubuh tetap sehat dan siap mengikuti kegiatan di sekolah.</p></section>
					{error && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
					  {loading ? <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-400 shadow-sm">Memuat tips kesehatan...</div> : tips.length === 0 ? <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">Belum ada tips kesehatan.</div> : <div className="mt-6 flex snap-x gap-6 overflow-x-auto pb-4">{tips.map((tip, index) => <article key={tip.id} className="w-[min(88vw,400px)] min-w-[min(88vw,400px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`flex h-48 items-center justify-center ${tipColors[index % tipColors.length]}`}>{tip.gambar ? <img src={tip.gambar} alt={tip.judul} className="h-full w-full object-cover" /> : <Lightbulb size={64} className="text-amber-500" />}</div><div className="min-h-96 p-6"><p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Tips {String(index + 1).padStart(2, "0")}</p><h3 className="mt-3 text-lg font-bold text-slate-800">{tip.judul}</h3><p className="mt-4 text-base leading-7 text-slate-400">{tip.isi}</p></div></article>)}</div>}
					<div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"><span className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-600">💡</span><p><span className="font-semibold text-emerald-600">Ingat!</span> Jaga tubuh tetap sehat, jangan memaksakan diri, dan segera beristirahat jika merasa kurang enak badan.</p></div>
				</div>
			</main>
		</div>
	);
}
