
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('trajets', function (Blueprint $table) {
            $table->decimal('prix', 10, 2)->default(0);
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('montant', 10, 2)->default(0);
        });
    }

    public function down()
    {
        Schema::table('trajets', function (Blueprint $table) {
            $table->dropColumn('prix');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('montant');
        });
    }
};
