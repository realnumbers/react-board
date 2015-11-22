//var request = require("./request.js");
var React = require('react');
var request = require('./request.js');
var View = require("./view.jsx");

//start to render when the socket is open
request.start(function () {
  React.render(<View />, document.body);
});
