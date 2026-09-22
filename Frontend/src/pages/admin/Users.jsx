import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, CheckCircle2, ClipboardCheck, Edit3, HeartPulse, Home as HomeIcon, Lightbulb, LockKeyhole, LogOut, PackageSearch, Pill, Save, User, UserRound, UsersRound, X } from "lucide-react";
import api from "../../services/api";
import schoolImage from "../../assets/images/Logo-SMKN-7-Semarang.png";

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

const formatDate = (date) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));

export default function Users() {
	const navigate = useNavigate();
	const [user, setUser] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("user")) || null;
		} catch {
			return null;
		}
	});
	const [kunjungans, setKunjungans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showEdit, setShowEdit] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [profileForm, setProfileForm] = useState({ name: "", email: "" });
	const [passwordForm, setPasswordForm] = useState({ current_password: "", password: "", password_confirmation: "" });

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const [userResponse, kunjunganResponse] = await Promise.all([api.get("/user"), api.get("/kunjungan")]);
				setUser(userResponse.data.user);
				localStorage.setItem("user", JSON.stringify(userResponse.data.user));
				setKunjungans(kunjunganResponse.data.kunjungans || []);
			} catch (error) {
				if (error.response?.status === 401) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					navigate("/login");
				}
			} finally {
				setLoading(false);
			}
		};

		void loadProfile();
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	const openEditProfile = () => {
		setProfileForm({ name: user?.name || "", email: user?.email || "" });
		setMessage("");
		setError("");
		setShowEdit(true);
	};

	const saveProfile = async (event) => {
		event.preventDefault();
		setSaving(true);
		setMessage("");
		setError("");
		try {
			const response = await api.put("/user/profile", { ...profileForm, kelas: user?.kelas || "", nisn: user?.nisn || "", alamat: user?.alamat || "" });
			setUser(response.data.user);
			localStorage.setItem("user", JSON.stringify(response.data.user));
			setShowEdit(false);
			setMessage(response.data.message || "Profil berhasil diperbarui.");
		} catch (requestError) {
			setError(requestError.response?.data?.message || "Profil belum dapat diperbarui.");
		} finally {
			setSaving(false);
		}
	};

	const changePassword = async (event) => {
		event.preventDefault();
		setSaving(true);
		setMessage("");
		setError("");
		try {
			const response = await api.put("/user/password", passwordForm);
			setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
			setShowPassword(false);
			setMessage(response.data.message || "Password berhasil diganti.");
		} catch (requestError) {
			setError(requestError.response?.data?.message || "Password belum dapat diganti.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-100">
			<aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
				<div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><HeartPulse size={27} className="text-emerald-600" /></div><div><h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1><p className="mt-0.5 text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p></div></div>
				<nav className="px-4 py-6">{menuItems.map(({ label, path, icon: Icon }) => <button key={path} type="button" onClick={() => navigate(path)} className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${path === "/admin/profil" ? "bg-emerald-50 font-semibold text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}><Icon size={18} />{label}</button>)}</nav>
				<div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"><LogOut size={18} />Logout</button></div>
			</aside>

			<main className="min-h-screen lg:ml-64">
				<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10"><div><h2 className="text-2xl font-extrabold text-slate-800">Profil</h2><p className="mt-1 text-sm text-slate-400">Dashboard &gt; Profil Saya</p></div><div className="flex items-center gap-5"><button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /></button><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-100">{user?.foto ? <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" /> : <UserRound size={19} className="text-emerald-600" />}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Administrator"}</p><p className="text-xs text-slate-400">Administrator</p></div></div></div></header>

				<div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
					<section className="relative h-44 overflow-hidden rounded-2xl shadow-sm sm:h-48"><img src={schoolImage} alt="Latar ruang UKS" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-slate-950/65" /><div className="absolute inset-0 flex flex-col items-center justify-center text-white"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">{user?.foto ? <img src={user.foto} alt="Foto profil" className="h-full w-full object-cover" /> : <UserRound size={30} className="text-slate-700" />}</div><h1 className="mt-2 text-lg font-bold">{user?.name || "Administrator"}</h1><p className="text-xs text-emerald-300">Administrator • UKS STEMBASE</p></div></section>

					<div className="mt-5 grid gap-5 xl:grid-cols-2">
						<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><UserRound size={16} className="text-emerald-600" /><h3 className="text-sm font-bold text-slate-800">Data Diri</h3></div><button type="button" onClick={openEditProfile} className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"><Edit3 size={14} />Edit</button></div><dl className="mt-4 divide-y divide-slate-100 text-xs"><div className="flex justify-between gap-4 py-3"><dt className="text-slate-400">Nama Lengkap</dt><dd className="text-right font-semibold text-slate-700">{user?.name || "-"}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-slate-400">Email</dt><dd className="max-w-[65%] break-all text-right font-semibold text-slate-700">{user?.email || "-"}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-slate-400">Peran</dt><dd className="text-right font-semibold text-emerald-600">Administrator</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-slate-400">Status Akun</dt><dd className="text-right font-semibold text-emerald-600">Aktif</dd></div></dl></section>

						<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-2"><ClipboardCheck size={16} className="text-emerald-600" /><h3 className="text-sm font-bold text-slate-800">Riwayat Kunjungan UKS</h3></div>{loading ? <p className="mt-6 text-xs text-slate-400">Memuat riwayat...</p> : kunjungans.length === 0 ? <p className="mt-6 text-xs text-slate-400">Belum ada riwayat kunjungan.</p> : <div className="mt-3 space-y-3">{kunjungans.slice(0, 3).map((kunjungan) => <article key={kunjungan.id} className="rounded-lg bg-slate-50 px-4 py-3"><div className="flex items-center justify-between gap-3"><h4 className="text-xs font-bold text-slate-700">{kunjungan.keluhan || "Kunjungan UKS"}</h4><time className="shrink-0 text-[10px] font-semibold text-emerald-600">{formatDate(kunjungan.waktu_masuk)}</time></div><p className="mt-1 text-[10px] text-slate-400">{kunjungan.status || "Menunggu pemeriksaan"}</p></article>)}</div>}</section>
					</div>
					{(message || error) && <div className={`mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${message ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-600"}`}><CheckCircle2 size={16} />{message || error}</div>}
					<section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><LockKeyhole size={17} className="text-emerald-600" /><h3 className="text-sm font-bold text-slate-800">Keamanan Akun</h3></div><p className="mt-1 text-xs text-slate-400">Perbarui password secara berkala untuk menjaga akun tetap aman.</p></div><button type="button" onClick={() => { setError(""); setMessage(""); setShowPassword(true); }} className="flex w-fit items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"><LockKeyhole size={14} />Lupa Password / Ganti Password</button></div></section>
				</div>
			</main>
			{showEdit && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={saveProfile} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Pengaturan profil</p><h3 className="mt-1 text-xl font-bold text-slate-800">Edit Data Diri</h3></div><button type="button" aria-label="Tutup edit profil" onClick={() => setShowEdit(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Nama Lengkap<input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700">Gmail / Email<input type="email" value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowEdit(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">Batal</button><button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><Save size={16} />{saving ? "Menyimpan..." : "Simpan Perubahan"}</button></div></form></div>}
			{showPassword && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={changePassword} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Keamanan akun</p><h3 className="mt-1 text-xl font-bold text-slate-800">Ganti Password</h3></div><button type="button" aria-label="Tutup ganti password" onClick={() => setShowPassword(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><label className="mt-6 block text-sm font-semibold text-slate-700">Password Lama<input type="password" value={passwordForm.current_password} onChange={(event) => setPasswordForm({ ...passwordForm, current_password: event.target.value })} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="mt-4 block text-sm font-semibold text-slate-700">Password Baru<input type="password" minLength={8} value={passwordForm.password} onChange={(event) => setPasswordForm({ ...passwordForm, password: event.target.value })} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="mt-4 block text-sm font-semibold text-slate-700">Konfirmasi Password Baru<input type="password" minLength={8} value={passwordForm.password_confirmation} onChange={(event) => setPasswordForm({ ...passwordForm, password_confirmation: event.target.value })} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowPassword(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">Batal</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? "Menyimpan..." : "Ganti Password"}</button></div></form></div>}
		</div>
	);
}
