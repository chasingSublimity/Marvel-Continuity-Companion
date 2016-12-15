var marvelCharacterEndPoint = 'https://gateway.marvel.com:443/v1/public/characters';

// function to get character data through Marvel API
function getCharacterInfo(searchTerm) {
	var characterQuery = {
		name: searchTerm,
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
 	$.getJSON(marvelCharacterEndPoint, characterQuery, displayResults);
}

// function to get comic cover image data through Marvel API
// function getComicBookCovers(searchTerm) {
// 	var coverQuery = {
// 		characterID: getCharacterID(searchTerm),
// 		apikey: 'b5a985cb816977af5a8da412277c108b'
// 	};
// 	$.getJSON(marvelEndPoint, coverQuery);
// }

// function to display data
function displayResults(data) {
	console.log(data);
	var results = '';
	if (data.results > 0) {
		data.results.forEach(function(item){
			results += 
				'<div class="comic-cover">' +
					'<img src="' + item.thumbnail.path + '" class="cover-img">' +
					'<div class="comic-descrip">' +
						'<h3>' + item.name + '</h3>' +
					'</div>' +
				'</div>'
			;});
	} else {
		results =+ '<p>No results</p>';
	}
	$('.js-search-results').html(results);
}

// function to listen for submit 
function watchSubmit() {
	$('.js-search-form').submit(function (event) {
		event.preventDefault();
		var characterName = $(this).find('.js-search-input').val();
		console.log(characterName);
		getCharacterInfo(characterName, displayResults);
		$('.js-search-input').val('');
    $('.js-search-input').focus();
	});
}

$(function(){watchSubmit();});