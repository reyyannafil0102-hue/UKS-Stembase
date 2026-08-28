<?php

namespace App\Http\Controllers;

use App\Models\Kunjungan;
use Illuminate\Http\Request;

class KunjunganController extends Controller
{
    // Melihat kunjungan milik user yang login
    public function index(Request $request)
    {
        $kunjungans = Kunjungan::with('user:id,name,kelas')
            ->where('user_id', $request->user()->id)
            ->latest('waktu_masuk')
            ->get();

        return response()->json([
            'message' => 'Data kunjungan berhasil diambil',
            'kunjungans' => $kunjungans,
        ]);
    }

    // Melihat semua kunjungan untuk Admin
    public function adminIndex(Request $request)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $kunjungans = Kunjungan::with('user')
            ->latest('waktu_masuk')
            ->get();

        return response()->json([
            'message' => 'Data semua kunjungan berhasil diambil',
            'kunjungans' => $kunjungans,
        ]);
    }

    // Update kunjungan oleh Admin
    public function update(Request $request, $id)
    {
        // Pastikan yang mengakses adalah Admin
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'tindakan' => 'required|string',
            'status' => 'required|in:menunggu,selesai',
        ]);

        $kunjungan = Kunjungan::findOrFail($id);

        $kunjungan->update([
            'tindakan' => $request->tindakan,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Kunjungan berhasil diperbarui',
            'kunjungan' => $kunjungan,
        ]);
    }

    // Membuat kunjungan baru
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'keluhan' => 'required|string',
        ]);

        $kunjungan = Kunjungan::create([
            'user_id' => $request->user()->id,
            'nama' => $request->nama,
            'kelas' => $request->kelas,
            'keluhan' => $request->keluhan,
            'tindakan' => null,
            'waktu_masuk' => now(),
            'status' => 'menunggu',
        ]);

        return response()->json([
            'message' => 'Kunjungan berhasil dibuat',
            'kunjungan' => $kunjungan,
        ], 201);
    }
}
