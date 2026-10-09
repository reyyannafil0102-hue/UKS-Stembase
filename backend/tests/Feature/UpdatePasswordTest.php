<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UpdatePasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_change_password_with_current_password(): void
    {
        $role = Role::create(['nama_role' => 'Pengguna']);
        $user = User::factory()->create([
            'role_id' => $role->id,
            'password' => 'old-password',
        ]);

        Sanctum::actingAs($user);

        $this->putJson('/api/user/password', [
            'current_password' => 'old-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Password berhasil diganti.');

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_user_cannot_change_password_with_an_incorrect_current_password(): void
    {
        $role = Role::create(['nama_role' => 'Pengguna']);
        $user = User::factory()->create([
            'role_id' => $role->id,
            'password' => 'old-password',
        ]);

        Sanctum::actingAs($user);

        $this->putJson('/api/user/password', [
            'current_password' => 'incorrect-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.current_password.0', 'Password lama tidak sesuai.');

        $this->assertTrue(Hash::check('old-password', $user->fresh()->password));
    }

    public function test_password_change_requires_confirmation(): void
    {
        $role = Role::create(['nama_role' => 'Pengguna']);
        $user = User::factory()->create([
            'role_id' => $role->id,
            'password' => 'old-password',
        ]);

        Sanctum::actingAs($user);

        $this->putJson('/api/user/password', [
            'current_password' => 'old-password',
            'password' => 'new-password',
            'password_confirmation' => 'different-password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }
}
