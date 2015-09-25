var distance;
var dest;
var origin;
var depDelay;
var arrDelay;
var airTime;
var date;
var carrier;
var flight;
var all;

function load(callback) {

    console.log('Loading');
    console.log(new Date());
// a LOT
//d3.csv("../data/07to12.csv", function (error, flights) {
// just september
    d3.csv("../data/09.csv", function (error, flights) {
        console.log('Loaded');
        console.log(new Date());
        console.log('Number of flights: ' + flights.length);
        console.log(JSON.stringify(flights[0], null, 2));
        console.log(flights[flights.length - 1]);

        console.log('Creating dimensions');
        flight = crossfilter(flights);
        all = flight.groupAll();
        // TODO: Pie chart with filtering
        carrier = flight.dimension(function (d) {
            return d.UniqueCarrier;
        });
        console.log('.');
        // TODO: Bar chart with brushing
        date = flight.dimension(function (d) {
            return new Date(2001, d.Month - 1, d.DayofMonth);
        });
        console.log('.');
        airTime = flight.dimension(function (d) {
            return d.AirTime;
        });
        console.log('.');
        arrDelay = flight.dimension(function (d) {
            return d.ArrDelay;
        });
        console.log('.');
        depDelay = flight.dimension(function (d) {
            return d.DepDelay;
        });
        console.log('.');
        origin = flight.dimension(function (d) {
            return d.Origin;
        });
        console.log('.');
        dest = flight.dimension(function (d) {
            return d.Dest;
        });
        console.log('.');
        distance = flight.dimension(function (d) {
            return d.Distance;
        });
        console.log('.');

        console.log('Crossfiltering done');
        console.log(new Date());
        callback();
    });
}

