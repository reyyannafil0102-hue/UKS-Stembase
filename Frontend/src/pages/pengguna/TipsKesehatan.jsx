import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  HeartPulse,
  Home as HomeIcon,
  Lightbulb,
  LogOut,
  PackageSearch,
  Pill,
  User,
  X,
} from "lucide-react";
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

const storageUrl = "http://127.0.0.1:8000/storage";
const getTipImageUrl = (gambar) => {
  if (!gambar) return "";
  if (/^https?:\/\//i.test(gambar)) return gambar;
  return `${storageUrl}/${gambar.replace(/^\/+/, "")}`;
};

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
  const [selectedTip, setSelectedTip] = useState(null);

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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <HeartPulse size={27} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-emerald-700">
              UKS STEMBASE
            </h1>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Sehat, Peduli, Berprestasi
            </p>
          </div>
        </div>
        <nav className="px-4 py-6">
          {menuItems.map(({ label, path, icon: Icon }) => {
            const active = path === "/tips-kesehatan";
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${active ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 w-full border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <MobileMenu currentPath="/tips-kesehatan" onLogout={handleLogout} />

      <main className="min-h-screen lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Tips Kesehatan
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Dashboard &gt; Tips Kesehatan
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Notifikasi"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
            >
              <Bell size={21} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={21} className="text-emerald-600" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-700">
                  Hai, {user?.name || "Pengguna"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">Siswa</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
          {error && (
            <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {loading ? (
            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-400 shadow-sm">
              Memuat tips kesehatan...
            </div>
          ) : tips.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
              Belum ada tips kesehatan.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {tips.map((tip) => (
                <button
                  key={tip.id}
                  type="button"
                  onClick={() => tip.gambar && setSelectedTip(tip)}
                  disabled={!tip.gambar}
                  className="group w-full max-w-65 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                >
                  {tip.gambar ? (
                    <img
                      src={getTipImageUrl(tip.gambar)}
                      alt={tip.judul || "Poster tips kesehatan"}
                      className="aspect-3/4 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex aspect-3/4 items-center justify-center bg-slate-50">
                      <Lightbulb size={48} className="text-slate-300" />
                    </div>
                  )}
                  <div className="border-t border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {tip.judul || "Poster Tips Kesehatan"}
                    </p>
                    <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-400">
                      {tip.isi}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      {selectedTip?.gambar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Preview poster tips kesehatan"
          onClick={() => setSelectedTip(null)}
        >
          <div
            className="relative flex max-h-full max-w-4xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getTipImageUrl(selectedTip.gambar)}
              alt={selectedTip.judul || "Poster tips kesehatan"}
              className="max-h-[calc(100vh-8rem)] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Tutup preview poster"
                onClick={() => setSelectedTip(null)}
                className="rounded-lg bg-white/10 p-2.5 text-white transition hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
