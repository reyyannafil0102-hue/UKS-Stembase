<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('foto')->nullable()->change();
        });

        Schema::table('obats', function (Blueprint $table) {
            $table->text('foto')->nullable()->change();
        });

        Schema::table('inventaris', function (Blueprint $table) {
            $table->text('foto')->nullable()->change();
        });

        Schema::table('tips_kesehatans', function (Blueprint $table) {
            $table->text('gambar')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('foto')->nullable()->change();
        });

        Schema::table('obats', function (Blueprint $table) {
            $table->string('foto')->nullable()->change();
        });

        Schema::table('inventaris', function (Blueprint $table) {
            $table->string('foto')->nullable()->change();
        });

        Schema::table('tips_kesehatans', function (Blueprint $table) {
            $table->string('gambar')->nullable()->change();
        });
    }
};
