<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('trajets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conducteur_id')->constrained('conducteurs')->onDelete('cascade');
            $table->string('lieu_depart');
            $table->string('lieu_arrivee');
            $table->dateTime('date_depart');
            $table->integer('places_disponibles');

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trajets');
    }
};
