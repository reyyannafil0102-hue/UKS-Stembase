<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tips_kesehatans', function (Blueprint $table) {
            $table->json('detail')->nullable()->after('gambar');
        });
    }

    public function down(): void
    {
        Schema::table('tips_kesehatans', function (Blueprint $table) {
            $table->dropColumn('detail');
        });
    }
};
