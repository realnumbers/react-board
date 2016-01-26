//var ws = new WebSocket('ws://sparber.net:62249');
var storage = require('./storage.js');
var cbTasks = {};
var ws;

function startSocket(callback) {
  //ws = new WebSocket('ws://127.0.0.1:8000');
  ws = new WebSocket('ws://sparber.net:62249');

  ws.onopen = function (event) {
    callback();
  };

  ws.onerror = function (event) {
    console.log("Got error from websocket", event);
    //callback(event);
  };

  ws.onclose = function (event) {
    console.log("Websocket got closed, reopen it");
    ws = new WebSocket('ws://sparber.net:62249');
    //ws = new WebSocket('ws://127.0.0.1:8000');
    //callback(event);
  }

  ws.onmessage = function(response, flags) {
    var cbList = {};
    var data = JSON.parse(response.data);

    cbList.busstopResponse = function (id, data) {
      console.log(data);
      storage.busstops.save(data);
      cbTasks[id](data);
    }

    cbList.stationboardResponse = function (id, data) {
      console.log(data);
      cbTasks[id](data);
    }

    console.log(data);
    cbList[data.cb](data.id, data.res);
  }
}

//function to request the stationbpard for an stop by id
function requestBoard(id, cb) {
  console.log("Request board for: " + id);
  /*CONNECTING  0   The connection is not yet open.
    OPEN  1   The connection is open and ready to communicate.
    CLOSING   2   The connection is in the process of closing.
    CLOSED  3   The connection is closed or couldn't be opened.
    */
  if (ws.readyState == 1) {
    ws.send(JSON.stringify({call:"stationboardRequest", query:id}));
    cbTasks[id] = cb;
  }
  else
    console.log("Socket not ready, has state " + ws.readyState)
}

//function to request all busstops to save them in the localstorage for later use
function requestStops(cb) {
  console.log("Request all busstops and station and save them to the localstorage");
  /*CONNECTING  0   The connection is not yet open.
    OPEN  1   The connection is open and ready to communicate.
    CLOSING   2   The connection is in the process of closing.
    CLOSED  3   The connection is closed or couldn't be opened.
    */
  if (storage.busstops.get() === undefined) {
    if (ws.readyState == 1) {
      ws.send(JSON.stringify({call:"busstopRequest", query: "*"}));
      cbTasks["*"] = cb;
    }
    else
      console.log("Socket not ready, has state " + ws.readyState)
  }
  else {
    cb(storage.busstops.get());
  }
}

module.exports.start = startSocket;
module.exports.stationboard = requestBoard;
module.exports.requestStops = requestStops;
