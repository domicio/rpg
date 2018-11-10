<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jogadores;

class JogadorController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $jogadores = Jogadores::all();
        return response()->json($jogadores);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // return view('Jogadores.create', compact('salas', 'professores', 'user'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreJogadores $request)
    {
       $jogador = $request->all();
       Jogadores::create($jogador);
       return response()->json($jogador, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $jogador=Jogadores::find($id);
        return response()->json($jogador);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $jogador          = Jogadores::find($id);
        return response()->json($jogador);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreJogadores $request, $id)
    {
       $jogadorUpdate   = $request->all();
       $jogador         = Jogadores::find($id);
       $jogador->update($jogadorUpdate);
       return response()->json($jogador);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Jogadores::find($id)->delete();

        return response()->json(['message' =>'Registro deletado'], 200);
    }
}
