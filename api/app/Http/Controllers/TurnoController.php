<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Turnos;

class TurnoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $turnos = Turnos::all();
        return response()->json($turnos);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('Turnos.create', compact('salas', 'professores', 'user'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       $turno = $request->all();
       Turnos::create($turno);
       return response()->json($turno, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $turno=Turnos::find($id);
        return response()->json($turno);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $turno          = Turnos::find($id);
        return response()->json($turno);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
       $turnoUpdate   = $request->all();
       $turno         = Turnos::find($id);
       $turno->update($turnoUpdate);
       return response()->json($turno);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Turnos::find($id)->delete();

        return response()->json(['message' =>'Registro deletado'], 200);
    }
}
