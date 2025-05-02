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
        // Instead of dropping and recreating the table, just make sure all required columns exist
        if (Schema::hasTable('messages')) {
            // Check if columns exist and add them if they don't
            $columns = Schema::getColumnListing('messages');
            
            Schema::table('messages', function (Blueprint $table) use ($columns) {
                if (!in_array('from_id', $columns)) {
                    $table->bigInteger('from_id')->nullable()->after('id');
                }
                
                if (!in_array('to_id', $columns)) {
                    $table->bigInteger('to_id')->nullable()->after('from_id');
                }
                
                if (!in_array('sender_id', $columns)) {
                    $table->bigInteger('sender_id')->nullable()->after('to_id');
                }
                
                if (!in_array('receiver_id', $columns)) {
                    $table->bigInteger('receiver_id')->nullable()->after('sender_id');
                }
                
                if (!in_array('body', $columns)) {
                    $table->text('body')->nullable()->after('receiver_id');
                }
                
                if (!in_array('content', $columns)) {
                    $table->text('content')->nullable()->after('body');
                }
                
                if (!in_array('seen', $columns)) {
                    $table->boolean('seen')->default(false)->after('content');
                }
                
                if (!in_array('is_read', $columns)) {
                    $table->boolean('is_read')->default(false)->after('seen');
                }
            });
            
            // Add indexes
            DB::statement('CREATE INDEX IF NOT EXISTS messages_from_id_index ON messages (from_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS messages_to_id_index ON messages (to_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS messages_from_to_index ON messages (from_id, to_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS messages_sender_id_index ON messages (sender_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS messages_receiver_id_index ON messages (receiver_id)');
            
            echo "Existing messages table updated with required columns and indexes.\n";
        } else {
            // Create the table if it doesn't exist
            Schema::create('messages', function (Blueprint $table) {
                $table->id(); // Auto-incrementing primary key
                $table->bigInteger('from_id')->nullable();
                $table->bigInteger('to_id')->nullable();
                $table->bigInteger('sender_id')->nullable();
                $table->bigInteger('receiver_id')->nullable();
                $table->text('body')->nullable();
                $table->text('content')->nullable();
                $table->boolean('seen')->default(false);
                $table->boolean('is_read')->default(false);
                $table->timestamps();
                
                // Add indexes for performance
                $table->index('from_id');
                $table->index('to_id');
                $table->index(['from_id', 'to_id']);
                $table->index('sender_id');
                $table->index('receiver_id');
            });
            
            echo "New messages table created.\n";
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop the table, it might have important data
        // Just remove any indexes we added
        if (Schema::hasTable('messages')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->dropIndex(['from_id']);
                $table->dropIndex(['to_id']);
                $table->dropIndex(['from_id', 'to_id']);
                $table->dropIndex(['sender_id']);
                $table->dropIndex(['receiver_id']);
            });
        }
    }
}; 