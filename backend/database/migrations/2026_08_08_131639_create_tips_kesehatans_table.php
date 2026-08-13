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
        Schema::create('tips_kesehatans', function (Blueprint $table) {
            $table->id();

            // Informasi tips kesehatan
            $table->string('judul');
            $table->text('isi');

            // Gambar pendukung, boleh kosong
            $table->string('gambar')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tips_kesehatans');
    }
};
