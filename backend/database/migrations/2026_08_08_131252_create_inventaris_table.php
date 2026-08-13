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
    Schema::create('inventaris', function (Blueprint $table) {
        $table->id();

        // Data inventaris
        $table->string('nama_barang');
        $table->integer('jumlah');
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
        Schema::dropIfExists('inventaris');
    }
};
