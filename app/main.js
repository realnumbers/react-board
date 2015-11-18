//var request = require("./request.js");
var React = require('react');
var View = require("./view.jsx");

//request.loadBusstopsList();
React.renderComponent(View(), document.getElementById('content'));
//React.render(<View />, document.body);
