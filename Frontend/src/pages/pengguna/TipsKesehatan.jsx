import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardCheck,
  Home,
  HeartPulse,
  Home as HomeIcon,
  Lightbulb,
  LogOut,
  PackageSearch,
  Pill,
  User,
} from "lucide-react";
import api from "../../services/api";
import MobileMenu from "../../components/MobileMenu";
import ImageLightbox from "../../components/ImageLightbox";

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

const tipArtworks = [
  { emoji: "🥪", background: "bg-emerald-100" },
  { emoji: "💧", background: "bg-sky-100" },
  { emoji: "😴", background: "bg-amber-100" },
  { emoji: "☀️", background: "bg-rose-100" },
];

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
  const [showPoster, setShowPoster] = useState(false);

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
  const selectedIndex = selectedTip
    ? tips.findIndex((tip) => tip.id === selectedTip.id)
    : -1;
  const selectedArtwork =
    tipArtworks[(Math.max(selectedIndex, 0)) % tipArtworks.length];
  const detail = selectedTip?.detail || {};
  const detailBenefits = (detail.benefits || []).filter(
    (benefit) => benefit.title?.trim() || benefit.description?.trim(),
  );
  const detailSteps = (detail.steps || []).filter((step) => step?.trim());

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

      <main className="min-h-screen bg-[#f3f8f5] lg:ml-64">
        <header className="flex h-16 items-center justify-between border-b border-emerald-100 bg-[#f8fbf9] px-5 sm:px-8 lg:px-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              {selectedTip?.judul || "Kiat Kesehatan"}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <Home size={11} />
              Beranda <span className="text-emerald-500">›</span>{" "}
              <button
                type="button"
                onClick={() => setSelectedTip(null)}
                className="hover:text-emerald-700"
              >
                Kiat Kesehatan
              </button>
              {selectedTip && (
                <>
                  <span className="text-emerald-500">›</span>
                  <span className="max-w-40 [overflow-wrap:anywhere] text-slate-500">
                    {selectedTip.judul}
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-sm font-bold text-white">
                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user?.name || "A").charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-700">
                  {user?.name || "Pengguna"}
                </p>
                <p className="text-[10px] text-slate-400">Siswa</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 py-5 sm:px-8 lg:px-10">
          {selectedTip ? (
            <>
              <button
                type="button"
                onClick={() => setSelectedTip(null)}
                className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                ← Kembali ke kiat kesehatan
              </button>
              <article className="w-full overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
                <section className="grid sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                  <div
                    className={`flex h-52 items-center justify-center sm:h-64 ${selectedArtwork.background}`}
                  >
                    {selectedTip.gambar ? (
                      <button
                        type="button"
                        onClick={() => setShowPoster(true)}
                        aria-label={`Lihat poster ${selectedTip.judul}`}
                        title="Tekan untuk melihat poster"
                        className="group relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 sm:h-44 sm:w-44"
                      >
                        <img
                          src={getTipImageUrl(selectedTip.gambar)}
                          alt={selectedTip.judul || "Thumbnail poster kiat"}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-xs font-semibold text-white opacity-0 transition group-hover:bg-slate-950/35 group-hover:opacity-100">
                          Lihat poster
                        </span>
                      </button>
                    ) : (
                      <span aria-hidden="true" className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-white text-7xl shadow-lg sm:h-44 sm:w-44">
                        {selectedArtwork.emoji}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-7">
                    <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                      ♥ Kiat Kesehatan
                    </span>
                    <h1 className="mt-3 [overflow-wrap:anywhere] text-xl font-extrabold text-slate-800 sm:text-2xl">
                      {selectedTip.judul || "Kiat Kesehatan"}
                    </h1>
                    <p className="mt-2 whitespace-pre-line [overflow-wrap:anywhere] text-xs leading-relaxed text-slate-500">
                      {selectedTip.isi}
                    </p>
                  </div>
                </section>

                <div className="space-y-5 p-5 sm:p-7 lg:p-8">
                  {(detail.section_title?.trim() || detail.section_body?.trim()) && (
                    <section>
                      <h2 className="[overflow-wrap:anywhere] text-sm font-bold text-slate-800">
                        {detail.section_title || "Mengapa Ini Penting?"}
                      </h2>
                      <p className="mt-2 whitespace-pre-line [overflow-wrap:anywhere] text-sm leading-6 text-slate-600">
                        {detail.section_body}
                      </p>
                    </section>
                  )}

                  {detailBenefits.length > 0 && (
                    <section>
                      <h2 className="mb-2 text-sm font-bold text-slate-800">
                        Manfaat
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {detailBenefits.map((benefit, index) => (
                          <article
                            key={`${benefit.title}-${index}`}
                            className="rounded-lg border border-emerald-100 bg-[#f3f8f5] p-3"
                          >
                            <span aria-hidden="true" className="text-base">
                              {benefit.icon || "💚"}
                            </span>
                            {benefit.title && (
                              <h3 className="mt-1 [overflow-wrap:anywhere] text-xs font-bold text-slate-800">
                                {benefit.title}
                              </h3>
                            )}
                            {benefit.description && (
                              <p className="mt-1 [overflow-wrap:anywhere] text-[11px] leading-relaxed text-slate-500">
                                {benefit.description}
                              </p>
                            )}
                          </article>
                        ))}
                      </div>
                    </section>
                  )}

                  {detailSteps.length > 0 && (
                    <section>
                      <h2 className="mb-2 text-sm font-bold text-slate-800">
                        Langkah-Langkah
                      </h2>
                      <ol className="space-y-2 text-sm leading-relaxed text-slate-600">
                        {detailSteps.map((step, index) => (
                          <li
                            key={`${step}-${index}`}
                            className="flex items-start gap-2"
                          >
                            <span className="font-semibold text-emerald-700">
                              {index + 1}.
                            </span>
                            <span className="[overflow-wrap:anywhere]">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}

                  {detail.reminder && (
                    <aside className="rounded-lg bg-emerald-50 px-3 py-2.5 [overflow-wrap:anywhere] text-[11px] leading-relaxed text-emerald-800">
                      <span className="font-bold">♥ Ingat!</span>{" "}
                      {detail.reminder}
                    </aside>
                  )}
                </div>
              </article>
            </>
          ) : (
            <>
          <section className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <h3 className="text-sm font-bold text-emerald-800">
              💚 Kiat Sehat untuk Siswa
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Kebiasaan sederhana sehari-hari dapat membantu menjaga tubuh tetap
              sehat dan siap mengikuti kegiatan di sekolah.
            </p>
          </section>

          {error && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-400">
              Memuat kiat kesehatan...
            </div>
          ) : tips.length === 0 ? (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-400">
              Belum ada kiat kesehatan.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {tips.map((tip, index) => {
                const artwork = tipArtworks[index % tipArtworks.length];

                return (
                  <button
                    key={tip.id}
                    type="button"
                    onClick={() => setSelectedTip(tip)}
                    className="group overflow-hidden rounded-xl border border-emerald-100 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      className={`flex h-28 items-center justify-center overflow-hidden ${artwork.background}`}
                    >
                      {tip.gambar ? (
                        <img
                          src={getTipImageUrl(tip.gambar)}
                          alt=""
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="text-5xl drop-shadow-sm transition duration-300 group-hover:scale-110"
                        >
                          {artwork.emoji}
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="text-[9px] font-extrabold uppercase tracking-wide text-emerald-600">
                        Kiat {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 [overflow-wrap:anywhere] text-xs font-bold text-slate-800">
                        {tip.judul || "Kiat Kesehatan"}
                      </h3>
                      <p className="mt-1 min-h-10 [overflow-wrap:anywhere] text-[10px] leading-relaxed text-slate-500">
                        {tip.isi}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <aside className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2.5 text-[10px] leading-relaxed text-slate-500">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50">
              💡
            </span>
            <p>
              <span className="font-bold text-emerald-700">Ingat!</span> Kalau
              tubuh terasa kurang sehat, jangan memaksakan diri. Segera
              beristirahat dan laporkan kepada guru atau petugas UKS.
            </p>
          </aside>
            </>
          )}
        </div>
      </main>
      {showPoster && selectedTip?.gambar && (
        <ImageLightbox
          src={getTipImageUrl(selectedTip.gambar)}
          alt={selectedTip.judul || "Poster kiat kesehatan"}
          onClose={() => setShowPoster(false)}
        />
      )}
    </div>
  );
}
