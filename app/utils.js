var request = require("./request.js");
var view = require("./view.js");

var lang = "it";

//match input with busstops name and citys
function matchInput(input, callback) {
	var list = getBusstopList();
	var searchTerm = input.split(" ");
	var matchingElements = [];
	for (var busStop in list) {
		var found = true;
		for(var i = 0; i < searchTerm.length && found; i++) {
			var pattern = new RegExp(searchTerm[i],"ig");
			found = list[busStop].city[lang].match(pattern);
		if (found === null)
			found = list[busStop].name[lang].match(pattern);
		}

		if (found !== null) {
			matchingElements.push(list[busStop]);
			request.downloadBoard(busStop);
		}
	}
	console.log("[LOG] matching elemetens", matchingElements);
	callback(matchingElements);
}

// Return the busstop list as json which is stored in the localStorage
function getBusstopList() {
	if(localStorage.busstops)
		return JSON.parse(localStorage.busstops);
	else
		console.error("No data");
}

function clearLocalStorage() {
	if (localStorage.busstops)
		localStorage.removeItem(busstops);
}

module.exports.clearLocalStorage =  clearLocalStorage;
module.exports.getBusstopList = getBusstopList;
module.exports.matchInput = matchInput;
