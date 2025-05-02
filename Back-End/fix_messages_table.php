<?php

// This is a direct database fix script to avoid migration issues

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

try {
    echo "Starting messages table fix...\n";
    
    // Check if the table exists
    if (Schema::hasTable('messages')) {
        echo "Messages table exists. Checking structure...\n";
        
        // Get current columns
        $columns = Schema::getColumnListing('messages');
        echo "Current columns: " . implode(', ', $columns) . "\n";
        
        // Add missing columns
        Schema::table('messages', function (Blueprint $table) use ($columns) {
            if (!in_array('from_id', $columns)) {
                echo "Adding from_id column...\n";
                $table->bigInteger('from_id')->nullable();
            }
            
            if (!in_array('to_id', $columns)) {
                echo "Adding to_id column...\n";
                $table->bigInteger('to_id')->nullable();
            }
            
            if (!in_array('sender_id', $columns)) {
                echo "Adding sender_id column...\n";
                $table->bigInteger('sender_id')->nullable();
            }
            
            if (!in_array('receiver_id', $columns)) {
                echo "Adding receiver_id column...\n";
                $table->bigInteger('receiver_id')->nullable();
            }
            
            if (!in_array('body', $columns)) {
                echo "Adding body column...\n";
                $table->text('body')->nullable();
            }
            
            if (!in_array('content', $columns)) {
                echo "Adding content column...\n";
                $table->text('content')->nullable();
            }
            
            if (!in_array('seen', $columns)) {
                echo "Adding seen column...\n";
                $table->boolean('seen')->default(false);
            }
            
            if (!in_array('is_read', $columns)) {
                echo "Adding is_read column...\n";
                $table->boolean('is_read')->default(false);
            }
        });
        
        // Add indexes using raw SQL to avoid errors if they already exist
        echo "Adding indexes (if not exist)...\n";
        try {
            DB::statement('CREATE INDEX IF NOT EXISTS messages_from_id_index ON messages (from_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS messages_to_id_index ON messages (to_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS messages_sender_id_index ON messages (sender_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS messages_receiver_id_index ON messages (receiver_id)');
        } catch (\Exception $e) {
            echo "Error adding indexes: " . $e->getMessage() . "\n";
        }
        
        // Fix any misaligned data
        echo "Fixing data alignment between columns...\n";
        try {
            // Check if we should sync from_id to sender_id
            if (in_array('from_id', $columns) && in_array('sender_id', $columns)) {
                DB::statement('UPDATE messages SET sender_id = from_id WHERE sender_id IS NULL AND from_id IS NOT NULL');
            }
            
            // Check if we should sync to_id to receiver_id
            if (in_array('to_id', $columns) && in_array('receiver_id', $columns)) {
                DB::statement('UPDATE messages SET receiver_id = to_id WHERE receiver_id IS NULL AND to_id IS NOT NULL');
            }
            
            // Check if we should sync body to content
            if (in_array('body', $columns) && in_array('content', $columns)) {
                DB::statement('UPDATE messages SET content = body WHERE content IS NULL AND body IS NOT NULL');
                DB::statement('UPDATE messages SET body = content WHERE body IS NULL AND content IS NOT NULL');
            }
            
            // Update seen to match is_read or vice versa
            if (in_array('seen', $columns) && in_array('is_read', $columns)) {
                DB::statement('UPDATE messages SET is_read = seen WHERE is_read IS NULL');
                DB::statement('UPDATE messages SET seen = is_read WHERE seen IS NULL');
            }
        } catch (\Exception $e) {
            echo "Error fixing data alignment: " . $e->getMessage() . "\n";
        }
        
        echo "Messages table structure fixed successfully.\n";
    } else {
        echo "Messages table does not exist. Creating it...\n";
        
        // Create the table
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('from_id')->nullable();
            $table->bigInteger('to_id')->nullable();
            $table->bigInteger('sender_id')->nullable();
            $table->bigInteger('receiver_id')->nullable();
            $table->text('body')->nullable();
            $table->text('content')->nullable();
            $table->boolean('seen')->default(false);
            $table->boolean('is_read')->default(false);
            $table->timestamps();
            
            // Add indexes
            $table->index('from_id');
            $table->index('to_id');
            $table->index('sender_id');
            $table->index('receiver_id');
        });
        
        echo "Messages table created successfully.\n";
    }
    
    echo "Script completed successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
} 