angular.module('partida').controller('partidaController', [
'partidaFactory',
function(factory){
	
	// this.playing			= factory.playing;
	this.btnStartMatch 		= factory.btnStartMatch;
	this.isPlaying			= factory.isPlaying;
	this.players			= factory.players;
	this.getPlayers			= factory.getPlayers;
	this.dado				= factory.dado;
	this.getDices			= factory.getDices;
	this.getResults			= factory.getResults;	
	this.getMatches			= factory.getMatches;

	angular.element(document).ready(function(){
		factory.searchMatches();
	})
}]);