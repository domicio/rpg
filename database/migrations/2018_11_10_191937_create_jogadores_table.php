<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJogadoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jogadores', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_arma')->unsigned();
            $table->foreign('id_arma')->references('id')->on('armas');
            $table->unsignedInteger('forca');
            $table->unsignedInteger('agilidade');
            $table->integer('vida');
            $table->string('raca');
            $table->timestamps();
        });

        // Insert some stuff
        DB::table('jogadores')->insert(
           [    'id_arma' => 1,
                'forca' => 1,
                'agilidade' => 2,
                'vida' => 12,
                'raca' => 'Humano'
           ],
           [    'id_arma' => 2,
                'forca' => 2,
                'agilidade' => 0,
                'vida' => 20,
                'raca' => 'Orc'
           ]
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jogadores');
    }
}
