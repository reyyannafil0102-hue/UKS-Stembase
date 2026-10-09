<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminRolesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_retrieve_roles_for_user_management(): void
    {
        $adminRole = Role::create(['nama_role' => 'Admin']);
        Role::create(['nama_role' => 'Pengguna']);
        $admin = User::factory()->create(['role_id' => $adminRole->id]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/roles')
            ->assertOk()
            ->assertJsonPath('roles.0.nama_role', 'Admin')
            ->assertJsonPath('roles.1.nama_role', 'Pengguna');
    }

    public function test_non_admin_cannot_retrieve_roles(): void
    {
        Role::create(['nama_role' => 'Admin']);
        $userRole = Role::create(['nama_role' => 'Pengguna']);
        $user = User::factory()->create(['role_id' => $userRole->id]);

        Sanctum::actingAs($user);

        $this->getJson('/api/admin/roles')
            ->assertForbidden()
            ->assertJsonPath('message', 'Akses hanya untuk Admin');
    }
}
