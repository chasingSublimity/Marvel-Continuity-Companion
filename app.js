var marvelCharacterEndPoint = 'https://gateway.marvel.com/v1/public/characters';
var displayComicCardsStartPoint = 0;

// function to get character data through Marvel API
function getCharacterId(searchTerm) {
	var characterQuery = {
		name: searchTerm,
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
 	$.getJSON(marvelCharacterEndPoint, characterQuery, function(object) {
 		displayCharacterCard(object);
 		getComicInfo(object);
 	});
}

// function to use CharacterId to get comic info from marvel API
function getComicInfo(object) {
	var id = object.data.results[0].id;
	var endpoint = 'https://gateway.marvel.com/v1/public/characters/' + id + '/comics';
	var comicQuery = {
		characterId: id,
		format: 'comic',
		formatType: 'comic',
		noVariants: false,
		limit: 8,
		orderBy: '-onsaleDate',
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
	$.getJSON(endpoint, comicQuery, function(object) {
		displayComicCards(object, displayComicCardsStartPoint);
	});
}

// function to display Character data
function displayCharacterCard(returnObject) {
	var apiResults = '';
	if (returnObject.data.count > 0) {
		returnObject.data.results.forEach(function(item) {
			apiResults +=
				'<div class="char-info">' +
					'<img src="' + item.thumbnail.path + '/standard_fantastic.' + item.thumbnail.extension + '" class="char-img">' +
					'<div class="char-descrip">' +
						'<h3>' + item.name + '</h3>' +
					'</div>' +
				'</div>'
			;});
	} else {
		apiResults += '<p>No results</p>';
	}
	$('.js-character-section').html(apiResults);
}

// function to display Comic data
function displayComicCards(returnObject, startPoint) {
	var apiResults1 = '';
	var apiResults2 = '';
	var comicCounter = 0;
	// Checks to see if API returned any results
	if (returnObject.data.count > 0) {
		for (i=startPoint; i < (startPoint + 8); i++) {
			// Url that API returns if no image accompanies the comic object
			var noImgUrl = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
			// Only displays comic with images
			if (returnObject.data.results[i].thumbnail.path !== noImgUrl) {
				var htmlFrame = 
					'<div class="col-3">' +
						'<div class="cover-container js-cover-container">' +
							'<div class="comic-info">' +
								'<a href="' + returnObject.data.results[i].urls[0].url + '">' + 
									'<img src="' + returnObject.data.results[i].thumbnail.path +'/detail.' + returnObject.data.results[i].thumbnail.extension + '" class="comic-img">' + 
								'</a>' +
								'<div class="comic-descrip">' +
									'<h3>' + returnObject.data.results[i].title + '</h3>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
				// Controls which element the results get rendered into 
				if (comicCounter < 4) {
					apiResults1 += htmlFrame;
				} else {
					apiResults2 += htmlFrame;
				}
				comicCounter++;
			}
			displayComicCardsStartPoint += 8;
		}
	} else {
		apiResults1 += '<p>No Results</p>';
	}
	// Renders search results
	$('.js-search-results-1').html(apiResults1);
	$('.js-search-results-2').html(apiResults2);
	// Render "More Comics Button"
	$('.button-div').show();
	// Renders attribution info
	$('footer').html(returnObject.attributionHTML);
}

// function to listen for submit 
function watchSubmit() {
	$('.js-search-form').submit(function (event) {
		event.preventDefault();
		$('.button-div').hide();
		$('.app-instructions').hide();
		// Search-result area reset
    $('.js-search-results-1').html('');
		$('.js-search-results-2').html('');
		// Api calls and rendering
		getCharacterId($(this).find('.js-search-input').val());
		// Search input reset 
		$('.js-search-input').val('');
    $('.js-search-input').focus();
	});
}

// function to listen for "see more comics"
function watchMoreComics() {
	$('.button-div').on('click', '.more-comics', function(event) {

	});
}

$(function(){
	watchSubmit();
	watchMoreComics();
});