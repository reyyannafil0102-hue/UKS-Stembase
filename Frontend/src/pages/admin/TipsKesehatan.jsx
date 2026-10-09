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
import ZoomableImage from "../../components/ZoomableImage";

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
const storageUrl = "http://127.0.0.1:8000/storage";
const getImageUrl = (gambar) => {
  if (!gambar) return "";
  if (/^https?:\/\//i.test(gambar)) return gambar;
  return `${storageUrl}/${gambar.replace(/^\/+/, "")}`;
};
const emptyForm = {
  judul: "",
  isi: "",
  gambar: "",
  detail: {
    section_title: "",
    section_body: "",
    benefits: [{ icon: "💚", title: "", description: "" }],
    steps: [""],
    reminder: "",
  },
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
  const filteredTips = useMemo(
    () =>
      tips.filter((tip) =>
        `${tip.judul} ${tip.isi}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, tips],
  );
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreviewImage(null);
    setFormError("");
    setShowForm(true);
  };
  const openEdit = (tip) => {
    setEditing(tip);
    setForm({
      judul: tip.judul || "",
      isi: tip.isi || "",
      gambar: /^https?:\/\//i.test(tip.gambar || "") ? tip.gambar : "",
      detail: {
        section_title: tip.detail?.section_title || "",
        section_body: tip.detail?.section_body || "",
        benefits: tip.detail?.benefits?.length
          ? tip.detail.benefits
          : [{ icon: "💚", title: "", description: "" }],
        steps: tip.detail?.steps?.length ? tip.detail.steps : [""],
        reminder: tip.detail?.reminder || "",
      },
    });
    setPreviewImage(tip.gambar ? getImageUrl(tip.gambar) : null);
    setFormError("");
    setShowForm(true);
  };
  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreviewImage(null);
    setFormError("");
    setShowForm(false);
  };
  const updateForm = (event) => {
    const { name, value } = event.target;
    if (name === "gambar") {
      setPreviewImage(value.trim() ? value.trim() : editing?.gambar ? getImageUrl(editing.gambar) : null);
    }
    setForm((current) => ({ ...current, [name]: value }));
  };
  const updateDetail = (field, value) => {
    setForm((current) => ({
      ...current,
      detail: { ...current.detail, [field]: value },
    }));
  };
  const updateBenefit = (index, field, value) => {
    setForm((current) => ({
      ...current,
      detail: {
        ...current.detail,
        benefits: current.detail.benefits.map((benefit, benefitIndex) =>
          benefitIndex === index ? { ...benefit, [field]: value } : benefit,
        ),
      },
    }));
  };
  const addBenefit = () => {
    setForm((current) => ({
      ...current,
      detail: {
        ...current.detail,
        benefits: [
          ...current.detail.benefits,
          { icon: "💚", title: "", description: "" },
        ],
      },
    }));
  };
  const removeBenefit = (index) => {
    setForm((current) => ({
      ...current,
      detail: {
        ...current.detail,
        benefits: current.detail.benefits.filter(
          (_, benefitIndex) => benefitIndex !== index,
        ),
      },
    }));
  };
  const updateStep = (index, value) => {
    setForm((current) => ({
      ...current,
      detail: {
        ...current.detail,
        steps: current.detail.steps.map((step, stepIndex) =>
          stepIndex === index ? value : step,
        ),
      },
    }));
  };
  const addStep = () => {
    setForm((current) => ({
      ...current,
      detail: { ...current.detail, steps: [...current.detail.steps, ""] },
    }));
  };
  const removeStep = (index) => {
    setForm((current) => ({
      ...current,
      detail: {
        ...current.detail,
        steps: current.detail.steps.filter((_, stepIndex) => stepIndex !== index),
      },
    }));
  };
  const saveTip = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const payload = { ...form };
    if (!payload.gambar) delete payload.gambar;
    payload.detail = {
      ...payload.detail,
      benefits: payload.detail.benefits.filter(
        (benefit) =>
          benefit.title.trim() || benefit.description.trim(),
      ),
      steps: payload.detail.steps.map((step) => step.trim()).filter(Boolean),
    };
    try {
      const response = editing
        ? await api.put(`/admin/tips/${editing.id}`, payload)
        : await api.post("/admin/tips", payload);
      setTips((current) =>
        editing
          ? current.map((tip) =>
              tip.id === editing.id ? response.data.tip : tip,
            )
          : [response.data.tip, ...current],
      );
      closeForm();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message || "Tips belum dapat disimpan.",
      );
    } finally {
      setSaving(false);
    }
  };
  const deleteTip = async (tip) => {
    if (!window.confirm(`Hapus tips ${tip.judul}?`)) return;
    try {
      await api.delete(`/admin/tips/${tip.id}`);
      setTips((current) => current.filter((item) => item.id !== tip.id));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Tips belum dapat dihapus.",
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
            <h1 className="text-base font-extrabold text-emerald-700">
              UKS STEMBASE
            </h1>
            <p className="text-[10px] text-slate-400">
              Sehat, Peduli, Berprestasi
            </p>
          </div>
        </div>
        <nav className="px-4 py-6">
          {menuItems.map(([label, path, Icon]) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${path === "/admin/tips" ? "bg-emerald-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
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
            <h2 className="text-2xl font-extrabold text-slate-800">
              Kelola Tips &amp; Trick
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Dashboard &gt; Tips Kesehatan
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Notifikasi"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt="Foto admin"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={19} className="text-emerald-600" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-700">
                  Hai, {user?.name || "Administrator"}
                </p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <div className="px-6 py-7 sm:px-8 lg:px-10 xl:px-12">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4">
              <Search size={18} className="text-slate-400" />
              <span className="sr-only">Cari tips</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari tips kesehatan..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <button
              type="button"
              onClick={openCreate}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={16} />
              Tambah Tips
            </button>
          </div>
          {error && (
            <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Tips Kesehatan
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Kelola informasi kesehatan untuk siswa.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {filteredTips.length} tips
              </span>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <p className="px-6 py-10 text-sm text-slate-400">
                  Memuat tips kesehatan...
                </p>
              ) : filteredTips.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Lightbulb size={30} className="mx-auto text-amber-500" />
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    Belum ada tips yang sesuai.
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      {[
                        "No",
                        "Gambar",
                        "Judul Tips",
                        "Isi Tips",
                        "Status",
                        "Aksi",
                      ].map((heading) => (
                        <th key={heading} className="px-6 py-4 font-semibold">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTips.map((tip, index) => (
                      <tr key={tip.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          {tip.gambar ? (
                            <ZoomableImage
                              src={getImageUrl(tip.gambar)}
                              alt={tip.judul}
                              className="h-11 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-16 items-center justify-center rounded-lg bg-amber-50">
                              <Lightbulb size={20} className="text-amber-500" />
                            </div>
                          )}
                        </td>
                        <td className="max-w-48 px-6 py-4 font-semibold text-slate-700">
                          {tip.judul}
                        </td>
                        <td className="max-w-72 px-6 py-4 text-slate-500">
                          {tip.isi}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Aktif
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Edit ${tip.judul}`}
                              onClick={() => openEdit(tip)}
                              className="rounded-lg bg-sky-50 p-2 text-sky-600 hover:bg-sky-100"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Hapus ${tip.judul}`}
                              onClick={() => deleteTip(tip)}
                              className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:px-6">
              Menampilkan {filteredTips.length} tips kesehatan
            </div>
          </section>
        </div>
      </main>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={saveTip}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  {editing ? "Edit data" : "Data baru"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {editing ? "Edit Tips Kesehatan" : "Tambah Tips Kesehatan"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            {formError && (
              <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}
            <label className="mt-6 block text-sm font-semibold text-slate-700">
              Judul Poster
              <input
                name="judul"
                value={form.judul}
                onChange={updateForm}
                required
                placeholder="Masukkan judul poster"
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal outline-none focus:border-emerald-500"
              />
            </label>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Isi Tips
              <textarea
                name="isi"
                value={form.isi}
                onChange={updateForm}
                required
                rows={4}
                placeholder="Masukkan penjelasan tips"
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500"
              />
            </label>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Gambar
              <input
                name="gambar"
                type="url"
                maxLength={2048}
                value={form.gambar}
                onChange={updateForm}
                placeholder="https://... (Direct link ImgBB)"
                className="mt-2 block h-11 w-full rounded-lg border border-slate-200 px-4 text-sm font-normal text-slate-700 outline-none focus:border-emerald-500"
              />
              <span className="mt-1 block text-xs font-normal text-slate-400">
                Tempel direct link gambar dari ImgBB atau layanan sejenis.
              </span>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview gambar tips"
                  className="mt-3 h-32 w-48 rounded-lg object-cover"
                />
              )}
            </label>
            <section className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Template halaman detail
                </h4>
                <p className="mt-1 text-xs font-normal text-slate-500">
                  Konten ini akan muncul saat siswa menekan kartu kiat.
                </p>
              </div>
              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Judul bagian penjelasan
                <input
                  value={form.detail.section_title}
                  onChange={(event) =>
                    updateDetail("section_title", event.target.value)
                  }
                  maxLength={255}
                  placeholder="Contoh: Mengapa Sarapan Itu Penting?"
                  className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="mt-3 block text-sm font-semibold text-slate-700">
                Penjelasan
                <textarea
                  value={form.detail.section_body}
                  onChange={(event) =>
                    updateDetail("section_body", event.target.value)
                  }
                  rows={3}
                  maxLength={10000}
                  placeholder="Jelaskan topik kiat kesehatan ini."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>

              <div className="mt-5 flex items-center justify-between gap-2">
                <h5 className="text-sm font-bold text-slate-700">
                  Kartu manfaat
                </h5>
                <button
                  type="button"
                  onClick={addBenefit}
                  disabled={form.detail.benefits.length >= 6}
                  className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-50"
                >
                  + Tambah manfaat
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {form.detail.benefits.map((benefit, index) => (
                  <div
                    key={`benefit-${index}`}
                    className="rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Manfaat {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-xs font-semibold text-red-500"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[5rem_1fr]">
                      <label className="text-xs font-medium text-slate-600">
                        Ikon
                        <input
                          value={benefit.icon}
                          onChange={(event) =>
                            updateBenefit(index, "icon", event.target.value)
                          }
                          maxLength={20}
                          placeholder="💚"
                          className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-emerald-500"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        Judul manfaat
                        <input
                          value={benefit.title}
                          onChange={(event) =>
                            updateBenefit(index, "title", event.target.value)
                          }
                          maxLength={100}
                          placeholder="Contoh: Menambah energi"
                          className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500"
                        />
                      </label>
                    </div>
                    <label className="mt-2 block text-xs font-medium text-slate-600">
                      Penjelasan manfaat
                      <textarea
                        value={benefit.description}
                        onChange={(event) =>
                          updateBenefit(index, "description", event.target.value)
                        }
                        rows={2}
                        maxLength={1000}
                        placeholder="Jelaskan manfaatnya."
                        className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-emerald-500"
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-2">
                <h5 className="text-sm font-bold text-slate-700">
                  Langkah atau saran
                </h5>
                <button
                  type="button"
                  onClick={addStep}
                  disabled={form.detail.steps.length >= 10}
                  className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-50"
                >
                  + Tambah langkah
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {form.detail.steps.map((step, index) => (
                  <div
                    key={`step-${index}`}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={step}
                      onChange={(event) => updateStep(index, event.target.value)}
                      maxLength={500}
                      placeholder={`Langkah ${index + 1}`}
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="rounded-lg px-2 py-2 text-xs font-semibold text-red-500"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                Catatan pengingat
                <textarea
                  value={form.detail.reminder}
                  onChange={(event) =>
                    updateDetail("reminder", event.target.value)
                  }
                  rows={2}
                  maxLength={1000}
                  placeholder="Contoh: Jika merasa tidak enak badan, segera lapor petugas UKS."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-emerald-500"
                />
              </label>
            </section>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Tips"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
