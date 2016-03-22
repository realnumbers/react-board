var React = require('react');
var utils = require('./utils.js');
var request = require('./request.js');
//var moment = require('moment');

"use strict";

var BusStops = React.createClass({
  getInitialState: function(){
    return {
      list: []
    }
  },
  createFav: function() {
    if (this.props.fav.length > 0) {
      return (
          <section>
          <h1 className="favorites-title">Favorites</h1>
          <StationList stations={this.props.fav} isFav={"fav"} />
          </section>
          );
    }
    else {
      return (
          <section />
          );
    }
  },
  render: function(){
    return (
        <section className="scroll-container">
        <StationList stations={this.props.stationboard} isFav={""} />
        {this.createFav()}
        </section>
        );
  }
});

var StationList = React.createClass({
  render: function(){
    var stationList = this.props.stations.map(function(station, index){
      return (
          <Station key={station.id + this.props.isFav} stop={station} isFav={this.props.isFav}/>
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
    return {fav: this.props.stop.fav, visible: false};
    //return {fav: false, visible: false};
  },
  handleClick: function(e) {
    e.stopPropagation();
    utils.saveFav(this.props.stop.id, !this.state.fav);
    this.setState({fav: !this.state.fav});
  },
  update: function() {
    this.setState({loading: true});
    request.stationboard(this.props.stop.id, function (data) {
      data = utils.l10n(navigator.language, data);
      this.setState({loading: false, visible: true, stationboard: data});
      setTimeout(function() {
        console.log("Update stationboard");
        if (this.state.visible)
          this.update();
      }.bind(this), 60000);
    }.bind(this));
  },
  toggleHandler: function(e) {
    if (!this.state.visible) {
      this.update();
    }
    else
      this.setState({visible: false});
  },
  render: function() {
    var body = (this.state.visible)? <BusList isFav={this.props.isFav} data={this.state.stationboard} /> : "";
    var spinner = (this.state.loading)? <img className="spinner" src="img/loading.svg" alt="Loading..." /> : "";
    return (
        <article onClick={this.toggleHandler} className={(this.state.visible || this.state.loading)? "station expanded" : "station"}>
        <header className="station-header" >
        <h1 className="station-title" > {this.props.stop.name + ", " + this.props.stop.city}</h1>
        <button className={(this.state.fav)? "station-star star" : "station-star nostar"} onClick={this.handleClick} >
        </button>
        </header>
        {body}
        {spinner}
        </article>
        );
  }
});

var BusList = React.createClass({
  render: function() {
    var isFav = this.props.isFav;
    if (this.props.data.length > 0) {
    var buses = this.props.data.map(function(bus){
      var time = (new Date(bus.departure)).toLocaleTimeString("it", {hour: '2-digit', minute:'2-digit'})
        var style = {"backgroundColor": (bus.color)? bus.color: "#BF00FF"};
      return (
          <article key={JSON.stringify(bus) + "isFav=" + isFav} className="bus">
          <label className="line" style={style}>{bus.number}</label>
          <label className="time">{time}</label>
          <label className="time">{bus.delay}</label>
          <label className="endstation">{bus.destination}</label>
          </article>
          );
    });
    //add more connection btn
    var buses = <section>{buses} <LoadMore/> </section>;
    }
    else
      var buses = <article className="no-connections">No Connections</article>;
    return (
        <section className="bus-list">
        {buses}
        </section>
        );
  }
});

var LoadMore = React.createClass({
  requestMore: function (e) {
    e.stopPropagation();
    console.log("Not yet supported");
  },
  render: function () {
    return <article onClick={this.requestMore} className="more-btn">Load more</article>
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
    this.setState({stationboard: data});
  },
  getInitialState: function() {
    return({stationboard: []});
  },
  render: function() {
    console.log(this.props);
    return(
        <section id="content">
        <header id="search" className="header-bar">
        <Search handler={this.handleNewSerach} />
        </header>
        <BusStops fav={this.props.fav} stationboard={this.state.stationboard} />
        </section>
        );
  }
});

module.exports = View;
