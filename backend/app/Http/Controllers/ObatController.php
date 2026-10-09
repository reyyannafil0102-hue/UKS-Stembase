<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ObatController extends Controller
{
    // Melihat semua obat
    public function index()
    {
        $obats = Obat::latest()->get();
        $isAdmin = Auth::check() && Auth::user()->role_id == 1;

        $obats = $obats->map(function ($obat) use ($isAdmin) {
            $data = $obat->toArray();

            if (! $isAdmin) {
                unset($data['keterangan']);
            }

            return $data;
        });

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

        $request->merge([
            'foto' => is_string($request->input('foto')) ? trim($request->input('foto')) : $request->input('foto'),
        ]);

        $request->validate([
            'nama_obat' => 'required|string|max:255',
            'foto' => 'nullable|url:http,https|max:2048',
            'kegunaan' => 'required|string',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
        ]);

        $data = [
            'nama_obat' => $request->nama_obat,
            'foto' => $request->input('foto'),
            'kegunaan' => $request->kegunaan,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
        ];

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

        $request->merge([
            'foto' => is_string($request->input('foto')) ? trim($request->input('foto')) : $request->input('foto'),
        ]);

        $request->validate([
            'nama_obat' => 'required|string|max:255',
            'foto' => 'nullable|url:http,https|max:2048',
            'kegunaan' => 'required|string',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:255',
        ]);

        $obat = Obat::findOrFail($id);

        $data = [
            'nama_obat' => $request->nama_obat,
            'kegunaan' => $request->kegunaan,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
        ];

        if ($request->exists('foto')) {
            if ($obat->foto && !preg_match('/^https?:\/\//i', $obat->foto)) {
                Storage::disk('public')->delete($obat->foto);
            }
            $data['foto'] = $request->input('foto');
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

        if ($obat->foto && !preg_match('/^https?:\/\//i', $obat->foto)) {
            Storage::disk('public')->delete($obat->foto);
        }

        $obat->delete();

        return response()->json([
            'message' => 'Obat berhasil dihapus',
        ]);
    }
}
