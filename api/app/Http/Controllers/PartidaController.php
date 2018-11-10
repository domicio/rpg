<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Partidas;

class PartidaController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $partidas = Partidas::all();
        return response()->json($partidas);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // return view('Partidas.create', compact('salas', 'professores', 'user'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePartidas $request)
    {
       $partida = $request->all();
       Partidas::create($partida);
       return response()->json($partida, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $partida=Partidas::find($id);
        return response()->json($partida);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $partida          = Partidas::find($id);
        return response()->json($partida);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StorePartidas $request, $id)
    {
       $partidaUpdate   = $request->all();
       $partida         = Partidas::find($id);
       $partida->update($partidaUpdate);
       return response()->json($partida);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Partidas::find($id)->delete();

        return response()->json(['message' =>'Registro deletado'], 200);
    }
}
