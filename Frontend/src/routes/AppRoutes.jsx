import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/pengguna/Home";
import AbsensiUKS from "../pages/pengguna/AbsensiUKS";
import StokObat from "../pages/pengguna/StokObat";
import Inventaris from "../pages/pengguna/Inventaris";
import TipsKesehatan from "../pages/pengguna/TipsKesehatan";
import EventUKS from "../pages/pengguna/EventUKS";
import Profile from "../pages/pengguna/Profile";
import AdminProfile from "../pages/admin/Users";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminKunjungan from "../pages/admin/Kunjungan";
import AdminObat from "../pages/admin/Obat";
import AdminTips from "../pages/admin/TipsKesehatan";
import AdminInventaris from "../pages/admin/Inventaris";
import AdminUsers from "../pages/admin/UsersData";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Halaman awal */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Beranda User */}
        <Route
          path="/Dashboard"
          element={<Home />}
        />

        {/* Halaman Absensi UKS */}
        <Route
          path="/absensi-uks"
          element={<AbsensiUKS />}
        />

        {/* Halaman stok obat pengguna */}
        <Route
          path="/stok-obat"
          element={<StokObat />}
        />

        {/* Halaman inventaris pengguna */}
        <Route
          path="/inventaris"
          element={<Inventaris />}
        />

        {/* Halaman tips kesehatan pengguna */}
        <Route
          path="/tips-kesehatan"
          element={<TipsKesehatan />}
        />

        {/* Halaman event UKS pengguna */}
        <Route
          path="/event-uks"
          element={<EventUKS />}
        />

        {/* Profil pengguna */}
        <Route
          path="/profil"
          element={<Profile />}
        />

        {/* Profil administrator */}
        <Route
          path="/admin/profil"
          element={<AdminProfile />}
        />

        {/* Dashboard administrator */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* Data kunjungan administrator */}
        <Route
          path="/admin/kunjungan"
          element={<AdminKunjungan />}
        />

        {/* Data pengguna administrator */}
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        {/* Kelola obat administrator */}
        <Route
          path="/admin/obat"
          element={<AdminObat />}
        />

        {/* Tambah inventaris administrator */}
        <Route
          path="/admin/inventaris"
          element={<AdminInventaris />}
        />

        {/* Kelola tips kesehatan administrator */}
        <Route
          path="/admin/tips"
          element={<AdminTips />}
        />

        {/* Kalau halaman tidak ditemukan */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;