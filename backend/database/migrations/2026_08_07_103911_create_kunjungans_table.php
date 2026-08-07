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
        Schema::create('kunjungans', function (Blueprint $table) {
            $table->id();

        // Pengguna yang berkunjung
             $table->foreignId('user_id')
              ->constrained('users')
              ->cascadeOnUpdate()
              ->cascadeOnDelete();

        // Data kunjungan
             $table->text('keluhan');
             $table->text('tindakan')->nullable();

        // Waktu masuk
             $table->dateTime('waktu_masuk');

        // Status
             $table->enum('status', ['menunggu', 'selesai'])
                 ->default('menunggu');

             $table->timestamps();
         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kunjungans');
    }
};
