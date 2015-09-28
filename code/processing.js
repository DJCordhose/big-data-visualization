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

function process(callback) {
    // group() reduces this dimension to a group
    // you can also supply a mapping function
    // identity is used as default
    var distrinctCarriersGroup = carrier.group();
    console.log("Distinct carrierNames: " + distrinctCarriersGroup.size());
    // all() returns all grouped results as an array
    var distinctCarriers = distrinctCarriersGroup.all();
    var carrierNames = distinctCarriers.map(function (carrier) {
        // contain key and value
        return carrier.key;
    });
    console.log(carrierNames);
    var count = distrinctCarriersGroup.reduceCount().all();
    console.log(count);

    console.log("Distinct origins: " + origin.group().size());

    console.log("Distinct destinatons: " + dest.group().size());

    // https://github.com/square/crossfilter/wiki/API-Reference#wiki-crossfilter_groupAll
    // groupAll() creates a group intersecting all current filters
    console.log("All flights:", flight.groupAll().value());
    //carrier.filter("UA");
    //console.log("All United flights", flight.groupAll().value());
    //carrier.filter("AA");
    //dest.filter("STL");
    //console.log("All United flights going to STL", flight.groupAll().value());
    // south west
    carrier.filter("TW");
    console.log("TW flights", flight.groupAll().value());
    origin.filter("EWR");
    console.log("coming from EWR", flight.groupAll().value());
    dest.filter("STL");
    console.log("going to STL", flight.groupAll().value());
    carrier.filterAll();
    console.log("all flights from EWR to STL", flight.groupAll().value());
    // https://github.com/square/crossfilter/wiki/API-Reference#wiki-dimension_top
    // also intersection of all filters, but descending order by this dimension
    //var filteredFlights = arrDelay.top(1);
    var filteredFlights = arrDelay.bottom(1);
    console.log(JSON.stringify(filteredFlights, null, '  '));
    console.log(filteredFlights);
    callback && callback();
}

