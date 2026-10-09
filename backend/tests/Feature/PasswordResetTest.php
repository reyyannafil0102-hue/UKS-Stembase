<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_reset_link_is_sent_for_registered_email(): void
    {
        $role = Role::create(['nama_role' => 'Pengguna']);
        $user = User::factory()->create(['role_id' => $role->id]);
        Notification::fake();

        $this->postJson('/api/forgot-password', ['email' => $user->email])
            ->assertOk()
            ->assertJsonPath(
                'message',
                'Jika email terdaftar, tautan untuk mengatur ulang password akan dikirim.'
            );

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_password_reset_request_does_not_reveal_unknown_email(): void
    {
        Notification::fake();

        $this->postJson('/api/forgot-password', ['email' => 'unknown@example.test'])
            ->assertOk()
            ->assertJsonPath(
                'message',
                'Jika email terdaftar, tautan untuk mengatur ulang password akan dikirim.'
            );

        Notification::assertNothingSent();
    }

    public function test_valid_reset_token_updates_password_and_revokes_access_tokens(): void
    {
        $role = Role::create(['nama_role' => 'Pengguna']);
        $user = User::factory()->create([
            'role_id' => $role->id,
            'password' => 'old-password',
        ]);
        $user->createToken('existing-session');
        $token = Password::createToken($user);
        Sanctum::actingAs($user);

        $this->postJson('/api/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
            ->assertOk()
            ->assertJsonPath(
                'message',
                'Password berhasil diatur ulang. Silakan login dengan password baru.'
            );

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
