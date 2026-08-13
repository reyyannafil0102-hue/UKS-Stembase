<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'judul',
        'deskripsi',
        'tanggal',
        'lokasi',
        'gambar',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
    ];
}
