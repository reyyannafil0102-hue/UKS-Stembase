<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Melihat semua user
    public function index(Request $request)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $users = User::with('role')
            ->select('id', 'role_id', 'name', 'email', 'kelas', 'foto', 'created_at')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Data pengguna berhasil diambil',
            'users' => $users,
        ]);
    }

    // Melihat detail user
    public function show(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $user = User::with('role')
            ->select('id', 'role_id', 'name', 'email', 'kelas', 'foto', 'created_at')
            ->findOrFail($id);

        return response()->json([
            'message' => 'Data pengguna berhasil diambil',
            'user' => $user,
        ]);
    }

    // Mengubah role user
    public function updateRole(Request $request, $id)
    {
        if ($request->user()->role_id != 1) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin',
            ], 403);
        }

        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($id);

        // Admin tidak boleh mengubah role dirinya sendiri
        if ($user->id == $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak dapat mengubah role akun sendiri',
            ], 403);
        }

        $user->update([
            'role_id' => $request->role_id,
        ]);

        $user->load('role');

        return response()->json([
            'message' => 'Role pengguna berhasil diperbarui',
            'user' => $user,
        ]);
    }
}
