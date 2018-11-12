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
			url: 'chars/dado.png',
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
			var attackOrDefenseVal		= false;
			var _data					= {};
			
			_data.id_partida			= factory.idPartida;

			if(factory.dadoGirado.humano == factory.dadoGirado.orc) rollDices();
			
			atacante = factory.dadoGirado.humano > factory.dadoGirado.orc ? factory.players[0] : factory.players[1];
			defensor = factory.dadoGirado.humano > factory.dadoGirado.orc ? factory.players[1] : factory.players[0];
			attackOrDefenseVal = attackOrDefense(atacante, defensor);
			if(attackOrDefenseVal) dano = calculateDamage(atacante, defensor);

			_data.acao 		= attackOrDefenseVal ? atacante.raca +" deferiu " +dano +" de dano" : atacante.raca+" não deferiu dano do "+defensor.raca;
			_data.dado 		= factory.dadoGirado[atacante.raca.toLowerCase()];
			_data.jogador 	= atacante.id
			storeActionDone(_data);
			factory.results.unshift(angular.copy(_data.acao));

			_data.acao 		= attackOrDefenseVal ? defensor.raca+" sofreu "+dano + " de dano" : defensor.raca+' defendeu o ataque do '+atacante.raca;
			_data.dado 		= factory.dadoGirado[defensor.raca.toLowerCase()];
			_data.jogador 	= defensor.id
			storeActionDone(_data);
			factory.results.unshift(angular.copy(_data.acao));
		}

		function attackOrDefense(atacante, defensor){
			var attackSkills 	= factory.dadoGirado[atacante.raca.toLowerCase()] + atacante.agilidade;
			var defendorSkills 	= factory.dadoGirado[defensor.raca.toLowerCase()] + defensor.agilidade;

			attackSkills 	+= factory.dadoGirado[atacante.raca.toLowerCase()] > factory.dadoGirado[defensor.raca.toLowerCase()] ? atacante.arma.ataque : atacante.arma.defesa;
			defendorSkills 	+= factory.dadoGirado[atacante.raca.toLowerCase()] > factory.dadoGirado[defensor.raca.toLowerCase()] ?defensor.arma.defesa :defensor.arma.ataque;	

			return attackSkills > defendorSkills;
		}

		function calculateDamage(atacante, defensor){
			var dano 		= 0;
			dano 			= parseFloat(girarDado(atacante.arma.dado) + atacante.forca).toFixed(2);
			defensor.vida 	= parseFloat(defensor.vida - dano).toFixed(2);

			if(defensor.vida < 0) defensor.vida = 0;

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

		factory.tooglePlaying = function(){
			return factory.playing = !factory.playing;
		}

		factory.formatDate = function(date){
			return new Date(date).toLocaleString();
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