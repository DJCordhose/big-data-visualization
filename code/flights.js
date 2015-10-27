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

function coerceToInt(number) {
    if (number === 'NA') {
        return null;
    }
    var int = parseInt(number);
    if (isNaN(int)) {
        return null;
    } else {
        return int;
    }
}

function load(callback, complete) {

    console.log('Loading');
    console.log(new Date());

    var file = complete ?
        // a LOT
        //'../data/07to12.csv' :
        //'../data/09to10.csv' :
        //'../data/09to11.csv' :
        '../data/09to11_not_cancelled.csv' :
    // just september
        '../data/09.csv';

    d3.csv(file, function (error, flights) {
            console.log('Loaded');
            console.log(new Date());
            console.log('Number of flights: ' + flights.length);
            console.log(JSON.stringify(flights[0], null, 2));
            console.log(flights[flights.length - 1]);

            console.log('Creating dimensions');
            flight = crossfilter(flights);
            all = flight.groupAll();
            carrier = flight.dimension(function (d) {
                return d.UniqueCarrier;
            });
            console.log('.');
            date = flight.dimension(function (d) {
                return new Date(2001, d.Month - 1, d.DayofMonth);
            });
            console.log('.');
            airTime = flight.dimension(function (d) {
                return coerceToInt(d.AirTime);
            });
            console.log('.');
            arrDelay = flight.dimension(function (d) {
                return coerceToInt(d.ArrDelay);
            });
            console.log('.');
            depDelay = flight.dimension(function (d) {
                return coerceToInt(d.DepDelay);
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
                return coerceToInt(d.Distance);
            });
            console.log('.');

            console.log('Crossfiltering done');
            console.log(new Date());
            callback && callback();
        }
    );
}

