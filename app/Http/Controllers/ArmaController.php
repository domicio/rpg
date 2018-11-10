<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Armas;

class ArmaController extends Controller
{
        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        $armas = Armas::all();
        return response()->json($armas);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // return view('Armas.create', compact('salas', 'professores', 'user'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreArmas $request){
       $arma = $request->all();
       Armas::create($arma);
       return response()->json($arma, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        $arma=Armas::find($id);
        return response()->json($arma);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id){
        $arma          = Armas::find($id);
        return response()->json($arma);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreArmas $request, $id){
       $armaUpdate   = $request->all();
       $arma         = Armas::find($id);
       $arma->update($armaUpdate);
       return response()->json($arma);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        Armas::find($id)->delete();
        return response()->json(['message' =>'Registro deletado'], 200);
    }
}
