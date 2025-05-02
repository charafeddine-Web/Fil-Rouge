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
        // Make sure the table exists before trying to add indexes
        if (Schema::hasTable('ch_messages')) {
            // Add indexes using DB-agnostic approach
            try {
                Schema::table('ch_messages', function (Blueprint $table) {
                    // Add individual indexes for from_id and to_id
                    $table->index('from_id', 'ch_messages_from_id_idx');
                    $table->index('to_id', 'ch_messages_to_id_idx');
                });
            } catch (\Exception $e) {
                // Index might already exist, which is fine
                \Log::info('Error adding individual indexes: ' . $e->getMessage());
            }
        } else {
            // Create the table if it doesn't exist (this shouldn't happen as Chatify should create it)
            Schema::create('ch_messages', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->bigInteger('from_id')->index('ch_messages_from_id_idx');
                $table->bigInteger('to_id')->index('ch_messages_to_id_idx');
                $table->string('body', 5000)->nullable();
                $table->string('attachment', 255)->nullable();
                $table->boolean('seen')->default(false);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('ch_messages')) {
            try {
                Schema::table('ch_messages', function (Blueprint $table) {
                    $table->dropIndex('ch_messages_from_id_idx');
                    $table->dropIndex('ch_messages_to_id_idx');
                });
            } catch (\Exception $e) {
                // If indexes don't exist, that's fine
                \Log::info('Error dropping indexes: ' . $e->getMessage());
            }
        }
    }
};
