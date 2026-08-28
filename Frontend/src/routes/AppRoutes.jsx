import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/pengguna/Home";
import AbsensiUKS from "../pages/pengguna/AbsensiUKS";
import StokObat from "../pages/pengguna/StokObat";
import Inventaris from "../pages/pengguna/Inventaris";
import TipsKesehatan from "../pages/pengguna/TipsKesehatan";
import EventUKS from "../pages/pengguna/EventUKS";

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