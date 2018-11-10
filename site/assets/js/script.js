$(document).ready(function(){
	$('#doSearch').click(doSearch);
});

function doSearch(){
	var field = $('#searchField').val();
	var term = $('#searchTerm').val();
	// jQuery.get(+field+'/'+term, function(response){
	// 	console.log('response', response);
	// })

	$.ajax({
	 	crossDomain  :true,
		type: 'GET',
	  	url: service_url,
	  	data: {},
	 	dataType: 'json',
	  	//success: function(response){console.log('response')}
	}).done(function(response) {
	  console.log('response', response);
	});
}