var marvelCharacterEndPoint = 'https://gateway.marvel.com/v1/public/characters';

// function to get character data through Marvel API
function getCharacterId(searchTerm) {
	var characterQuery = {
		name: searchTerm,
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
 	var object = $.getJSON(marvelCharacterEndPoint, characterQuery, getComicCover);
}

// function to use CharacterId to get comic info from marvel API
function getComicCover(object) {
	displayCharacterInfo(object);
	var id = object.data.results[0].id;
	var endpoint = 'https://gateway.marvel.com/v1/public/characters/' + id + '/comics';
	var comicQuery = {
		characterId: id,
		format: 'comic',
		formatType: 'comic',
		noVariants: true,
		limit: 6,
		orderBy: 'onsaleDate',
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
	$.getJSON(endpoint, comicQuery, displayComicInfo);
}

// function to display Character data
function displayCharacterInfo(returnObject) {
	var apiResults = '';
	if (returnObject.data.count > 0) {
		returnObject.data.results.forEach(function(item) {
			apiResults += 
				'<div class="col-3">' +
					'<div class="char-info">' +
						'<img src="' + item.thumbnail.path + '/standard_fantastic.' + item.thumbnail.extension + '" class="char-img">' +
						'<div class="char-descrip">' +
							'<h3>' + item.name + '</h3>' +
						'</div>' +
					'</div>' +
				'</div>'
			;});
	} else {
		apiResults += '<p>No results</p>';
	}
	$('.js-character-container').html(apiResults);
}

// function to display Comic data
function displayComicInfo(returnObject) {
	var apiResults = '';
	if (returnObject.data.count > 0) {
		returnObject.data.results.forEach(function(item) {
			apiResults +=
					'<div class="col-4">' +
						'<div class="cover-container js-cover-container">' +
							'<div class="comic-info">' +
								'<img src="' + item.thumbnail.path +'/standard_fantastic.' + item.thumbnail.extension + '" class="comic-img">' +
								'<div class="comic-descrip">' +
									'<h3>' + item.title + '</h3>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>'
		;});
	} else {
		apiResults += '<p>No results</p>';
	}
	$('.js-search-results').html(apiResults);
}

// function to listen for submit 
function watchSubmit() {
	$('.js-search-form').submit(function (event) {
		event.preventDefault();
		// getCharacterId($(this).find('.js-search-input').val());
		getCharacterId($(this).find('.js-search-input').val());
		$('.js-search-input').val('');
    $('.js-search-input').focus();
	});
}

$(function(){watchSubmit();});