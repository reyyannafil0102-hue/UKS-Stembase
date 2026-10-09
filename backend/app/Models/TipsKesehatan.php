<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipsKesehatan extends Model
{
    protected $fillable = [
        'judul',
        'isi',
        'gambar',
        'detail',
    ];

    protected function casts(): array
    {
        return [
            'detail' => 'array',
        ];
    }
}
