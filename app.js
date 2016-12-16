var marvelCharacterEndPoint = 'https://gateway.marvel.com:443/v1/public/characters';

// function to get character data through Marvel API
function getCharacterId(searchTerm) {
	var characterQuery = {
		name: searchTerm,
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
 	$.getJSON(marvelCharacterEndPoint, characterQuery, function(object) {
 		displayCharacterInfo(object);
 		return object.data.results[0].id;
 	});
}

// function to use CharacterId to get comic info from marvel API
function getComicCover(searchTerm) {
	var comicQuery = {
		characterId: getCharacterID(searchTerm),
		format: 'comic',
		formatType: 'comic',
		noVariants: true
	};
	$.getJSON(marvelCharacterEndPoint, comicQuery, displayComicCovers);
}

// function to display Character data
function displayCharacterInfo(returnObject) {
	console.log(returnObject);
	var apiResults = '';
	if (returnObject.data.count > 0) {
		returnObject.data.results.forEach(function(item){
			apiResults += 
				'<div class="char-info">' +
					'<img src="' + item.thumbnail.path + '/standard_fantastic.' + item.thumbnail.extension + '" class="char-img">' +
					'<div class="char-descrip">' +
						'<h3>' + item.name + '</h3>' +
						'<p>' + item.description + '</p>' +
					'</div>' +
				'</div>'
			;});
	} else {
		apiResults += '<p>No results</p>';
	}
	$('.js-search-results').html(apiResults);
}

// function to display Comic data

// function to listen for submit 
function watchSubmit() {
	$('.js-search-form').submit(function (event) {
		event.preventDefault();
		var characterName = $(this).find('.js-search-input').val();
		console.log(characterName);
		getCharacterId(characterName, displayCharacterInfo);
		$('.js-search-input').val('');
    $('.js-search-input').focus();
	});
}

$(function(){watchSubmit();});