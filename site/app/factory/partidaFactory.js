angular.module('partida').factory('partidaFactory', [
	'$http'
	,'$filter'
	,'$location'
	, '$rootScope'
	, function ($http, $filter, $location, $rootScope) {
	
		// Globals 
		var factory                 = this;
		factory.service_url         = "http://localhost:8000/api/";		// service endpoint
		factory.message 			= '';
		factory.playing				= false;
		factory.results 			= [];
		factory.players 			= [];
		factory.weapons 			= [];

		factory.btnStartMatch = {
			label: 'Começar uma partida',
			id: 'startBtn',
			click: function(){factory.seachPlayers()},
			customClass: 'btn btn-outline-success my-2 my-sm-0'
		};


		// function search(name){
		// 	$http({
		// 		method: 'GET',
		// 		url   : factory.service_url + 'partidas',
		// 	})
		// 	.then(function (response) {
		// 		if(response.data.length > 0)
		// 			factory.results = response.data;
				
		// 	}, function(response){});
		// }

		// factory.seachPlayers = function(){

		// 	$http({
		// 		method: 'GET',
		// 		url   : factory.service_url + 'jogadores',
		// 	})
		// 	.then(function (response) {
		// 		if(response.data.length != 0){
		// 			factory.players = response.data;
		// 			factory.seachWeapons();
		// 		}

		// 	}, function(response){})
		// }

		// factory.seachWeapons= function(){

		// 	$http({
		// 		method: 'GET',
		// 		url   : factory.service_url + 'armas',
		// 	})
		// 	.then(function (response) {
		// 		if(response.data.length != 0){
		// 			for( var i = 0, total = response.data.length; i < total; i++){
		// 				var weapon = response.data[i];
		// 				for(var p = 0, total_j = factory.players.length; p < total_j; p++){
		// 					if( weapon.id == factory.players[p].id_arma)
		// 						factory.players[p].arma = weapon;
		// 				}
		// 			}

		// 			factory.playing = true;
		// 		}

		// 	}, function(response){})
		// }

		// factory.getResults = function(){
		// 	return factory.results;
		// }

		// factory.getPlayers = function(){
		// 	return factory.players;
		// }

		// factory.isPlaying = function(){
		// 	return factory.playing;
		// }

		// //#todo
		// factory.rollDices = function (){

		// }
		
		return factory;
	}
])