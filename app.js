// endpoint variable
const marvelCharacterEndPoint = 'https://gateway.marvel.com/v1/public/characters';
const displayAtATime = 8;
const coversPerRow = 4;

// variable to hold state
var state = {
	attributionHTML: '',
	character: {
		id: null,
		name: '',
		imagePath: '',
		imageExtension: ''
	},
	comics: [],
	comicsStartPoint: 0,
	comicsApiCallOffset: 0,
	totalRowsDisplayed: 0,
	totalResults: 0,
};

// get character ID
function getCharacterInfo(state, searchTerm) {
	var characterQuery = {
		name: searchTerm,
		apikey: 'b5a985cb816977af5a8da412277c108b'
	};
 	$.getJSON(marvelCharacterEndPoint, characterQuery, function(object) {
 		saveCharacterInfo(state, object);
 		displayCharacterCard(state);
 		getComicInfo(state, function(state) {
 			displayComicCards(state);
 			$('.button-div').fadeIn(500);
 		});
 	});
}

// get comic covers
function getComicInfo(state, callback) {
	var limit = null;
	if (state.comicsStartPoint === 0) {
		// on the first run, limit is set to two screens worth of data
		limit = displayAtATime * 2;
	} else {
		// On subsequent runs, limit set to one screen worth of data
		limit = displayAtATime;
	} 
	// checks to see if results were returned, then retrieves data from api
	if (state.character.id !== null) {
		var id = state.character.id;
		var endpoint = marvelCharacterEndPoint + '/' + id + '/comics';
		var comicQuery = {
			characterId: id,
			format: 'comic',
			formatType: 'comic',
			noVariants: false,
			limit: limit,
			offset: (state.comics.length),
			orderBy: '-onsaleDate',
			apikey: 'b5a985cb816977af5a8da412277c108b'
		};
		$.getJSON(endpoint, comicQuery, function(object) {
			pushComicObjects(state, object);
			callback(state);
		});
		// increments state.comicsApiCallOffset by the amount of comic objects called
		state.comicsApiCallOffset += comicQuery.limit;
	}
}
	
// push character object to state
function saveCharacterInfo(state, characterObject) {
	// verify object was returned, then push object to state
	if (characterObject.data.count > 0) {
		state.character.id = characterObject.data.results[0].id;
		state.character.name = characterObject.data.results[0].name;
		state.character.imagePath = characterObject.data.results[0].thumbnail.path;
		state.character.imageExtension = characterObject.data.results[0].thumbnail.extension;
	}
}

// push comic objects to state.comics array
function pushComicObjects(state, comicObject) {
	// verify comic objects were returned, then push objects to state
	if (comicObject.data.count > 0) {
		comicObject.data.results.forEach(function(item) {
			state.comics.push(
				{
					comicLink: item.urls[0].url,
					comicImgPath: item.thumbnail.path,
					comicImgExtension: item.thumbnail.extension,
					comicTitle: item.title
				}
			);
		});
		state.totalResults = comicObject.data.total;
		state.attributionHTML = comicObject.attributionHTML;
	}
}

// render character card
function displayCharacterCard(state) {
	// verify results were returned, then display character card
	if (state.character.name !== '') {
		$('.js-character-section').html(
			'<div class="char-info" hidden="true">' +
				'<img src="' + state.character.imagePath + '/standard_fantastic.' + state.character.imageExtension + '" class="char-img">' +
				'<div class="char-descrip">' +
					'<h3>' + state.character.name + '</h3>' +
				'</div>' +
			'</div>'
		);
	} else {
		// display no results
		$('.js-character-section').html('<p>No results</p>');
	}
	$('.char-info').fadeIn(1000);
}

function displayComicCards(state) {
	/* increment state.totalRowsDisplayed to allow dynamic cardRowA + cardRowB values, 
	which allows rendering of only the rows that are being appended. */
	state.totalRowsDisplayed += 2; 
	var cardRowA = '<div class="js-search-results-' + (state.totalRowsDisplayed - 1).toString() + ' row" hidden="true">';
	var cardRowB = '<div class="js-search-results-' + state.totalRowsDisplayed.toString() + ' row" hidden="true">';
	var comicCounter = 0;
	// verify comics were returned, then display comic cards
	if (state.totalResults > 0) {
		for (i=state.comicsStartPoint; i < (state.comicsStartPoint + displayAtATime); i++) {
			// url that API returns if no image accompanies the comic object
			var noImgUrl = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';
			// filters out comic objects without images
			if (state.comics.comicImgPath !== noImgUrl) {
				var htmlFrame = 
					'<div class="col-3">' +
						'<div class="cover-container js-cover-container">' +
							'<div class="comic-info">' +
								'<a href="' + state.comics[i].comicLink + '">' + 
									'<img src="' + state.comics[i].comicImgPath +'/detail.' + state.comics[i].comicImgExtension + '" class="comic-img">' + 
								'</a>' +
								'<div class="comic-descrip">' +
									'<h3>' + state.comics[i].comicTitle + '</h3>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
				// controls which element the results get rendered into
				if (comicCounter < coversPerRow) {
					cardRowA += htmlFrame;
				} else {	
					cardRowB += htmlFrame;
				}
				comicCounter++;
			}
		}
		cardRowA += '</div>';
		cardRowB += '</div>';
		// increments the starting point for the loop that builds the html frames
		state.comicsStartPoint += displayAtATime;
	} else {
		cardRowA += '<p>No Results</p>';
	}
	// Appends comic cards to DOM
	$('.js-comic-section').append(cardRowA + cardRowB);
	// fades in comic cards
	$('.js-search-results-' + (state.totalRowsDisplayed - 1).toString()).fadeIn(1000);
	$('.js-search-results-' + state.totalRowsDisplayed.toString()).fadeIn(1000);
	// Renders attribution info
	$('footer').html(state.attributionHTML);
}

// reset UI
function resetUi() {
	$('.js-character-section').html('');
	$('.js-comic-section').html('');
}

// callback to render character card and first 8 comic cards, attached to a submit listener
function watchSubmit() {
	$('.js-search-form').submit(function (event){
		event.preventDefault();
		$('.app-instructions').fadeOut(200);
		// reset search-result area
    $('.js-search-results-1').html('');
		$('.js-search-results-2').html('');
		// reset state and UI
		state = {attributionHTML: '' , character: {id: null, name: '', imagePath: '', imageExtension: ''}, comics: [], comicsStartPoint: 0, comicsApiCallOffset: 0, totalRowsDisplayed: 0,totalResults: 0};
		resetUi();
		// Api calls and rendering
		getCharacterInfo(state, $(this).find('.js-search-input').val());
		// Search input reset 
		$('.js-search-input').val('');
    $('.js-search-input').focus();
    // fade in more comics button
    // $('.button-div').fadeIn(500);
	});
}

// function to listen for "see more comics"
function watchMoreComics() {
	$('.button-div').on('click', '.more-comics', function(event) {
		$('.button-div').fadeOut(500);
		// the comicsStartPoint variable has been updated, so calling the function below displays the next round of comic cards
		getComicInfo(state, function(state) {
			displayComicCards(state);
			if (state.comicsApiCallOffset <= state.totalResults) {
				$('.button-div').fadeIn(500);
			}
		});
	});
}

$(function(){
	watchSubmit();
	watchMoreComics();
});