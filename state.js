// endpoint variable
const marvelCharacterEndPoint = 'https://gateway.marvel.com/v1/public/characters';

// constant variables

// variable to hold state
// function initstate
	var state = {
		character: {
			name: '',
			imagePath: '',
			imageExtension: ''
		},
		comics: [],
		comicsStartPoint: 0,
		totalResults: 0
	};

// functions to fetch info from API

	// get character ID
	function getCharacterId(state, searchTerm) {
		var characterQuery = {
			name: searchTerm,
			apikey: 'b5a985cb816977af5a8da412277c108b'
		};
	 	$.getJSON(marvelCharacterEndPoint, characterQuery, function(object) {
	 		pushCharacterObject(state, object);
	 		displayCharacterCard(state);
	 		getComicInfo(state, object);
	 	});
	}

	// get comic covers
	function getComicInfo(state, resultObject) {
	if (resultObject.data.count > 0) {
		var id = resultObject.data.results[0].id;
		var endpoint = 'https://gateway.marvel.com/v1/public/characters/' + id + '/comics';
		var comicQuery = {
			characterId: id,
			format: 'comic',
			formatType: 'comic',
			noVariants: false,
			limit: 16,
			orderBy: '-onsaleDate',
			apikey: 'b5a985cb816977af5a8da412277c108b'
		};
		$.getJSON(endpoint, comicQuery, function(object) {
			pushComicObjects(state, object);
			displayComicCards(state, object);
		});
	}
}

// functions to alter state
	
	// push character object to state
	function pushCharacterObject(state, characterObject) {
		// verify object was returned, then push object to state
		if (characterObject.data.count > 0) {
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
						comicImgExtension: item.thumbnail.extension
					}
				);
			});
			state.totalResults = comicObject.data.total;
		}
	}

// functions to render state

	// render character card
	function displayCharacterCard(state) {
		// check to see if results were returned
		if (state.character.name !== '') {
			$('.js-character-section').html(
				'<div class="char-info">' +
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
	}

	// render comic cards
	function displayComicCards(state, resultObject){ // add display at a time variable
		var apiResults1 = '';
		var apiResults2 = '';
		var comicCounter = 0;
		// verify comics were returned, then display comic cards
		if (resultObject.data.count > 0) {
			for (i=state.comicsStartPoint; i < (state.comicsStartPoint + 8); i++) {
				// url that API returns if no image accompanies the comic object
				var noImgUrl = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
				// filters out comic objects without images
				if (resultObject.data.results[i].thumbnail.path !== noImgUrl) {
					var htmlFrame = 
						'<div class="col-3">' +
							'<div class="cover-container js-cover-container">' +
								'<div class="comic-info">' +
									'<a href="' + resultObject.data.results[i].urls[0].url + '">' + 
										'<img src="' + resultObject.data.results[i].thumbnail.path +'/detail.' + resultObject.data.results[i].thumbnail.extension + '" class="comic-img">' + 
									'</a>' +
									'<div class="comic-descrip">' +
										'<h3>' + resultObject.data.results[i].title + '</h3>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>';
					// controls which element the results get rendered into
					if (comicCounter < 4) {
						apiResults1 += htmlFrame;
					} else {	
						apiResults2 += htmlFrame;
					}
					comicCounter++;
				}
			}
			state.comicsStartPoint += 8;
		} else {
			apiResults1 += '<p>No Results</p>';
		}
		// Renders search results
		$('.js-search-results-1').html(apiResults1);
		$('.js-search-results-2').html(apiResults2);
		// Render "More Comics Button"
		$('.button-div').show();
		// Renders attribution info
		$('footer').html(resultObject.attributionHTML);
	}

// event listeners to call functions

	// callback to render character card and first 8 comic cards, attached to a submit listener
	function watchSubmit() {
		$('.js-search-form').submit(function (event){
			event.preventDefault();
			$('.button-div').hide();
			$('.app-instructions').hide();
			// Search-result area reset
	    $('.js-search-results-1').html('');
			$('.js-search-results-2').html('');
			// reset state
			state = {
				character: {
					name: '',
					imagePath: '',
					imageExtension: ''
				},
				comics: [],
				comicsStartPoint: 0,
				totalResults: 0
			};
			// Api calls and rendering
			console.log($('.js-search-input').val());
			getCharacterId(state, $(this).find('.js-search-input').val());
			// Search input reset 
			$('.js-search-input').val('');
	    $('.js-search-input').focus();
		});
	}

	// function to listen for "see more comics"
	function watchMoreComics() {
	$('.button-div').on('click', '.more-comics', function(event) {
		displayComicCards();
	});
}

$(function(){
	watchSubmit();
	watchMoreComics();
});