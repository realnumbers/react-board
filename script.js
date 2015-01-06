"use strict";

/*** @jsx React.DOM */

var data = [
{
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
}];

var BusStops = React.createClass({
  render: function(){
    return (
      <section className="scroll-container">
        <StationList stations={this.props.list} />
      </section>
    );
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
    return {fav: this.props.data.fav};
  },
  handleClick: function() {
    this.setState({fav: !this.state.fav});
  },
  render: function() {
    console.log("yo");
    console.log(this.props.data.buses);
    return (
      <article className="station expanded">
        <header className="station-header">
          <h1 className="station-title">{this.props.data.de}</h1>
          <button className={(this.state.fav)? "station-star star" : "station-star nostar"} onClick={this.handleClick} >
          </button>
        </header>
        <BusList data={this.props.data.buses} />
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
  render: function() {
  return (
      <div className="search-container">
      <input className="search-input" placeholder="Search for bus stops..."></input>
      <button value="" className="search-button"></button>
      </div>
    );
  }
});

render();
function render() {
React.render(
  <BusStops list={data} />,
  document.getElementById('content')
);
}

React.render(
  <Search/>,
  document.getElementById('search')
);
