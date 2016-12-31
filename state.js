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
		totalResults: 0,
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
	 		getComicInfo(state);
	 	});
	}

	// get comic covers
	function getComicInfo(state) {
		/* The if statement below determines by what number the Api return limit and offset is muliplied by. This enables 
		the getComicInfo function to be attached to the More Comics button and reused. */
		var limitMultiplier, offsetMultiplier = null;
		/* on the first run, the multipliers are set in such a way 
		that the limit is set to 16 and the offset is set to 0*/
		if (state.comicsStartPoint === 0) {
			limitMultiplier = 2;
			offsetMultiplier = 0;
		// On the second run, the multipliers are such that the limit is set to 8 and the offset is set to 16
		} else if (state.comicsStartPoint === displayAtATime) {
			limitMultiplier = 1;
			offsetMultiplier = 2;
		// on any subsequent runs, the multiplers are such that the limit is 8 and the offset is incremented by 8
		} else {
			limitMultiplier = 1;
			offsetMultiplier = 1;
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
				limit: (displayAtATime * limitMultiplier),
				offset: (state.comicsApiCallOffset + (displayAtATime * offsetMultiplier)),
				orderBy: '-onsaleDate',
				apikey: 'b5a985cb816977af5a8da412277c108b'
			};
			$.getJSON(endpoint, comicQuery, function(object) {
				pushComicObjects(state, object);
				displayComicCards(state, object);
			});
			// increments state.comicsApiCallOffset by the amount of comic objects called
			state.comicsApiCallOffset += comicQuery.limit;
		}
	}

// functions to alter state
	
	// push character object to state
	function pushCharacterObject(state, characterObject) {
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

// functions to render state

	// render character card
	function displayCharacterCard(state) {
		// verify results were returned, then display character card
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

	function displayComicCards(state) {
		var comicCardsHTML = '';
		// verify comics were returned, then display comic cards
		if (state.totalResults > 0) {
			for (i=state.comicsStartPoint; i < (state.comicsStartPoint + displayAtATime); i++) {
				// url that API returns if no image accompanies the comic object
				var noImgUrl = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
				// filters out comic objects without images
				if (state.comics.comicImgPath !== noImgUrl) {
					var htmlFrame = 
						'<div class= row js-search-results-' + (i+1) + '>' + 
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
							'</div>' +
						'</div>';
					comicCardsHTML += htmlFrame;
				}
			}
			state.comicsStartPoint += displayAtATime;
		} else {
			comicCardsHTML += '<p>No Results</p>';
		}
		// Renders search results
		$('.js-comic-section').html(comicCardsHTML);
		// Render "More Comics Button"
		$('.button-div').show();
		// Renders attribution info
		$('footer').html(state.attributionHTML);
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
			state = {attributionHTML: '' , character: {id: null, name: '', imagePath: '', imageExtension: ''}, comics: [], comicsStartPoint: 0, comicsApiCallOffset: 0, totalResults: 0};
			// Api calls and rendering
			getCharacterId(state, $(this).find('.js-search-input').val());
			// Search input reset 
			$('.js-search-input').val('');
	    $('.js-search-input').focus();
		});
	}

	// function to listen for "see more comics"
	function watchMoreComics() {
	$('.button-div').on('click', '.more-comics', function(event) {
		// the comicsStartPoint variable has been updated, so calling the function below displays the next round of comic cards
		getComicInfo(state);
	});
}

$(function(){
	watchSubmit();
	watchMoreComics();
});