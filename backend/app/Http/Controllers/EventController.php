<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // Melihat semua event
    public function index()
    {
        $events = Event::latest('tanggal')->get();

        return response()->json([
            'message' => 'Data event berhasil diambil',
            'events' => $events,
        ]);
    }

    // Admin menambahkan event
    public function store(Request $request)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:255',
            'gambar' => 'nullable|string|max:255',
        ]);

        $event = Event::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal' => $request->tanggal,
            'lokasi' => $request->lokasi,
            'gambar' => $request->gambar,
        ]);

        return response()->json([
            'message' => 'Event berhasil ditambahkan',
            'event' => $event,
        ], 201);
    }

    // Admin mengubah event
    public function update(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:255',
            'gambar' => 'nullable|string|max:255',
        ]);

        $event = Event::findOrFail($id);

        $event->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal' => $request->tanggal,
            'lokasi' => $request->lokasi,
            'gambar' => $request->gambar,
        ]);

        return response()->json([
            'message' => 'Event berhasil diperbarui',
            'event' => $event,
        ]);
    }

    // Admin menghapus event
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $event = Event::findOrFail($id);

        $event->delete();

        return response()->json([
            'message' => 'Event berhasil dihapus',
        ]);
    }
}
