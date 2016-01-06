var view = require("./view.jsx");
var storage = require('./storage.js');
//var sortzzy = require('sortzzy');
//var levenshtein = require('fast-levenshtein');
var React = require('react');
var View = require("./view.jsx");
var cache = {};


//match input with busstops name and citys
function findSuggests(lang, query) {
  lang = l6e(lang);
  if (query !== undefined && query !== "") {
    storage.suggests.get(query, function (s) {
      if (s == undefined) {
        storage.busstops.get("*", function (stops) {
          var suggests = matchInput(stops, lang, query);
          storage.suggests.save(query, suggests);
        });
      }
      //DO stuff
    });
  }
}

function matchInput(list, lang, query) {
  lang = l6e(lang);
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

//is not in use
/*function minDistance() {
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
  */

function inputCache(input, suggests) {
  if (suggests) {
    cache[input] = suggests;
  }
  else
    return cache[input];
}

function l10nDestination(lang, data) {
  lang = l6e(lang);
  console.log("Use this lang: " + lang);
  data.forEach(function (bus) {
    bus.destination = storage.busstops.get(bus.destination)[lang].name + 
      ", " +
        storage.busstops.get(bus.destination)[lang].city;
  });
  return data;
}

function parseFavorites(lang, fav) {
  lang = l6e(lang);
  var result = [];
  if (fav !== undefined) {
    for (var f in fav) {
      result.push({name: fav[f][lang].name, city: fav[f][lang].city, id: s , fav: true});
    }
  }
  return result;
}

function saveFav(id, state) {
  if (state === true)
    storage.favorites.add(id);
  else
    storage.favorites.remove(id);
}

function render(suggests, stationboard) {
  var lang = navigator.language;
  storage.favorites.get("*", function (favorites) {
    React.render(<View stationboard={stationboard || []} suggests={suggests || []} favorites={parseFavorites(lang, favorites)} />, document.body);
  });
}

function l6e(lang) {
  return ((lang.substr(0, 2) === "de") ? "de" : "it");
}

module.exports.render = render;
module.exports.findSuggests = findSuggests;
module.exports.saveFav = saveFav;
