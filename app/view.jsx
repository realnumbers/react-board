/*** @jsx React.DOM */
var React = require('react');
var utils = require('./utils.js');

"use strict";

var lang = "it";

//var data = [
/*{
  de: 'Waltherplatz',
  it: 'Piazza Walther',
  fav: false,
  buses: [
  {line: '11', h: 12, min: 34, de: 'Firmian', it: 'Firmiano'},
  {line: '6', h: 12, min: 56, de: 'Perathonerstraße', it: 'Via Perathoner'},
  {line: '4', h: 13, min: 11, de: 'Bahnhof Bozen', it: 'Stazione Bolzano'},
  {line: '11', h: 12, min: 14, de: 'Firmian', it: 'Firmiano'}
  ]
},
{
  de: 'Perathoner',
  it: 'Piazza Walther',
  fav: false,
  buses:
  [
  {line: '11', h: 12, min: 34, de: 'Firmian', it: 'Firmiano'},
  {line: '6', h: 12, min: 56, de: 'Perathonerstraße', it: 'Via Perathoner'},
  {line: '4', h: 13, min: 11, de: 'Bahnhof Bozen', it: 'Stazione Bolzano'},
  {line: '11', h: 12, min: 14, de: 'Firmian', it: 'Firmiano'}
  ]
},
{
  de: 'Walter Tobagi Passage',
  it: 'Piazza Walther',
  fav: true,
  buses:
  [
  {line: '11', h: 12, min: 34, de: 'Firmian', it: 'Firmiano'},
  {line: '6', h: 12, min: 56, de: 'Perathonerstraße', it: 'Via Perathoner'},
  {line: '4', h: 13, min: 11, de: 'Bahnhof Bozen', it: 'Stazione Bolzano'},
  {line: '11', h: 12, min: 14, de: 'Firmian', it: 'Firmiano'}
  ]
}
*/
//];

var BusStops = React.createClass({
  getInitialState: function(){
    return {
      list: []
    }
  },
  render: function(){
    if (this.state.list.length === 0) {
      return (
        <section className="scroll-container">
        </section>
      );
      }
      else {
        return (
        <section className="scroll-container">
          <StationList stations={this.state.list} />
        </section>
    );
  }
}
});

var StationList = React.createClass({
  render: function(){
    var stationList = this.props.stations.map(function(station, index){
      return (
        <Station data={station} />
      );
    }.bind(this));

    return (
      <div>
        {stationList}
      </div>
    );
  }

});

var Station = React.createClass({
  getInitialState: function() {
    return {fav: this.props.data.fav, visible: false};
  },
  handleClick: function() {
    this.setState({fav: !this.state.fav});
  },
	toggleHandler: function() {
		this.setState({visible: !this.state.visible});
	},
  render: function() {
		var body = (this.state.visible)? <BusList data={this.props.data.buses} /> : "";
    return (
      <article className={(this.state.visible)? "station expanded" : "station"}>
        <header className="station-header">
          <h1 className="station-title" onClick={this.toggleHandler}>{this.props.data.name[lang] + " - " + this.props.data.city[lang]}</h1>
          <button className={(this.state.fav)? "station-star star" : "station-star nostar"} onClick={this.handleClick} >
          </button>
        </header>
				{body}
      </article>
    );
  }
});

var BusList = React.createClass({
  render: function() {
    var buses = this.props.data.map(function(bus){

      return (
        <article className="bus">
          <label className="line" style={{"backgroundColor": "red"}}>{bus.line}</label>
          <label className="time">{bus.min}</label>
          <label className="endstation">{bus.de}</label>
        </article>
      );
    });
    return (
      <section className="bus-list">
        {buses}
      </section>
    );
  }
});

var Search = React.createClass({
	handleInput: function(el) {
		var input = document.getElementById("searchInput").value;
    this.props.handler(input);
	},
  render: function() {
  return (
      <div className="search-container">
      <input onInput={this.handleInput} id="searchInput" className="search-input" placeholder="Search for bus stops..."></input>
      <button onClick={this.handleInput} value="" className="search-button"></button>
      </div>
    );
  }
});

var View = React.createClass({
  handleNewSerach: function(input) {
      console.log("New State beacause of new serach input");
      utils.matchInput(input, this.updateData);
  },
  updateData: function(data) {
    this.setState({list: data});
  },
  getInitialState: function() {
    return({});
  },
	render: function() {
			return(
				<section id="content">
					<header id="search" className="header-bar">
						<Search handler={this.handleNewSerach} />
					</header>
  				<BusStops/>
				</section>
		);
	}
});

module.exports = View;
