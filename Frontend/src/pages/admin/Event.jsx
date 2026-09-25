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
	MapPin,
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

const emptyForm = { judul: "", deskripsi: "", tanggal: "", lokasi: "", gambar: "" };

const formatDate = (date) =>
	new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(date));

const dateValue = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");

export default function Event() {
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
	const [formError, setFormError] = useState("");
	const [form, setForm] = useState(emptyForm);
	const [editing, setEditing] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);

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

	const filteredEvents = useMemo(
		() =>
			events.filter((event) =>
				`${event.judul} ${event.lokasi} ${event.deskripsi}`
					.toLowerCase()
					.includes(search.toLowerCase()),
			),
		[events, search],
	);

	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setFormError("");
		setShowForm(true);
	};

	const openEdit = (event) => {
		setEditing(event);
		setForm({
			judul: event.judul || "",
			deskripsi: event.deskripsi || "",
			tanggal: dateValue(event.tanggal),
			lokasi: event.lokasi || "",
			gambar: event.gambar || "",
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
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	};

	const saveEvent = async (event) => {
		event.preventDefault();
		setSaving(true);
		setFormError("");

		try {
			const response = editing
				? await api.put(`/admin/events/${editing.id}`, form)
				: await api.post("/admin/events", form);
			const savedEvent = response.data.event;

			setEvents((current) =>
				editing
					? current.map((item) => (item.id === editing.id ? savedEvent : item))
					: [savedEvent, ...current],
			);
			closeForm();
		} catch (requestError) {
			setFormError(
				requestError.response?.data?.message || "Event belum dapat disimpan.",
			);
		} finally {
			setSaving(false);
		}
	};

	const deleteEvent = async (event) => {
		if (!window.confirm(`Hapus event ${event.judul}?`)) return;

		try {
			await api.delete(`/admin/events/${event.id}`);
			setEvents((current) => current.filter((item) => item.id !== event.id));
		} catch (requestError) {
			setError(
				requestError.response?.data?.message || "Event belum dapat dihapus.",
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
						<h1 className="text-base font-extrabold text-emerald-700">UKS STEMBASE</h1>
						<p className="text-[10px] text-slate-400">Sehat, Peduli, Berprestasi</p>
					</div>
				</div>
				<nav className="px-4 py-6">
					{menuItems.map(([label, path, Icon]) => (
						<button
							key={path}
							type="button"
							onClick={() => navigate(path)}
							className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${path === "/admin/event" ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
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
						<h2 className="text-2xl font-extrabold text-slate-800">Kelola Event UKS</h2>
						<p className="mt-1 text-sm text-slate-400">Dashboard &gt; Event UKS</p>
					</div>
					<div className="flex items-center gap-5">
						<button type="button" aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
							<Bell size={18} />
							<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
						</button>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
								{user?.foto ? <img src={user.foto} alt="Foto admin" className="h-full w-full object-cover" /> : <User size={19} className="text-emerald-600" />}
							</div>
							<div className="hidden sm:block">
								<p className="text-sm font-bold text-slate-700">Hai, {user?.name || "Administrator"}</p>
								<p className="text-xs text-slate-400">Administrator</p>
							</div>
						</div>
					</div>
				</header>

				<div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
					<div className="flex flex-col gap-3 sm:flex-row">
						<label className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4">
							<Search size={18} className="text-slate-400" />
							<span className="sr-only">Cari event</span>
							<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari event UKS..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
						</label>
						<button type="button" onClick={openCreate} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700">
							<Plus size={16} />
							Tambah Event
						</button>
					</div>
					{error && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

					<section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
						<div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
							<div>
								<h3 className="text-lg font-bold text-slate-800">Daftar Event UKS</h3>
								<p className="mt-1 text-sm text-slate-400">Kelola kegiatan dan acara kesehatan sekolah.</p>
							</div>
							<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{filteredEvents.length} event</span>
						</div>
						<div className="overflow-x-auto">
							{loading ? <p className="px-6 py-10 text-sm text-slate-400">Memuat data event...</p> : filteredEvents.length === 0 ? <div className="px-6 py-12 text-center"><CalendarDays size={30} className="mx-auto text-emerald-500" /><p className="mt-2 text-sm font-semibold text-slate-600">Belum ada event yang sesuai.</p></div> : (
								<table className="w-full min-w-[950px] text-left text-sm">
									<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{["No", "Event", "Tanggal", "Lokasi", "Deskripsi", "Aksi"].map((heading) => <th key={heading} className="px-6 py-4 font-semibold">{heading}</th>)}</tr></thead>
									<tbody className="divide-y divide-slate-100">
										{filteredEvents.map((event, index) => (
											<tr key={event.id} className="hover:bg-slate-50">
												<td className="px-6 py-4 text-slate-400">{index + 1}</td>
												<td className="px-6 py-4"><div className="flex items-center gap-3">{event.gambar ? <img src={event.gambar} alt={event.judul} className="h-12 w-16 rounded-lg object-cover" /> : <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-emerald-50"><CalendarDays size={20} className="text-emerald-600" /></div>}<span className="font-semibold text-slate-700">{event.judul}</span></div></td>
												<td className="whitespace-nowrap px-6 py-4 text-slate-600">{formatDate(event.tanggal)}</td>
												<td className="px-6 py-4 text-slate-500"><span className="flex items-center gap-2"><MapPin size={15} className="text-emerald-600" />{event.lokasi}</span></td>
												<td className="max-w-72 px-6 py-4 text-slate-500">{event.deskripsi}</td>
												<td className="px-6 py-4"><div className="flex items-center gap-2"><button type="button" aria-label={`Edit ${event.judul}`} onClick={() => openEdit(event)} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"><Edit3 size={16} /></button><button type="button" aria-label={`Hapus ${event.judul}`} onClick={() => deleteEvent(event)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button></div></td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</section>
				</div>
			</main>

			{showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={saveEvent} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{editing ? "Edit data" : "Data baru"}</p><h3 className="mt-1 text-xl font-bold text-slate-800">{editing ? "Edit Event UKS" : "Tambah Event UKS"}</h3></div><button type="button" aria-label="Tutup" onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div>{formError && <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>}<div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Judul Event<input name="judul" value={form.judul} onChange={updateForm} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700">Tanggal<input name="tanggal" type="date" value={form.tanggal} onChange={updateForm} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700">Lokasi<input name="lokasi" value={form.lokasi} onChange={updateForm} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700">URL Gambar<input name="gambar" type="url" value={form.gambar} onChange={updateForm} placeholder="https://..." className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500" /></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Deskripsi<textarea name="deskripsi" value={form.deskripsi} onChange={updateForm} required rows="4" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500" /></label></div><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={closeForm} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan Event"}</button></div></form></div>}
		</div>
	);
}
