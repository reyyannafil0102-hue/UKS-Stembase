import { CalendarDays, ClipboardCheck, HeartPulse, Home as HomeIcon, Lightbulb, LogOut, Menu, PackageSearch, Pill, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
	{ label: "Dashboard", path: "/Dashboard", icon: HomeIcon },
	{ label: "Absensi UKS", path: "/absensi-uks", icon: ClipboardCheck },
	{ label: "Stok Obat", path: "/stok-obat", icon: Pill },
	{ label: "Inventaris", path: "/inventaris", icon: PackageSearch },
	{ label: "Tips Kesehatan", path: "/tips-kesehatan", icon: Lightbulb },
	{ label: "Event UKS", path: "/event-uks", icon: CalendarDays },
	{ label: "Profil Saya", path: "/profil", icon: User },
];

export default function MobileMenu({ currentPath, onLogout }) {
	const navigate = useNavigate();

	return (
		<details className="fixed right-4 top-4 z-50 lg:hidden">
			<summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg [&::-webkit-details-marker]:hidden" aria-label="Buka menu navigasi">
				<Menu size={21} />
			</summary>
			<div className="absolute right-0 top-14 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
				<div className="mb-3 flex items-center gap-2 border-b border-slate-100 px-3 pb-3 text-sm font-extrabold text-emerald-700"><HeartPulse size={18} />UKS STEMBASE</div>
				<nav>
					{menuItems.map(({ label, path, icon: Icon }) => <button key={path} type="button" onClick={() => navigate(path)} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${currentPath === path ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}><Icon size={17} />{label}</button>)}
					<button type="button" onClick={onLogout} className="mt-2 flex w-full items-center gap-3 border-t border-slate-100 px-3 pt-3 text-left text-sm font-medium text-red-500"><LogOut size={17} />Logout</button>
				</nav>
			</div>
		</details>
	);
}
