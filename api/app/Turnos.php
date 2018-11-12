<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Turnos extends Model
{
    protected $table 	= "turnos";
    protected $guarded 	= [];
    
    public function jogador()
    {
        return $this->hasOne('App\Jogadores');
    }
}
