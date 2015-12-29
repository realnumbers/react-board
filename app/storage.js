var request = require("./request.js");
var storage = {};
storage.stationboard = undefined;
storage.favorites = undefined;
storage.busstops = undefined;

//load old storage from localStorage
try {
  storage = JSON.parse(localStorage.storage);
}
catch (e) {
  console.log("Storage in the localStorage is not a valid JSON, replace it with a emty JSON");
  storage = {};
  storage.stationboard = undefined;
  storage.favorites = undefined;
  storage.busstops = undefined;
  saveStorage();
}

function saveStorage() {
  localStorage.storage = JSON.stringify(storage);
}

function getBusstops(id, callback) {
  if (storage.busstop !== undefined) {
    if(id === "*")
      callback(storage.busstops);
    else
      callback(storage.busstops[id]);
  }
  else {
    request.busstops(function (data) {
      storage.busstops = data;
      if(id === "*")
        callback(storage.busstops);
      else
        callback(storage.busstops[id]);
      saveStorage(); 
    });
  }
}

function getFavorites(id, callback) {
  if (storage.favorites !== undefined) {
    if(id === "*")
      callback(storage.favorites);
    else
      callback(storage.favorites[id]);
  }
  else {
    callback({});
  }
}

function removeFavorites(id, callback) {
  delete storage.favorites[id];
  saveStorage();
}

function getStationboard(id, callback)  {
  if (storage.stationboard !== undefined && 
      storage.stationboard[id] !== undefined &&
      stprage.stationboard[id].expiry > (new Date().getTime())) {
        callback(storage.stationboard[id]);
      }
      else {
        request.stationboard(function (data) {
          data.expiry = (new Date().getTime()) + 60000;
          storage.stationboard[id] = data;
          callback(storage.stationboard[id]);
          saveStorage(); 
        });
      }
}


module.exports.busstops = {};
module.exports.busstops.get = getBusstops;
module.exports.favorites  = {};
module.exports.favorites.get = getFavorites;
module.exports.favorites.remove = removeFavorites;
module.exports.stationboard = {};
module.exports.stationboard.get = getStationboard;
