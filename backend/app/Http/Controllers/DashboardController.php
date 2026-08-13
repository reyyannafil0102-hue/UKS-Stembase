<?php

namespace App\Http\Controllers;

use App\Models\Kunjungan;
use App\Models\Obat;
use App\Models\Inventaris;
use App\Models\Event;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Hanya Admin
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        // Total seluruh kunjungan
        $totalKunjungan = Kunjungan::count();

        // Kunjungan hari ini
        $kunjunganHariIni = Kunjungan::whereDate(
            'waktu_masuk',
            today()
        )->count();

        // Kunjungan 7 hari terakhir, termasuk hari ini
        $kunjungan7Hari = Kunjungan::whereBetween(
            'waktu_masuk',
            [
                now()->subDays(6)->startOfDay(),
                now()->endOfDay(),
            ]
        )->count();

        // Total stok semua obat
        $totalJenisObat = Obat::count();

        // Total jumlah inventaris
        $totalJenisInventaris = Inventaris::count();

        // Event yang belum lewat
        $eventAktif = Event::where(
            'tanggal',
            '>=',
            now()
        )->count();

        return response()->json([
            'message' => 'Data dashboard berhasil diambil',

            'dashboard' => [
                'total_kunjungan' => $totalKunjungan,
                'kunjungan_hari_ini' => $kunjunganHariIni,
                'kunjungan_7_hari' => $kunjungan7Hari,
                'total_jenis_obat' => $totalJenisObat,
                'total_jenis_inventaris' => $totalJenisInventaris,
                'event_aktif' => $eventAktif,
            ],
        ]);
    }
}
