<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InventarisController extends Controller
{
    // Melihat semua inventaris
    public function index()
    {
        $inventaris = Inventaris::latest()->get();

        return response()->json([
            'message' => 'Data inventaris berhasil diambil',
            'inventaris' => $inventaris,
        ]);
    }

    // Admin menambahkan inventaris
    public function store(Request $request)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'jumlah' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $inventaris = Inventaris::create([
            'nama_barang' => $request->nama_barang,
			'foto' => $request->hasFile('foto') ? $request->file('foto')->store('foto-inventaris', 'public') : null,
            'jumlah' => $request->jumlah,
            'satuan' => $request->satuan,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'message' => 'Inventaris berhasil ditambahkan',
            'inventaris' => $inventaris,
        ], 201);
    }

    // Admin mengubah inventaris
    public function update(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'jumlah' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        $inventaris = Inventaris::findOrFail($id);

        $data = [
            'nama_barang' => $request->nama_barang,
            'jumlah' => $request->jumlah,
            'satuan' => $request->satuan,
            'keterangan' => $request->keterangan,
        ];

        if ($request->hasFile('foto')) {
            if ($inventaris->foto) {
                Storage::disk('public')->delete($inventaris->foto);
            }

            $data['foto'] = $request->file('foto')->store('foto-inventaris', 'public');
        }

        $inventaris->update($data);

        return response()->json([
            'message' => 'Inventaris berhasil diperbarui',
            'inventaris' => $inventaris,
        ]);
    }

    // Admin menghapus inventaris
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $inventaris = Inventaris::findOrFail($id);

        if ($inventaris->foto) {
            Storage::disk('public')->delete($inventaris->foto);
        }

        $inventaris->delete();

        return response()->json([
            'message' => 'Inventaris berhasil dihapus',
        ]);
    }
}
