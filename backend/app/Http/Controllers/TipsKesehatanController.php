<?php

namespace App\Http\Controllers;

use App\Models\TipsKesehatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TipsKesehatanController extends Controller
{
    // Melihat semua tips kesehatan
    public function index()
    {
        $tips = TipsKesehatan::latest()->get();

        return response()->json([
            'message' => 'Data tips kesehatan berhasil diambil',
            'tips' => $tips,
        ]);
    }

    // Admin menambahkan tips kesehatan
    public function store(Request $request)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $tip = TipsKesehatan::create([
            'judul' => $request->judul,
            'isi' => $request->isi,
            'gambar' => $request->hasFile('gambar') ? $request->file('gambar')->store('gambar-tips', 'public') : null,
        ]);

        return response()->json([
            'message' => 'Tips kesehatan berhasil ditambahkan',
            'tip' => $tip,
        ], 201);
    }

    // Admin mengubah tips kesehatan
    public function update(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $tip = TipsKesehatan::findOrFail($id);

        $data = [
            'judul' => $request->judul,
            'isi' => $request->isi,
        ];

        if ($request->hasFile('gambar')) {
            if ($tip->gambar && !str_starts_with($tip->gambar, 'http')) {
                Storage::disk('public')->delete($tip->gambar);
            }

            $data['gambar'] = $request->file('gambar')->store('gambar-tips', 'public');
        }

        $tip->update($data);

        return response()->json([
            'message' => 'Tips kesehatan berhasil diperbarui',
            'tip' => $tip,
        ]);
    }

    // Admin menghapus tips kesehatan
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $tip = TipsKesehatan::findOrFail($id);

        if ($tip->gambar && !str_starts_with($tip->gambar, 'http')) {
            Storage::disk('public')->delete($tip->gambar);
        }

        $tip->delete();

        return response()->json([
            'message' => 'Tips kesehatan berhasil dihapus',
        ]);
    }
}
