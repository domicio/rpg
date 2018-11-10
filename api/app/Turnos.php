<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Turnos extends Model
{
    protected $table 	= "turnos";
    
    public function jogador()
    {
        return $this->hasOne('App\Jogadores');
    }
}
