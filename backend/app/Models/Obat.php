<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    protected $fillable = [
        'nama_obat',
        'kegunaan',
        'stok',
        'satuan',
        'keterangan',
    ];
}
