<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('obats', function (Blueprint $table) {
        $table->id();

        // Informasi obat
        $table->string('nama_obat');
        $table->text('kegunaan');

        // Stok
        $table->integer('stok');
        $table->string('satuan');

        // Keterangan tambahan
        $table->text('keterangan')->nullable();

        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obats');
    }
};
