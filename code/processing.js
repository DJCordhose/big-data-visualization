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

function process() {
    console.log("Distinct carriers: " + carrier.group().size());
    var carriers = carrier.group().all().map(function (carrier) {
        return carrier.key;
    });
    console.log(carriers);

    console.log("Distinct origins: " + origin.group().size());

    console.log("Distinct destinatons: " + dest.group().size());

    console.log("All flights:", flight.groupAll().value());
    //carrier.filter("UA");
    //console.log("All United flights", flight.groupAll().value());
    //carrier.filter("AA");
    //dest.filter("STL");
    //console.log("All United flights going to STL", flight.groupAll().value());
    carrier.filter("TW");
    console.log("TW flights", flight.groupAll().value());
    origin.filter("EWR");
    console.log("coming from EWR", flight.groupAll().value());
    dest.filter("STL");
    console.log("going to STL", flight.groupAll().value());
    carrier.filterAll();
    console.log("all flights from EWR to STL", flight.groupAll().value());
    console.log(JSON.stringify(dest.top(1), null, '  '));
}

