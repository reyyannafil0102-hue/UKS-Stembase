<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('nama_role', 'Admin')->first();

        User::create([
            'role_id' => $adminRole->id,
            'name' => 'Admin UKS',
            'email' => 'reyyannafil0102@gmail.com',
            'password' => 'admin12345',
            'kelas' => null,
            'foto' => null,
        ]);
    }
}
