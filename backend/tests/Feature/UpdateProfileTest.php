<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UpdateProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_profile_update_saves_and_returns_all_profile_fields(): void
    {
        $role = Role::create(['nama_role' => 'Pengguna']);
        $user = User::factory()->create([
            'role_id' => $role->id,
            'name' => 'Nama Lama',
            'kelas' => 'Kelas Lama',
        ]);

        Sanctum::actingAs($user);

        $this->putJson('/api/user/profile', [
            'name' => 'Nama Baru',
            'email' => $user->email,
            'kelas' => 'XII Sija 1',
            'nisn' => '1234567890',
            'alamat' => 'Jl. Pendidikan No. 10',
        ])
            ->assertOk()
            ->assertJsonPath('user.name', 'Nama Baru')
            ->assertJsonPath('user.kelas', 'XII Sija 1')
            ->assertJsonPath('user.nisn', '1234567890')
            ->assertJsonPath('user.alamat', 'Jl. Pendidikan No. 10');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nama Baru',
            'kelas' => 'XII Sija 1',
            'nisn' => '1234567890',
            'alamat' => 'Jl. Pendidikan No. 10',
        ]);
    }
}
