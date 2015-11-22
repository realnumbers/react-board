//var request = require("./request.js");
var request = require('./request.js');
var utils = require("./utils.js");

//start to render when the socket is open
request.start(function () {
  utils.render({});
});
