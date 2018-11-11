<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTurnosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('turnos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('jogador')->unsigned();
            $table->foreign('jogador')->references('id')->on('jogadores');
            $table->integer('dado');
            $table->integer('acao');
            $table->integer('id_partida')->unsigned();
            $table->foreign('id_partida')->references('id')->on('partidas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('turnos');
    }
}
