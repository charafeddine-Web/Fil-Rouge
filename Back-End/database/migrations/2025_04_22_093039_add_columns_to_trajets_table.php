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
        Schema::table('trajets', function (Blueprint $table) {
            $table->decimal('prix_par_place', 8, 2);
            $table->text('description')->nullable();
            $table->enum('statut', ['planifié', 'en_cours', 'terminé', 'annulé'])->default('planifié');
            $table->boolean('bagages_autorises')->default(true);
            $table->boolean('animaux_autorises')->default(false);
            $table->boolean('fumeur_autorise')->default(false);
            $table->json('options')->nullable();
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
