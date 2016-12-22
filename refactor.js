function getComicCovers(object) {
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
		offset: 0,
	};
	var apiArray = [];
	while (apiArray.length < 8) {
		$.getJSON(endpoint, comicQuery, checkComicCover);
		comicQuery.offset++;
	}
	var row1 = apiArray.slice(0,4);
	var row2 = apiArray.slice(4);
	displayComicsInfo(row1, row2);
}

function checkComicCover(apiJSON) {
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

function displayComicsInfo(array1, array2) {
	$('.js-search-results-1').html(array1);
	$('.js-search-results-2').html(array2);
}