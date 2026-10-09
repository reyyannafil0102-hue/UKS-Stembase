<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'nisn')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('nisn', 20)->nullable();
            });
        }

        if (!Schema::hasColumn('users', 'alamat')) {
            Schema::table('users', function (Blueprint $table) {
                $table->text('alamat')->nullable();
            });
        }
    }

    public function down(): void
    {
        // These columns may predate this migration in existing databases.
    }
};
