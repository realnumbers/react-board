/*** @jsx React.DOM */

var data = [
{
  de: "Waltherplatz",
  it: "Piazza Walther",
  fav: false,
  buses: [
  {line: "11", h: 12, min: 34, de: "Firmian", it: "Firmiano"},
  {line: "6", h: 12, min: 56, de: "Perathonerstraße", it: "Via Perathoner"},
  {line: "4", h: 13, min: 01, de: "Bahnhof Bozen", it: "Stazione Bolzano"},
  {line: "11", h: 12, min: 14, de: "Firmian", it: "Firmiano"}
  ]
},
{
  de: "Perathoner",
  it: "Piazza Walther",
  fav: false,
  buses:
  [
  {line: "11", h: 12, min: 34, de: "Firmian", it: "Firmiano"},
  {line: "6", h: 12, min: 56, de: "Perathonerstraße", it: "Via Perathoner"},
  {line: "4", h: 13, min: 01, de: "Bahnhof Bozen", it: "Stazione Bolzano"},
  {line: "11", h: 12, min: 14, de: "Firmian", it: "Firmiano"}
  ]
},
{
  de: "Walter Tobagi Passage",
  it: "Piazza Walther",
  fav: false,
  buses:
  [
  {line: "11", h: 12, min: 34, de: "Firmian", it: "Firmiano"},
  {line: "6", h: 12, min: 56, de: "Perathonerstraße", it: "Via Perathoner"},
  {line: "4", h: 13, min: 01, de: "Bahnhof Bozen", it: "Stazione Bolzano"},
  {line: "11", h: 12, min: 14, de: "Firmian", it: "Firmiano"}
  ]
}];

var BusStops = React.createClass({
  render:function(){
    return (
      <StopList stations={this.props.list} />
    )
  }
});

var StopList = React.createClass({
  render:function(){
    var stationList = this.props.stations.map(function(station){
      return (
        <article className="station expanded">
          <header className="station-header">
            <h1 className="station-title">{station.de}</h1>
            <button className="station-star star"></button>
          </header>
          <BusList data={station.buses} />
        </article>
      )
    });

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

React.render(
  <BusStops list={data} />,
  document.getElementById('content')
);
