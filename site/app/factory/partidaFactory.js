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
				storeMatch();
				searchPlayers()
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
				console.log('response err');
				if(response.data.length > 0)
					factory.idPartida = response.data[0].id;

			}, function(response){
				console.log('response err');
			})
		}

		function storeActionDone(data){

			$http({
				method: 'POST',
				url   : factory.service_url + 'turnos',
				data: data
			})
			.then(function (response) {
				if(response.data.length != 0)
					factory.results = response.data;

			}, function(response){})
		}

		function rollDices(){
			console.log('dices rolled!');
			factory.dadoGirado.humano 	= girarDado(20);
			factory.dadoGirado.orc 		= girarDado(20);
			var data 					= [];
			var atacante 				= '';
			var defensor 				= '';
			data['id_partida'] 			= factory.idPartida;

			console.log('dadoHumano', factory.dadoGirado.humano, 'dadoOrc', factory.dadoGirado.orc);

			if(factory.dadoGirado.humano == factory.dadoGirado.orc) rollDices();
			
			atacante = factory.dadoGirado.humano > factory.dadoGirado.orc ? 'Humano' : 'Orc';
			defensor = factory.dadoGirado.humano > factory.dadoGirado.orc ? 'Orc' : 'Humano';
			
			if(attackOrDefense(factory.dadoGirado.humano, factory.dadoGirado.orc)){
				var dano = calculateDamage();
				data['acao'] =  atacante +" deferiu " +dano +" de dano" ;
				storeActionDone(data);
				factory.results.unshift(data['acao']);

				data['acao'] = defensor+" sofreu "+dano + " de dano";
				data['dado'] = factory.dadoGirado.humano;
				storeActionDone(data);
				factory.results.unshift(data['acao']);
			}else{
				data['acao'] = defensor+' defendeu o ataque do '+atacante;
				data['dado'] = factory.dadoGirado.orc;
				storeActionDone(data);
				factory.results.unshift(data['acao']);
				data['acao'] = atacante+" não deferiu dano do "+defensor;
				data['dado'] = factory.dadoGirado.humano;
				storeActionDone(data);
				factory.results.unshift(data['acao']);
			}
		}

		function attackOrDefense(dadoHumano, dadoOrc){
			console.log((dadoHumano/20), factory.players[0].agilidade);
			console.log((dadoOrc/20), factory.players[1].agilidade);
			var humanSkills = (dadoHumano/20) + factory.players[0].agilidade;
			var orcSkills 	= (dadoOrc/20) + factory.players[1].agilidade;
			if(dadoHumano > dadoOrc){
				console.log('humanSkills', factory.players[0].arma.ataque);
				humanSkills += factory.players[0].arma.ataque;
				console.log('orcSkills', factory.players[0].arma.defesa);
				orcSkills 	+= factory.players[1].arma.defesa;
			}else{
				orcSkills 	+= factory.players[1].arma.ataque;
				humanSkills += factory.players[0].arma.defesa;
				console.log('humanSkills', factory.players[0].arma.defesa);
				console.log('orcSkills', factory.players[0].arma.ataque);
			}

			console.log('attackOrDefense', humanSkills > orcSkills);
			return humanSkills > orcSkills;
		}

		function calculateDamage(){
			console.log('calculateDamage');
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
		
		return factory;
	}
])