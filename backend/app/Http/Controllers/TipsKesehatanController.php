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

        $request->merge([
            'gambar' => is_string($request->input('gambar')) ? trim($request->input('gambar')) : $request->input('gambar'),
        ]);

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|url:http,https|max:2048',
            'detail' => 'nullable|array',
            'detail.section_title' => 'nullable|string|max:255',
            'detail.section_body' => 'nullable|string|max:10000',
            'detail.benefits' => 'nullable|array|max:6',
            'detail.benefits.*.icon' => 'nullable|string|max:20',
            'detail.benefits.*.title' => 'required|string|max:100',
            'detail.benefits.*.description' => 'required|string|max:1000',
            'detail.steps' => 'nullable|array|max:10',
            'detail.steps.*' => 'required|string|max:500',
            'detail.reminder' => 'nullable|string|max:1000',
        ]);

        $tip = TipsKesehatan::create([
            'judul' => $request->judul,
            'isi' => $request->isi,
            'gambar' => $request->input('gambar'),
            'detail' => $request->input('detail'),
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

        $request->merge([
            'gambar' => is_string($request->input('gambar')) ? trim($request->input('gambar')) : $request->input('gambar'),
        ]);

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|url:http,https|max:2048',
            'detail' => 'nullable|array',
            'detail.section_title' => 'nullable|string|max:255',
            'detail.section_body' => 'nullable|string|max:10000',
            'detail.benefits' => 'nullable|array|max:6',
            'detail.benefits.*.icon' => 'nullable|string|max:20',
            'detail.benefits.*.title' => 'required|string|max:100',
            'detail.benefits.*.description' => 'required|string|max:1000',
            'detail.steps' => 'nullable|array|max:10',
            'detail.steps.*' => 'required|string|max:500',
            'detail.reminder' => 'nullable|string|max:1000',
        ]);

        $tip = TipsKesehatan::findOrFail($id);

        $data = [
            'judul' => $request->judul,
            'isi' => $request->isi,
        ];

        if ($request->exists('gambar')) {
            if ($tip->gambar && !preg_match('/^https?:\/\//i', $tip->gambar)) {
                Storage::disk('public')->delete($tip->gambar);
            }
            $data['gambar'] = $request->input('gambar');
        }

        if ($request->exists('detail')) {
            $data['detail'] = $request->input('detail');
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

        if ($tip->gambar && !preg_match('/^https?:\/\//i', $tip->gambar)) {
            Storage::disk('public')->delete($tip->gambar);
        }

        $tip->delete();

        return response()->json([
            'message' => 'Tips kesehatan berhasil dihapus',
        ]);
    }
}
