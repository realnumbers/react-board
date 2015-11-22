/*** @jsx React.DOM */
var React = require('react');
var utils = require('./utils.js');
var request = require('./request.js');
var moment = require('moment');

"use strict";

var BusStops = React.createClass({
  getInitialState: function(){
    return {
      list: []
    }
  },
  render: function(){
    console.log(this.props.stationboard);
    var list = this.props.stationboard;
    if (list.length === 0) {
      return (
          <section className="scroll-container">
          </section>
          );
    }
    else {
      return (
          <section className="scroll-container">
          <StationList stations={list} />
          </section>
          );
    }
  }
});

var StationList = React.createClass({
  render: function(){
    var stationList = this.props.stations.map(function(station, index){
      return (
          <Station stop={station} />
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
    //return {fav: this.props.data.fav, visible: false};
    return {fav: false, visible: false};
  },
  handleClick: function() {
    this.setState({fav: !this.state.fav});
  },
  toggleHandler: function() {
    if (!this.state.visible) {
      request.stationboard(this.props.stop.id, function (data) {
        data = utils.l10n(navigator.language, data);
        this.setState({visible: true, stationboard: data});
      }.bind(this));
    }
    else
        this.setState({visible: false});
  },
  render: function() {
    var body = (this.state.visible)? <BusList data={this.state.stationboard} /> : "";
    return (
        <article className={(this.state.visible)? "station expanded" : "station"}>
        <header className="station-header">
        <h1 className="station-title" onClick={this.toggleHandler}>{this.props.stop.name + ", " + this.props.stop.city}</h1>
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
      var time = (new Date(bus.departure)).toLocaleTimeString("it", {hour: '2-digit', minute:'2-digit'})
      var style = {"backgroundColor": (bus.color)? bus.color: "#BF00FF"};
      return (
          <article className="bus">
          <label className="line" style={style}>{bus.number}</label>
          <label className="time">{time}</label>
          <label className="time">{bus.delay}</label>
          <label className="endstation">{bus.destination}</label>
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
    utils.findSuggests(navigator.language, input, this.updateData);
  },
  updateData: function(data) {
    console.log("New State beacause of new serach input, data: ", data);
    this.setState({stationboard: data});
  },
  getInitialState: function() {
    return({stationboard: []});
  },
  render: function() {
    return(
        <section id="content">
        <header id="search" className="header-bar">
        <Search handler={this.handleNewSerach} />
        </header>
        <BusStops stationboard={this.state.stationboard} />
        </section>
        );
  }
});

module.exports = View;
