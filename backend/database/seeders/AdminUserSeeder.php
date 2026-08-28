<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('nama_role', 'Admin')->first();

        User::create([
            'role_id' => $adminRole->id,
            'name' => 'Admin UKS',
            'email' => 'reyyannafil0102@gmail.com',
            'password' => Hash::make('admin12345'),
            'kelas' => null,
            'foto' => null,
        ]);
    }
}
