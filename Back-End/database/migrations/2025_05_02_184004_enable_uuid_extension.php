<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enable uuid-ossp extension for PostgreSQL
        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Disable uuid-ossp extension (optional - may affect other tables)
        // DB::statement('DROP EXTENSION IF EXISTS "uuid-ossp"');
    }
};
