"use strict";
var React = require('react');
var utils = require('./utils.js');
var request = require('./request.js');

var StationList = React.createClass({
  render: function(){
    var list = this.props.content.map(function(item, index){
      return <DepartureList key={item.id} item={item} />;
    });
    return (
      <div>
        {list}
      </div>
    );
  }
});

var DepartureList = React.createClass({
  getInitialState: function() {
    return {visible: false};
  },
  toggleFav: function(e) {
    e.stopPropagation();
    utils.saveFav(this.props.item.id, !this.props.item.fav);
  },
  toggleStationboard: function(e) {
    this.setState({visible: !this.state.visible});
  },
  render: function() {
    var body = (this.state.visible)? <Stationboard departures={this.props.item.departures} /> : "";
    body = (this.state.loading)? <img className="spinner" src="img/loading.svg" alt="Loading..." /> : body;
    return (
      <article onClick={this.toggleStationboard} className={(this.state.visible || this.state.loading)? "station expanded" : "station"}>
        <header className="station-header" >
          <h1 className="station-title" > {this.props.item.name + ", " + this.props.item.city}</h1>
          <button className={(this.props.item.fav)? "station-star star" : "station-star nostar"} onClick={this.toggleFav} >
          </button>
        </header>
        {body}
      </article>
    );
  }
});

var Stationboard = React.createClass({
  render: function() {
    if (this.props.departures) {
      var departures = this.props.departures.map(function(bus){
        var time = (new Date(bus.departure)).toLocaleTimeString("it", {hour: '2-digit', minute:'2-digit'})
        var style = {"backgroundColor": ((bus.color)? bus.color: "#BF00FF")};
        return (
          <article key={bus.id} className="bus">
            <label className="line" style={style}>{bus.number}</label>
            <label className="time">{time}</label>
            <label className="time">{bus.delay}</label>
            <label className="endstation">{bus.destination}</label>
          </article>
        );
      });
    }
    else
      var departures = <label className="no-connections">No Connections</label>;
    return (
      <section className="bus-list">
        {departures}
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
    utils.findSuggests(navigator.language, input);
  },
  render: function() {
    return(
      <section id="content">
        <header id="search" className="header-bar">
          <Search handler={this.handleNewSerach} />
        </header>
        <section className="scroll-container">
          <StationList content={this.props.stationboard} />
          <h1 className="favorites-title">Favorites</h1>
          <StationList content={this.props.fav} />
        </section>
      </section>
    );
  }
});

module.exports = View;
