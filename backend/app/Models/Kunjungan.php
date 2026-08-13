<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Kunjungan extends Model
{
    protected $fillable = [
        'user_id',
        'keluhan',
        'tindakan',
        'waktu_masuk',
        'status',
    ];

    protected $casts = [
        'waktu_masuk' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
