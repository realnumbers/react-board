var lang = "it"; // 0 for italian and 1 for german
var stopsList = getBusstopList();
var board = {};
var individualRankings = {
	//"id": rank,
	"516": -200
};

loadBusstopsList();

//downloadBoard();
function parseStop(stop) {
	var res = {};
	res.city = {};
	res.name = {};
	res.ids = [];

	/*  data[i].rank = 0;
			if (data[i].city[0] === "Bolzano")
			data[i].rank = 30;
			else if (data[i].city[0] === "Merano")
			data[i].rank = 20;
			else if (data[i].city[0] === "Lana")
			data[i].rank = 10;
			if (data[i].stop[0].match(/stazione/gi) !== null)
			data[i].rank += 20;
			if (individualRankings[data[i].busstops[0].ORT_NR] !== undefined)
			data[i].rank = individualRankings[data[i].busstops[0].ORT_NR];
			*/

	var string = parseString(stop.ORT_GEMEINDE);
	res.city.de = string[1];
	res.city.it = string[0];

	var string = parseString(stop.ORT_NAME);
	res.name.de = string[1];
	res.name.it = string[0];
	stop.busstops.forEach( function(el, index) {
		res.ids[index] = el.ORT_NR;
	});
	return res;
}

function mergeDuplicate(data, i) {
	if (i + 1 < data.length && data[i].ORT_NAME === data[i + 1].ORT_NAME &&
			data[i].ORT_GEMEINDE === data[i + 1].ORT_GEMEINDE) {
		data[i].busstops = data[i].busstops.concat(data[i + 1].busstops);
		data.splice(i + 1, 1);
	}

}

function parseList(stopsArray) {
	var stops = {};
	stopsArray.forEach( function(el, index, array) {
		mergeDuplicate(array, index);
		stops[el.busstops[0].ORT_NR] = parseStop(el);
	});
	return stops;
}


//match input with busstops name and citys
function matchInput(list, input, callback) {
	var searchTerm = input.split(" ");
	var matchingElements = [];
	for (var stop in list) {
		var found = true;
		for(var i = 0; i < searchTerm.length && found; i++) {
			var pattern = new RegExp(searchTerm[i],"ig");
			found = list[stop].city[lang].match(pattern);
		if (found === null)
			found = list[stop].name[lang].match(pattern);
		}

		if (found !== null) {
			matchingElements.push(list[stop]);
		}
	}
	downloadBoard(stop);
	callback(matchingElements);
}

function downloadBoard(id) {
	if (board[id] === undefined) {
		var apiUrl = "http://stationboard.opensasa.info/?type=jsonp&ORT_NR=" + id;
		request(apiUrl, stationSuccess, "JSONP", id);
		board[id] = {};
		board[id].runing = true;
	}
}

function stationSuccess(data, id) {
	board[id].runing = false;
	board[id].rides = data.rides;
}

// cache busstops
function loadBusstopsList() {
	//console.log("Start Request");
	var apiUrl =
		"http://opensasa.info/SASAplandata/?type=BASIS_VER_GUELTIGKEIT";
	request(apiUrl, validitySuccess, "jsonp");
}

function formatTime(time) {
	return time;
}

function validitySuccess(data) {

	if (!localStorage.version || localStorage.version != data[0].VER_GUELTIGKEIT) {
		clearLocalStorage();
		localStorage.version = data[0].VER_GUELTIGKEIT;
		if (!localStorage.busstops) {
			var apiUrl = "http://opensasa.info/SASAplandata?type=REC_ORT";
			request(apiUrl, busstopsSuccess, "jsonp");
		}
	}

}

function busstopsSuccess(data) {
	//console.log(data);
	localStorage.setItem('busstops', JSON.stringify(parseList(data)));
	stopsList = parseList(data);
}

// Return the busstop list as json which is stored in the localStorage
function getBusstopList() {
	if(localStorage.busstops)
		return JSON.parse(localStorage.busstops);
	else
		console.error("No data");
}


// callback is the name of the callback arg
function request(urlAPI, success, callback, index) {
	jsonp(urlAPI, callback, function(data) {
		success(data, index);
	});
}

function parseString(str) {
	// [0] is italian [1] is german
	str = str.split("-");
	str[0] = sanitizeNames(str[0]);
	str[1] = sanitizeNames(str[1]);
	if (str[0] === "")
		str[0] = str[1];
	if (str[1] === "")
		str[1] = str[0];
	return str;
}

function sanitizeNames(str) {
	var re = /^[a-z0-9]+$/i; // alphanumeric chars
	var i = 0;
	if (str !== undefined) {
		while (!re.test(str[i]) && i < str.length) {
			i++;
		}
		var j = str.length - 1;
		while (!re.test(str[j]) && j >= 0) {
			j--;
		}
		if (i >= str.length) return "";
		else return str.substring(i, j + 1);
	} else return "";
}

function jsonp(url, str, callback) {
	var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
	window[callbackName] = function(data) {
		delete window[callbackName];
		document.head.removeChild(script);
		callback(data);
	};

	var script = document.createElement('script');
	script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + str + '=' + callbackName;
	document.head.appendChild(script);
}

function clearLocalStorage() {
	if (localStorage.busstops)
		localStorage.removeItem(busstops);
}
