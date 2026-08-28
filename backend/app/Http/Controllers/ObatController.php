<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'kegunaan' => 'required|string',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $data = [
            'nama_obat' => $request->nama_obat,
            'kegunaan' => $request->kegunaan,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
            'keterangan' => $request->keterangan,
        ];

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('foto-obat', 'public');
        }

        $obat = Obat::create($data);

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
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'kegunaan' => 'required|string',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $obat = Obat::findOrFail($id);

        $data = [
            'nama_obat' => $request->nama_obat,
            'kegunaan' => $request->kegunaan,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
            'keterangan' => $request->keterangan,
        ];

        if ($request->hasFile('foto')) {
            if ($obat->foto) {
                Storage::disk('public')->delete($obat->foto);
            }
            $data['foto'] = $request->file('foto')->store('foto-obat', 'public');
        }

        $obat->update($data);

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

        if ($obat->foto) {
            Storage::disk('public')->delete($obat->foto);
        }

        $obat->delete();

        return response()->json([
            'message' => 'Obat berhasil dihapus',
        ]);
    }
}
