import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, ClipboardCheck, Clock3, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, PackageSearch, Pill, Send, User } from "lucide-react";
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

function formatDate(date) {
	return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

function getVisitStatus(status) {
	return status === "selesai" ? "Selesai" : "Menunggu pemeriksaan";
}

export default function AbsensiUKS() {
	const navigate = useNavigate();
	const [user] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("user")) || null;
		} catch {
			return null;
		}
	});
	const [nama, setNama] = useState("");
	const [jenisPengguna, setJenisPengguna] = useState("Siswa");
	const [kelas, setKelas] = useState("");
	const [keluhan, setKeluhan] = useState("");
	const [kunjungans, setKunjungans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const loadKunjungans = async () => {
			try {
				const response = await api.get("/kunjungan");
				setKunjungans(response.data.kunjungans || []);
			} catch (requestError) {
				if (requestError.response?.status === 401) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					navigate("/login");
					return;
				}
				setError("Riwayat kunjungan belum dapat dimuat.");
			} finally {
				setLoading(false);
			}
		};

		void loadKunjungans();
	}, [navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitting(true);
		setMessage("");
		setError("");

		try {
			const response = await api.post("/kunjungan", { jenis_pengguna: jenisPengguna, nama, kelas, keluhan });
			setMessage(response.data.message || "Absensi berhasil dikirim.");
			setKeluhan("");
			setKunjungans((currentKunjungans) => [response.data.kunjungan, ...currentKunjungans]);
		} catch (requestError) {
			const validationError = requestError.response?.data?.errors?.keluhan?.[0];
			setError(validationError || requestError.response?.data?.message || "Absensi gagal dikirim. Silakan coba lagi.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleJenisPenggunaChange = (event) => {
		const value = event.target.value;
		setJenisPengguna(value);
		if (value === "Guru") setKelas("");
	};

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
						const active = path === "/absensi-uks";
						return <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${active ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>;
					})}
				</nav>
				<div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"><LogOut size={18} />Logout</button></div>
			</aside>
			<MobileMenu currentPath="/absensi-uks" onLogout={handleLogout} />

			<main className="min-h-screen lg:ml-64">
				<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">
					<div><h2 className="text-2xl font-extrabold text-slate-800">Absensi UKS</h2><p className="mt-1 text-sm text-slate-400">Dashboard &gt; Absensi UKS</p></div>
					<div className="flex items-center gap-5"><button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"><Bell size={21} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-100">{user?.foto ? <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" /> : <User size={21} className="text-emerald-600" />}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Pengguna"}</p><p className="mt-0.5 text-xs text-slate-400">Siswa</p></div></div></div>
				</header>

				<div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
					<section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
						<div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><ClipboardCheck size={22} className="text-emerald-600" /></div><div><h3 className="text-xl font-bold text-slate-800">Form Absensi UKS</h3><p className="mt-1 text-sm text-slate-400">Silakan isi data berikut untuk mencatat kunjungan Anda.</p></div></div>
						{(message || error) && <div className={`mt-6 rounded-lg border px-4 py-3 text-sm ${message ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-600"}`}>{message || error}</div>}
						<form onSubmit={handleSubmit} className="mt-7 space-y-5">
							  <div className={`grid gap-5 ${jenisPengguna === "Siswa" ? "md:grid-cols-3" : "md:grid-cols-2"}`}><div><label htmlFor="jenis-pengguna" className="mb-2 block text-sm font-semibold text-slate-700">Jenis Pengguna</label><select id="jenis-pengguna" value={jenisPengguna} onChange={handleJenisPenggunaChange} required className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"><option value="Siswa">Siswa</option><option value="Guru">Guru</option></select></div><div><label htmlFor="nama" className="mb-2 block text-sm font-semibold text-slate-700">Nama Lengkap</label><input id="nama" value={nama} onChange={(event) => setNama(event.target.value)} placeholder="Nama Lengkap" required className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" /></div>{jenisPengguna === "Siswa" && <div><label htmlFor="kelas" className="mb-2 block text-sm font-semibold text-slate-700">Kelas</label><input id="kelas" value={kelas} onChange={(event) => setKelas(event.target.value)} placeholder="Kelas (XII SIJA 1)" required className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" /></div>}</div>
							<div><label htmlFor="keluhan" className="mb-2 block text-sm font-semibold text-slate-700">Keterangan</label><textarea id="keluhan" value={keluhan} onChange={(event) => setKeluhan(event.target.value)} required rows={4} placeholder="Tuliskan keterangan atau keperluan..." className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" /></div>
							<div className="grid gap-4 sm:grid-cols-2"><div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14} /> Waktu akses</div><p className="mt-1 text-sm font-bold text-emerald-700">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date())}</p></div><div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex items-center gap-2 text-xs text-slate-500"><ClipboardCheck size={14} /> Status</div><p className="mt-1 text-sm font-bold text-emerald-700">Menunggu pemeriksaan</p></div></div>
							<div className="flex justify-end gap-3"><button type="button" onClick={() => navigate("/Dashboard")} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50">Batal</button><button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"><Send size={15} />{submitting ? "Mengirim..." : "Kirim Absensi"}</button></div>
						</form>
					</section>

						  <section className="mt-7 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between gap-4"><div><h3 className="text-lg font-bold text-slate-800">Riwayat Kunjungan</h3><p className="mt-1 text-sm text-slate-400">Daftar absensi yang pernah Anda kirim.</p></div><ClipboardCheck size={22} className="text-emerald-600" /></div>{loading ? <p className="mt-6 text-sm text-slate-400">Memuat riwayat...</p> : kunjungans.length === 0 ? <p className="mt-6 text-sm text-slate-400">Belum ada riwayat kunjungan.</p> : <div className="mt-5 space-y-3">{kunjungans.map((kunjungan) => <div key={kunjungan.id} className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-slate-700">{kunjungan.keluhan}</p><p className="mt-1 text-xs text-slate-500">{kunjungan.nama || kunjungan.user?.name || nama} · {kunjungan.jenis_pengguna === "Guru" ? "Guru" : `Kelas ${kunjungan.kelas || kunjungan.user?.kelas || kelas}`}</p><p className="mt-1 text-xs text-slate-400">{formatDate(kunjungan.waktu_masuk)}</p>{kunjungan.status === "selesai" && kunjungan.tindakan && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700"><span className="font-semibold">Tindakan:</span> {kunjungan.tindakan}</p>}</div><span className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${kunjungan.status === "selesai" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{getVisitStatus(kunjungan.status)}</span></div>)}</div>}</section>
				</div>
			</main>
		</div>
	);
}
