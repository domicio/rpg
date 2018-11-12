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
		factory.matches 			= [];
		factory.dadoGirado 			= { humano: 0, orc : 0 };
		factory.idPartida			= 0;

		factory.btnStartMatch = {
			label: 'Começar uma partida',
			id: 'startBtn',
			click: function(){
				factory.results.splice(0);
				factory.dadoGirado.humano 	= 0; 
				factory.dadoGirado.orc 		= 0;
				storeMatch();
				
			},
			customClass: 'btn btn-outline-success my-2 my-sm-0'
		};

		factory.dado = {
			url: 'chars/dado.jpg',
			click: function(){rollDices()},
			title: 'Jogar os dados',
			customClass: 'dado'
		};

		function searchPlayers(){

			$http({
				method: 'GET',
				url   : factory.service_url + 'jogadores',
			})
			.then(function (response) {
				console.log('response', response);
				if(response.data.length != 0){
					factory.players = response.data;
					if(factory.players[0].raca == 'Humano'){
						factory.players[0].url = 'chars/guerreiro.png';
						factory.players[1].url = 'chars/orc.gif';
					}
					searchWeapons();
				}

			}, function(response){
				console.log('response', response);
			})
		}

		function searchWeapons(){

			$http({
				method: 'GET',
				url   : factory.service_url + 'armas',
			})
			.then(function (response) {
				if(response.data.length != 0){
					for( var i = 0, total = response.data.length; i < total; i++){
						var weapon = response.data[i];
						for(var p = 0, total_j = factory.players.length; p < total_j; p++){
							if( weapon.id == factory.players[p].id_arma)
								factory.players[p].arma = weapon;
						}
					}

					factory.playing = true;
				}

			}, function(response){})
		}

		factory.searchMatches = function(){
			$http({
				method: 'GET',
				url   : factory.service_url + 'partidas',
			})
			.then(function (response) {
				if(response.data.length != 0)
					factory.matches = response.data;

			}, function(response){})
		}

		function storeMatch(){
			var data 	= [];
			data['id'] 	= 0;
			$http({
				method: 'POST',
				url   	: factory.service_url + 'partidas',
				headers	: {'Content-Type': 'application/x-www-form-urlencoded'},
				data	: data
			})
			.then(function (response) {
				if(response.data != null){
					factory.idPartida = response.data.id;
					searchPlayers()
				}

			}, function(response){
				console.log('err', response);
			})
		}

		function storeActionDone(_data){

			$http({
				method	: 'POST',
				url   	: factory.service_url + 'turnos',
				headers	: {'Content-Type': 'application/x-www-form-urlencoded'},
				data	: objectToQuerystring(_data)
			})
			.then(function (response) {

			}, function(response){
				console.log('response err', response);
			})
		}

		function rollDices(){
			factory.dadoGirado.humano 	= girarDado(20);
			factory.dadoGirado.orc 		= girarDado(20);
			var atacante 				= '';
			var defensor 				= '';
			var dano 					= 0;
			var _data					= {};
			_data.id_partida			= factory.idPartida;

			if(factory.dadoGirado.humano == factory.dadoGirado.orc) rollDices();
			
			atacante = factory.dadoGirado.humano > factory.dadoGirado.orc ? factory.players[0] : factory.players[1];
			defensor = factory.dadoGirado.humano > factory.dadoGirado.orc ? factory.players[1] : factory.players[0];
			
			if(attackOrDefense(factory.dadoGirado.humano, factory.dadoGirado.orc)){
				dano 		= calculateDamage();
				_data.acao 		= atacante.raca +" deferiu " +dano +" de dano" ;
				_data.dado 		= atacante.raca == 'Humano' ?  factory.dadoGirado.humano : factory.dadoGirado.orc ;
				_data.jogador 	= atacante.id
				storeActionDone(_data);
				factory.results.unshift(angular.copy(_data.acao));

				_data.acao 		= defensor.raca+" sofreu "+dano + " de dano";
				_data.dado 		= defensor.raca == 'Humano' ? factory.dadoGirado.humano : factory.dadoGirado.orc ;
				_data.jogador 	= defensor.id
				storeActionDone(_data);
				factory.results.unshift(angular.copy(_data.acao));
			}else{
				_data.acao = defensor.raca+' defendeu o ataque do '+atacante;
				_data.dado = factory.dadoGirado.orc;
				_data.jogador 	= defensor.id
				storeActionDone(_data);
				factory.results.unshift(angular.copy(_data.acao));

				_data.acao 		= atacante.raca+" não deferiu dano do "+defensor;
				_data.dado 		= factory.dadoGirado.humano;
				_data.jogador 	= atacante.id
				storeActionDone(_data);
				factory.results.unshift(angular.copy(_data.acao));
			}
		}

		function attackOrDefense(dadoHumano, dadoOrc){
			var humanSkills = (dadoHumano/20) + factory.players[0].agilidade;
			var orcSkills 	= (dadoOrc/20) + factory.players[1].agilidade;
			if(dadoHumano > dadoOrc){
				humanSkills += factory.players[0].arma.ataque;
				orcSkills 	+= factory.players[1].arma.defesa;
			}else{
				orcSkills 	+= factory.players[1].arma.ataque;
				humanSkills += factory.players[0].arma.defesa;
			}

			return humanSkills > orcSkills;
		}

		function calculateDamage(){
			var dano = 0;
			if(factory.dadoGirado.humano > factory.dadoGirado.orc){
				dano =  parseFloat((girarDado(factory.players[0].arma.dado)/factory.players[0].arma.dado) + factory.players[0].forca).toFixed(2);
				factory.players[1].vida = parseFloat(factory.players[1].vida - dano).toFixed(2); 

				if(factory.players[1].vida < 0) factory.players[1].vida = 0;
			}else{
				dano =  parseFloat((girarDado(factory.players[1].arma.dado)/factory.players[1].arma.dado) + factory.players[1].forca).toFixed(2);
				factory.players[0].vida = parseFloat(factory.players[0].vida - dano).toFixed(2);
				if(factory.players[0].vida < 0) factory.players[0].vida = 0;
			}

			return dano;				
		}

		function girarDado(lados){
			return Math.floor(Math.random() * ((lados - 1) + 1) + 1)
		}

		factory.getResults = function(){
			return factory.results;
		}

		factory.getPlayers = function(){
			return factory.players;
		}

		factory.isPlaying = function(){
			return factory.playing;
		}		

		factory.getDices = function(){
			return factory.dadoGirado;
		}
		factory.getMatches= function(){
			return factory.matches;
		}

		function objectToQuerystring (obj) {
		  return Object.keys(obj).reduce(function (str, key, i) {
		    var delimiter, val;
		    delimiter = (i === 0) ? '&' : '&';
		    key = encodeURIComponent(key);
		    val = encodeURIComponent(obj[key]);
		    return [str, delimiter, key, '=', val].join('');
		  }, '');
		}

		
		return factory;
	}
])