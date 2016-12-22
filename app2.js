var marvelCharacterEndPoint = 'https://gateway.marvel.com/v1/public/characters';

// function to get character data through Marvel API
function getCharacterId(searchTerm) {
	var characterQuery = {
		name: searchTerm,
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
 	var object = $.getJSON(marvelCharacterEndPoint, characterQuery, getComicCovers);
}

// function to use CharacterId to get comic info from marvel API
function getComicCovers(object) {
	displayCharacterInfo(object);
	var id = object.data.results[0].id;
	var endpoint = 'https://gateway.marvel.com/v1/public/characters/' + id + '/comics';
	var comicQuery = {
		characterId: id,
		format: 'comic',
		formatType: 'comic',
		noVariants: true,
		limit: 1,
		orderBy: 'onsaleDate',
		apikey: 'b5a985cb816977af5a8da412277c108b',
		offset: 0
	};
	var apiArray = [];
	var apiReturnCount = 0;
	while (apiArray.length < 8) {
		$.getJSON(endpoint, comicQuery, checkComicCovers);
		comicQuery.offset++;
		apiReturnCount++;
	}
	var row1 = apiArray.slice(0,4);
	var row2 = apiArray.slice(4);
	displayComicsInfo(row1, row2);
}

// function to display Character data
function displayCharacterInfo(returnObject) {
	var apiResults = '';
	if (returnObject.data.count > 0) {
		returnObject.data.results.forEach(function(item) {
			apiResults +=
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
	$('.js-character-section').html(apiResults);
}

// function to prevent "img not found" images
function checkComicCovers(apiJSON) {
	var noImgUrl = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
	if (apiJSON.data.results[0].thumbnail !== noImgUrl) {
		var htmlFrame =
			'<div class="col-3">' +
				'<div class="cover-container js-cover-container">' +
					'<div class="comic-info">' +
						'<img src="' + apiJSON.data.results.thumbnail.path +'/standard_fantastic.' + item.thumbnail.extension + '" class="comic-img">' +
						'<div class="comic-descrip">' +
							'<h3>' + apiJSON.data.results.title + '</h3>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';
		apiArray.push(htmlFrame);
	}
}

// function to display Comic data
function displayComicsInfo(array1, array2) {
	$('.js-search-results-1').html(array1);
	$('.js-search-results-2').html(array2);
}

// function to listen for submit 
function watchSubmit() {
	$('.js-search-form').submit(function (event) {
		event.preventDefault();
		$('.app-instructions').hide();
		getCharacterId($(this).find('.js-search-input').val());
		$('.js-search-input').val('');
    $('.js-search-input').focus();
	});
}

$(function(){watchSubmit();});