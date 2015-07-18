var request = require("./request.js");
var View = require("./view.js");
var React = require('react');

request.loadBusstopsList();
React.render(<View />, document.body);
