var request = require("./request.js");
var view = require("./view.jsx");
var storage = require('./storage.js');
//var sortzzy = require('sortzzy');
//var levenshtein = require('fast-levenshtein');
var React = require('react');
var View = require("./view.jsx");
var cache = {};


//match input with busstops name and citys
function findSuggests(lang, query, callback) {
  lang = (lang.substr(0, 2) === "de") ? "de" : "it";
  request.requestStops(function(busstopList) {
    if (query !== undefined && query !== "") {
      callback(matchInput(busstopList, lang, query));
    }
    else
      callback([]);
  });
}

function l10n(lang, data) {
  lang = (lang.substr(0, 2) === "de") ? "de" : "it";
  console.log("Use this lang: " + lang);
  data.forEach(function (bus) {
    bus.destination = storage.busstops.get(bus.destination)[lang].name + 
      ", " +
      storage.busstops.get(bus.destination)[lang].city;
  });
  return data;
}

function saveFav(id, state) {
  console.log("add " + id + " to favs");
  var stops = storage.busstops.get();
  stops[id].fav = state; 
  storage.busstops.save(stops);
  render();
}

function getFav(lang) {
  lang = (lang.substr(0, 2) === "de") ? "de" : "it";
  var stops = storage.busstops.get();
  var result = [];
  for (var s in stops) {
    if (stops[s].fav === true) 
      result.push({name: stops[s][lang].name, city: stops[s][lang].city, id: s , fav: stops[s].fav});
  }
  return result;
}

function render(data) {
  React.render(<View data={data} fav={getFav(navigator.language)} />, document.body);
}

function matchInput(list, lang, query) {
  console.time("matchTime");
  var suggests = inputCache(query);
  var found;
  var j;
  if (query !== "") {
    if (suggests === undefined) {
      suggests = [];
      var input = query.split(" ");
      for (var stop in list) {
        j = 0;
        do {
          found = list[stop][lang].city.match(new RegExp(input[j], "i"));
          if (found === null)
            found = list[stop][lang].name.match(new RegExp(input[j], "i"));
          j++;
          //continue only if the first word was found
        } while (j < input.length && found !== null);
        if (found !== null)
          suggests[suggests.length] = {name: list[stop][lang].name, city: list[stop][lang].city, id: stop , fav: list[stop].fav};
        if (suggests.length > 4)
          break;
      }
    }
    //{name: busstopList[i][lang].name, city: busstopList[i][lang].city, id: i , fav: busstopList[i].fav}
    inputCache(query, suggests);
  }
  else 
    cache = undefined;
  console.timeEnd("matchTime");
  return suggests;
}

function minDistance() {
  var matching = [];
  for (stop in busstopList) {
    var score = sortzzy.levenshtein.levenshtein(busstopList[stop][lang].name + " " + busstopList[stop][lang].city, query);

    var notInserted = true;
    for (var i = 0; i < 5 && notInserted; i++) {
      if (matching[i] === undefined || score < matching[i].score) {
        var item = {"score": score,
          "name": busstopList[stop][lang].name,
          "city": busstopList[stop][lang].city,
          "id": stop + "-sug",
          "fav": busstopList[stop].fav};
        matching.splice(i, 0, item);
        notInserted = false;
      }
    }
  }
}

function inputCache(input, suggests) {
  if (suggests) {
    cache[input] = suggests;
  }
  else
    return cache[input];
}

module.exports.render = render;
module.exports.findSuggests = findSuggests;
module.exports.l10n = l10n;
module.exports.saveFav = saveFav;
module.exports.getFav = getFav;
