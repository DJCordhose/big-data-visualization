'use strict';

var flight;

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

// http://www.epochconverter.com/
// http://momentjs.com

var beginningOf2001 = moment('2001-01-01');
var beginningOf2002 = moment('2002-01-01');
var months = [beginningOf2001];
var weeks = [beginningOf2001];
for (var i = 1; i <= 11; i++) {
    var nextMonth = beginningOf2001.clone().add(i, 'months');
    months.push(nextMonth);
}
const monthNames = months.map(month => month.format('MMMM'));

// https://developer.mozilla.org/en/docs/Web/HTML/Element/select
const timeRangeMonthDisplay = document.querySelector('#time-range-month');
monthNames.forEach((name, index) => {
    const option = document.createElement('option');
    option.setAttribute('value', index);
    option.appendChild(document.createTextNode(name));
   timeRangeMonthDisplay.appendChild(option);
});
timeRangeMonthDisplay.addEventListener('change', event => {
    const selectedMonth = event.target.value;
    if (selectedMonth != -1) {
        handleRangeChangeMonth(selectedMonth);
    }
});

for (var i = 1; i <= 51; i++) {
    var nextWeek = beginningOf2001.clone().add(i, 'weeks');
    if ( nextWeek.isAfter(beginningOf2002) ) {
        break;
    }
    weeks.push(nextWeek);
}
const weekNames = weeks.map(week => week.format('Wo'));
const timeRangeWeekDisplay = document.querySelector('#time-range-week');
weekNames.forEach((name, index) => {
    const option = document.createElement('option');
    option.setAttribute('value', index);
    option.appendChild(document.createTextNode(name));
    timeRangeWeekDisplay.appendChild(option);
});
timeRangeWeekDisplay.addEventListener('change', event => {
    const selectedWeek = event.target.value;
    if (selectedWeek != -1) {
        handleRangeChangeWeek(selectedWeek);
    }
});

var dayInMS = +moment.duration(1, 'day');
var weekInMS = +moment.duration(1, 'week');
var beginningOfSeptember = +months[8];
var beginningOfOctober = +months[9];

// var endOf2001 = 1009839600000;
// var allOf2001 = endOf2001 - beginningOf2001;
// var beginningOfFebruary = beginningOf2001 + 31 * dayInMS;
// var beginningOfMarch = beginningOfFebruary + 28 * dayInMS;
// var beginningOfApril = beginningOfMarch + 31 * dayInMS;
// var beginningOfMai = beginningOfApril + 30 * dayInMS;
// var beginningOfMonths = [beginningOf2001, beginningOfFebruary, beginningOfMarch, beginningOfApril];


var createQuery = function (fields, from, to) {
    // reduced data
    from = from || beginningOfSeptember + 1 * weekInMS;
    to = to || beginningOfSeptember + 2 * weekInMS;
    // from = from || beginningOfSeptember;
    // to = to || beginningOfOctober;

    // set index.max_result_window in elasticsearch.yml to 1000000 to allow for large result sets
    return {
        "size": 500000,
        "query": {
            "filtered": {
                "query": {
                    "query_string": {
                        "query": "Cancelled: false",
                        "analyze_wildcard": true
                    }
                },
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        "gte": from,
                                        "lte": to,
                                        "format": "epoch_millis"
                                    }
                                }
                            }
                        ],
                        "must_not": []
                    }
                }
            }
        },
        "aggs": {},
        "fields": fields
    };
}

function unwrap(hit, fields) {
    const unwrapped = {};
    fields.forEach((field) => {
        unwrapped[field] = hit.fields[field][0]
    });
    return unwrapped;
}

function handleRangeChangeMonth(monthIndex) {
    const month = months[monthIndex];
    document.querySelector('#time-range-name').innerHTML = monthNames[monthIndex];
    const from = +month;
    const to = +month.clone().add(1, 'month');
    load((cf) => render(cf, from, to, 31), from, to);
}

function handleRangeChangeWeek(weekIndex) {
    const week = weeks[weekIndex];
    document.querySelector('#time-range-name').innerHTML = `${weekNames[weekIndex]} week of`;
    const from = +week;
    const to = +week.clone().add(1, 'week');
    load((cf) => render(cf, from, to, 7), from, to);
}

function load(callback, from, to) {
    signalLoadingStart();

    const fields = ["Year", "Month", "DayofMonth", "Origin", "Dest", "UniqueCarrier"];

    const query = createQuery(fields, from, to);

    // be sure to enable CORS in elasticsearch
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-http.html

    // fetch('http://localhost:9200/expo2009_airline/_search', {
    fetch('http://localhost:9200/expo2009_pandas/_search', {
        method: 'POST',
        //mode: 'no-cors', // we need cors, otherwise we get no response back
        body: JSON.stringify(query),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).catch((ex) => {
            console.error('parsing failed', ex);
    }).then(data => handleData(data, fields, callback));

}

function handleData(data, fields, callback) {
    console.log('Loading done');
    console.log(new Date());
    //console.log(data);
    console.log(data.hits.total);
    console.log(data.hits.hits[0]);
    const flights = data.hits.hits.map((hit) => unwrap(hit, fields));
    //console.log(flights);
    console.log(flights[0]);

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
        console.log('Processed flight:');
        console.log(flights[0]);

        flight = crossfilter(flights);

        console.log('Conversion done');
        console.log(new Date());
        callback && callback(flight);
    });
}

