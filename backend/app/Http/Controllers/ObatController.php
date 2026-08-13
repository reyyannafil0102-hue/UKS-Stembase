<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;

class ObatController extends Controller
{
    // Melihat semua obat
    public function index()
    {
        $obats = Obat::latest()->get();

        return response()->json([
            'message' => 'Data obat berhasil diambil',
            'obats' => $obats,
        ]);
    }

    // Admin menambahkan obat
    public function store(Request $request)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'nama_obat' => 'required|string|max:255',
            'kegunaan' => 'required|string',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $obat = Obat::create([
            'nama_obat' => $request->nama_obat,
            'kegunaan' => $request->kegunaan,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'message' => 'Obat berhasil ditambahkan',
            'obat' => $obat,
        ], 201);
    }

    // Admin mengubah obat
    public function update(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'nama_obat' => 'required|string|max:255',
            'kegunaan' => 'required|string',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $obat = Obat::findOrFail($id);

        $obat->update([
            'nama_obat' => $request->nama_obat,
            'kegunaan' => $request->kegunaan,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'message' => 'Obat berhasil diperbarui',
            'obat' => $obat,
        ]);
    }

    // Admin menghapus obat
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $obat = Obat::findOrFail($id);

        $obat->delete();

        return response()->json([
            'message' => 'Obat berhasil dihapus',
        ]);
    }
}
