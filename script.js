/*** @jsx React.DOM */

var data = [
{
  de: 'Waltherplatz',
  it: 'Piazza Walther',
  fav: false,
  buses: [
  {line: '11', h: 12, min: 34, de: 'Firmian', it: 'Firmiano'},
  {line: '6', h: 12, min: 56, de: 'Perathonerstraße', it: 'Via Perathoner'},
  {line: '4', h: 13, min: 01, de: 'Bahnhof Bozen', it: 'Stazione Bolzano'},
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
  {line: '4', h: 13, min: 01, de: 'Bahnhof Bozen', it: 'Stazione Bolzano'},
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
  {line: '4', h: 13, min: 01, de: 'Bahnhof Bozen', it: 'Stazione Bolzano'},
  {line: '11', h: 12, min: 14, de: 'Firmian', it: 'Firmiano'}
  ]
}];

var BusStops = React.createClass({
  render:function(){
    return (
      <section className="scroll-container">
      <StopList stations={this.props.list} />
      </section>
    )
  }
});

var StopList = React.createClass({
  addFav: function(index) {
    console.log("Add Fav");
    this.props.stations[index].fav = true;
    render();
  },
  removeFav: function(index) {
    console.log("Remove Fav");
    this.props.stations[index].fav = false;
    render();
  },
  render:function(){
    var stationList = this.props.stations.map(function(station, index){
      return (
        <article className="station expanded">
          <header className="station-header">
            <h1 className="station-title">{station.de}</h1>
            <button className={(station.fav)? "station-star star": "station-star nostar"}
                    onClick={(station.fav)? this.removeFav.bind(null, index): this.addFav.bind(null, index)} >
            </button>
          </header>
          <BusList data={station.buses} />
        </article>
      )
    }.bind(this));

    return (
      <div>
        {stationList}
      </div>
    )
  }

});

var BusList = React.createClass({
  render:function(){
    var buses = this.props.data.map(function(bus){

      return (
        <article className="bus">
          <label className="line" style={{"backgroundColor": "red"}}>{bus.line}</label>
          <label className="time">{bus.min}</label>
          <label className="endstation">{bus.de}</label>
        </article>
      )
    });
    return (
      <section className="bus-list">
        {buses}
      </section>
    )
  }
});

var Search = React.createClass({
  render:function(){
  return (
      <div className="search-container">
      <input className="search-input" placeholder="Search for bus stops..."></input>
      <button value="" className="search-button"></button>
      </div>
      )
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
