<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FixChatMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Drop existing tables to avoid conflicts
        if (Schema::hasTable('messages')) {
            Schema::drop('messages');
        }
        
        if (Schema::hasTable('ch_messages')) {
            Schema::drop('ch_messages');
        }
        
        // Create a new messages table that works with both controller approaches
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('from_id');
            $table->bigInteger('to_id');
            $table->bigInteger('sender_id');
            $table->bigInteger('receiver_id');
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
            $table->index(['sender_id', 'receiver_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
} 