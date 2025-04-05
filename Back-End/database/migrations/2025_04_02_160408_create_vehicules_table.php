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
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conducteur_id')->nullable()->constrained('conducteurs')->nullOnDelete();
            $table->string('marque');
            $table->string('modele');
            $table->string('immatriculation')->unique();
            $table->string('couleur');
            $table->integer('nombre_places');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicules');
    }
};
