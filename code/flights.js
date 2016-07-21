var distance;
var dest;
var origin;
var stateDest;
var stateOrigin;
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
        // 11M, 400k Datasets
        '../data/09.csv';

    d3.json("helper_data/airports_by_state.json", function (airportsArray) {
        // make airports a map using airport code as key
        var airports = {};
        airportsArray.forEach(function (airport) {
            airports[airport.airport] = airport;
        });

        // FCA missing in data set
        // https://en.wikipedia.org/wiki/Glacier_Park_International_Airport
        // https://en.wikipedia.org/wiki/List_of_U.S._state_abbreviations
        var fca = {
            airport: 'FCA',
            name: 'Glacier Park International Airport',
            state: 'MT'
        };
        airports[fca.airport] = fca;

        // MQT missing in data set
        // https://en.wikipedia.org/wiki/Sawyer_International_Airport
        var mqt = {
            airport: 'MQT',
            name: 'Sawyer International Airport',
            state: 'MI'
        };
        airports[mqt.airport] = mqt;

        d3.csv(file, function (error, flights) {
            console.log('Loaded');
            console.log(new Date());
            console.log('Number of flights: ' + flights.length);
            console.log('Adding state information');
            // add state of origin and departure using airport code
            flights.forEach(function (flight) {
                if (airports[flight.Origin]) {
                    flight.stateOrigin = airports[flight.Origin].state;
                } else {
                    flight.stateOrigin = 'N/A';
                    console.warn('Missing airport code', flight.Origin);
                }
                if (airports[flight.Dest]) {
                    flight.stateDest = airports[flight.Dest].state;
                } else {
                    flight.stateDest = 'N/A';
                    console.warn('Missing airport code', flight.Dest);
                }
            });
            console.log('Done');

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

            stateOrigin = flight.dimension(function (d) {
                return d.stateOrigin;
            });
            console.log('.');
            stateDest = flight.dimension(function (d) {
                return d.stateDest;
            });
            console.log('.');

            distance = flight.dimension(function (d) {
                return coerceToInt(d.Distance);
            });
            console.log('.');

            console.log('Crossfiltering done');
            console.log(new Date());
            callback && callback();
        });
    });
}

