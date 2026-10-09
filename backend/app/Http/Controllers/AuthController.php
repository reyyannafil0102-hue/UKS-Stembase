<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function sendPasswordResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if (!in_array($status, [
            Password::RESET_LINK_SENT,
            Password::INVALID_USER,
            Password::RESET_THROTTLED,
        ], true)) {
            return response()->json([
                'message' => 'Email reset password belum dapat dikirim. Silakan coba lagi.',
            ], 500);
        }

        return response()->json([
            'message' => 'Jika email terdaftar, tautan untuk mengatur ulang password akan dikirim.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $validated,
            function ($user, string $password) {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Tautan reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.',
            ], 422);
        }

        return response()->json([
            'message' => 'Password berhasil diatur ulang. Silakan login dengan password baru.',
        ]);
    }

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

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'kelas' => 'nullable|string|max:50',
            'nisn' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:1000',
        ]);

        // Simpan email lama
        $emailLama = $user->email;

        // Email baru
        $emailBaru = $validated['email'];

        // Cek apakah email berubah
        $emailBerubah = $emailLama !== $emailBaru;

        // Update data dasar
        $user->name = $validated['name'];
        $user->kelas = $validated['kelas'] ?? null;
        if (array_key_exists('nisn', $validated)) {
            $user->nisn = $validated['nisn'];
        }
        if (array_key_exists('alamat', $validated)) {
            $user->alamat = $validated['alamat'];
        }

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

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Password lama tidak sesuai.',
                'errors' => [
                    'current_password' => ['Password lama tidak sesuai.'],
                ],
            ], 422);
        }

        $user->password = $validated['password'];
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diganti.',
        ]);
    }


    // ==========================
    // GANTI FOTO PROFIL DENGAN URL
    // ==========================

    public function uploadFoto(Request $request)
    {
        $request->merge([
            'foto' => is_string($request->input('foto')) ? trim($request->input('foto')) : $request->input('foto'),
        ]);

        $request->validate([
            'foto' => 'required|url:http,https|max:2048',
        ]);

        $user = $request->user();

        if ($user->foto && !preg_match('/^https?:\/\//i', $user->foto)) {
            Storage::disk('public')->delete($user->foto);
        }

        $user->update([
            'foto' => $request->input('foto'),
        ]);

        return response()->json([
            'message' => 'URL foto profil berhasil diperbarui',
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
            if (!preg_match('/^https?:\/\//i', $user->foto)) {
                Storage::disk('public')->delete($user->foto);
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
