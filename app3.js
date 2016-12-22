var marvelCharacterEndPoint = 'https://gateway.marvel.com/v1/public/characters';

function getJsonObject(endpoint, query) {
	var apiJson = $.getJSON(endpoint, query);
	return JSON.parse(apiJson);
}

function getCharacterId(searchTerm) {
	var characterQuery = {
		name: searchTerm,
		apikey: 'b5a985cb816977af5a8da412277c108b',
	};
	var charJSON = getJsonObject(marvelCharacterEndPoint, characterQuery);
	return charJSON.data.results[0].id;
}

function getComicCovers(searchTerm) {
	var id = getCharacterId(searchTerm);
	var endpoint = 'https://gateway.marvel.com/v1/public/characters/' + id + '/comics';
	var comicQuery = {
		characterId: id,
		format: 'comic',
		formatType: 'comic',
		noVariants: false,
		limit: 1,
		orderBy: 'onsaleDate',
		apikey: 'b5a985cb816977af5a8da412277c108b',
		offset: 0
	};
	var htmlDataArray = [];
	while (htmlDataArray.length < 8) {
		getJsonObject(endpoint, comicQuery);
		comicQuery.offset++;
	}
}