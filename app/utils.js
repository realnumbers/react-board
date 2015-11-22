var request = require("./request.js");
var view = require("./view.jsx");
var storage = require('./storage.js');
var sortzzy = require('sortzzy');


//match input with busstops name and citys
function findSuggests(lang, query, callback) {
  lang = (lang.substr(0, 2) === "de") ? "de" : "it";
  request.requestStops(function(busstopList) {
    // Create the model to match against 
    if (query !== undefined && query !== "") {
      var matching = [];
      for (i in busstopList) {
        matching.push({name: busstopList[i][lang].name, city: busstopList[i][lang].city, id: i });
      }

      var model = {
        name: query || "",
        city: query || ""
      }

      // Define the fields  
      var fields = [
      {name: 'name', type: 'string', weight: 1, options: {ignoreCase: true}},
      {name: 'city', type: 'string', weight: 1, options: {ignoreCase: true}},
      ]

      var result = sortzzy.sort(matching, model, fields, {dataOnly: true});
      callback(result.slice(0, 20));
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

module.exports.findSuggests = findSuggests;
module.exports.l10n = l10n;
