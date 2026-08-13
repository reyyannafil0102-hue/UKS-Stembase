<?php

namespace App\Models;

use App\Models\Kunjungan;
use App\Models\Role;
use Laravel\Sanctum\HasApiTokens;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;

#[Fillable([
    'role_id',
    'name',
    'email',
    'password',
    'kelas',
    'foto',
])]

#[Hidden([
    'password',
    'remember_token',
])]

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    // User memiliki satu Role
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    // User dapat memiliki banyak kunjungan
    public function kunjungans(): HasMany
    {
        return $this->hasMany(Kunjungan::class);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
