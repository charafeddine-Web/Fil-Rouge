<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('conducteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('num_permis');
            $table->boolean('disponibilite')->default(true);
            $table->decimal('note_moyenne', 5, 2)->default(0);
            $table->string('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->date('date_naissance')->nullable();
            $table->enum('sexe', ['homme', 'femme'])->nullable();
            $table->string('photo_permis')->nullable();
            $table->string('photo_identite')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('conducteurs');
    }
};
