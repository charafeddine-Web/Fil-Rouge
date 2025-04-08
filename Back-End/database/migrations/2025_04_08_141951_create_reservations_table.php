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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_reservation');
            $table->enum('status', ['en_attente', 'confirmee', 'annulee'])->default('en_attente');
            $table->unsignedBigInteger('passager_id');
            $table->unsignedBigInteger('trajet_id');
            $table->integer('places_reservees')->default(1);
            $table->float('prix_total')->nullable();
            $table->timestamps();
            $table->foreign('passager_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('trajet_id')->references('id')->on('trajets')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
