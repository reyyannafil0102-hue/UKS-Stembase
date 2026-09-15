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
  Search,
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

const getInventoryImageUrl = (foto) => {
  if (!foto) return "";
  if (/^https?:\/\//i.test(foto)) return foto;
  return `${storageUrl}/${foto.replace(/^\/+/, "")}`;
};

export default function Inventaris() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadInventaris = async () => {
      try {
        const response = await api.get("/inventaris");
        setItems(response.data.inventaris || []);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        setError("Data inventaris belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    };

    void loadInventaris();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredItems = items.filter((item) =>
    item.nama_barang.toLowerCase().includes(search.toLowerCase()),
  );

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
            const active = path === "/inventaris";
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
      <MobileMenu currentPath="/inventaris" onLogout={handleLogout} />

      <main className="min-h-screen lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-8 lg:px-10">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Inventaris
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Dashboard &gt; Inventaris
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Search size={18} className="shrink-0 text-slate-400" />
              <span className="sr-only">Cari nama barang</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama barang..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>
          {error && (
            <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {loading ? (
            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-400 shadow-sm">
              Memuat inventaris...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
              Tidak ada inventaris yang sesuai.
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      {[
                        "No",
                        "Foto",
                        "Nama Barang",
                        "Keterangan",
                        "Jumlah",
                        "Satuan",
                      ].map((heading) => (
                        <th key={heading} className="px-5 py-4 font-semibold">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-5 py-3">
                          {item.foto ? (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedImage({
                                  src: getInventoryImageUrl(item.foto),
                                  alt: item.nama_barang,
                                })
                              }
                              className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-emerald-400"
                              aria-label={`Perbesar foto ${item.nama_barang}`}
                            >
                              <img
                                src={getInventoryImageUrl(item.foto)}
                                alt={item.nama_barang}
                                className="h-full w-full object-contain"
                              />
                            </button>
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-50">
                              <PackageSearch
                                size={28}
                                className="text-emerald-600"
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-700">
                          {item.nama_barang}
                        </td>
                        <td className="max-w-md px-5 py-4 text-slate-500">
                          {item.keterangan || "-"}
                        </td>
                        <td
                          className={`px-5 py-4 text-base font-bold ${item.jumlah > 0 ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {item.jumlah}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {item.satuan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
            Total jenis inventaris tersedia:{" "}
            <span className="font-bold text-emerald-600">
              {filteredItems.length} jenis
            </span>
          </div>
        </div>
      </main>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-5"
          role="presentation"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] rounded-xl bg-white p-3 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ${selectedImage.alt}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Tutup foto"
              onClick={() => setSelectedImage(null)}
              className="absolute right-2 top-2 z-10 rounded-full bg-slate-900/70 p-2 text-white hover:bg-slate-900"
            >
              <X size={18} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[84vh] max-w-[85vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
