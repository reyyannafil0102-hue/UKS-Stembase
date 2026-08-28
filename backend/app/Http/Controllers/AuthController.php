<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    // ==========================
    // REGISTER
    // ==========================

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'kelas' => 'nullable|string|max:50',
        ]);

        $penggunaRole = Role::where('nama_role', 'Pengguna')->firstOrFail();

        $user = User::create([
            'role_id' => $penggunaRole->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'kelas' => $request->kelas,
            'foto' => null,
        ]);

        // Kirim email verifikasi
        event(new Registered($user));

        return response()->json([
            'message' => 'Akun berhasil dibuat. Silakan cek email untuk verifikasi.',
            'user' => $user,
        ], 201);
    }


    // ==========================
    // LOGIN
    // ==========================

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with('role')
            ->where('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah',
            ], 401);
        }

        // Wajib verifikasi email sebelum login
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Silakan verifikasi email terlebih dahulu.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user,
        ]);
    }


    // ==========================
    // UPDATE PROFILE
    // ==========================

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'kelas' => 'nullable|string|max:50',
        ]);

        // Simpan email lama
        $emailLama = $user->email;

        // Email baru
        $emailBaru = $request->email;

        // Cek apakah email berubah
        $emailBerubah = $emailLama !== $emailBaru;

        // Update data dasar
        $user->name = $request->name;
        $user->kelas = $request->kelas;

        if ($emailBerubah) {

            // Ganti email
            $user->email = $emailBaru;

            // RESET STATUS VERIFIKASI
            $user->email_verified_at = null;
        }

        // Simpan ke database
        $user->save();

        // Kalau email berubah,
        // kirim email verifikasi ke email baru
        if ($emailBerubah) {
            $user->sendEmailVerificationNotification();
        }

        return response()->json([
            'message' => $emailBerubah
                ? 'Email berhasil diganti. Silakan verifikasi email baru Anda.'
                : 'Profil berhasil diperbarui.',

            'user' => $user->fresh()->load('role'),
        ]);
    }


    // ==========================
    // UPLOAD / GANTI FOTO
    // ==========================

    public function uploadFoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $request->user();

        // Hapus foto lama jika ada
        if ($user->foto) {

            $oldPath = storage_path(
                'app/public/' . $user->foto
            );

            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        // Simpan foto baru
        $path = $request->file('foto')
            ->store('foto-user', 'public');

        // Simpan path ke database
        $user->update([
            'foto' => $path,
        ]);

        return response()->json([
            'message' => 'Foto profil berhasil diupload',
            'user' => $user->fresh()->load('role'),
        ]);
    }


    // ==========================
    // HAPUS FOTO
    // ==========================

    public function deleteFoto(Request $request)
    {
        $user = $request->user();

        if ($user->foto) {

            $path = storage_path(
                'app/public/' . $user->foto
            );

            if (file_exists($path)) {
                unlink($path);
            }

            $user->update([
                'foto' => null,
            ]);
        }

        return response()->json([
            'message' => 'Foto profil berhasil dihapus',
            'user' => $user->fresh()->load('role'),
        ]);
    }


    // ==========================
    // RESEND EMAIL VERIFIKASI
    // ==========================

    public function resendVerificationPublic(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && !$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
        }

        return response()->json([
            'message' => 'Jika email terdaftar dan belum diverifikasi, email verifikasi akan dikirim ulang.',
        ]);
    }

    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email sudah diverifikasi.',
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Email verifikasi berhasil dikirim ulang.',
        ]);
    }


    // ==========================
    // LOGOUT
    // ==========================

    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}
