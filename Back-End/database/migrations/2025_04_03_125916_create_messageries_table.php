<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('messageries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('passager_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('conducteur_id')->constrained('users')->onDelete('cascade');
            $table->text('message');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('messageries');
    }
};
