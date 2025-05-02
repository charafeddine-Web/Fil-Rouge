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
        // Check if ch_messages table exists, if not create it
        if (!Schema::hasTable('ch_messages')) {
            Schema::create('ch_messages', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->bigInteger('from_id');
                $table->bigInteger('to_id');
                $table->string('body', 5000)->nullable();
                $table->string('attachment', 255)->nullable();
                $table->boolean('seen')->default(false);
                $table->timestamps();
                
                // Add indexes for better query performance
                $table->index('from_id');
                $table->index('to_id');
                $table->index(['from_id', 'to_id']);
                $table->index(['to_id', 'from_id']);
            });
        } else {
            // If the table exists, check if indexes exist and add them if they don't
            Schema::table('ch_messages', function (Blueprint $table) {
                // Check and add indexes for better performance
                if (!Schema::hasIndex('ch_messages', 'ch_messages_from_id_index')) {
                    $table->index('from_id');
                }
                if (!Schema::hasIndex('ch_messages', 'ch_messages_to_id_index')) {
                    $table->index('to_id');
                }
                if (!Schema::hasIndex('ch_messages', 'ch_messages_from_id_to_id_index')) {
                    $table->index(['from_id', 'to_id']);
                }
                if (!Schema::hasIndex('ch_messages', 'ch_messages_to_id_from_id_index')) {
                    $table->index(['to_id', 'from_id']);
                }
            });
        }
        
        // Create the passagers table if it doesn't exist
        if (!Schema::hasTable('passagers')) {
            Schema::create('passagers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->timestamps();
            });
        }
        
        // Create the conducteurs table if it doesn't exist
        if (!Schema::hasTable('conducteurs')) {
            Schema::create('conducteurs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('num_permis')->nullable();
                $table->boolean('disponibilite')->default(true);
                $table->decimal('note_moyenne', 3, 1)->default(0);
                $table->string('adresse')->nullable();
                $table->string('ville')->nullable();
                $table->date('date_naissance')->nullable();
                $table->string('sexe')->nullable();
                $table->string('photo_permis')->nullable();
                $table->string('photo_identite')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We don't drop any tables on rollback
        Schema::table('ch_messages', function (Blueprint $table) {
            $table->dropIndex(['from_id']);
            $table->dropIndex(['to_id']);
            $table->dropIndex(['from_id', 'to_id']);
            $table->dropIndex(['to_id', 'from_id']);
        });
    }
};
