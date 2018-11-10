<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArmasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('armas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nome', 100);
            $table->unsignedInteger('ataque');
            $table->unsignedInteger('defesa');
            $table->integer('dado');
            $table->timestamps();
        });

        DB::table('armas')->insert(
            [   'nome' => 'Espada Longa',
                'ataque' => 2,
                'defesa' => 1,
                'dado' => 6
            ],
            [   'nome' => 'Clava de madeira',
                'ataque' => 1,
                'defesa' => 0,
                'dado' => 8,
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
        Schema::dropIfExists('armas');
    }
}
