'use strict';

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

var createQuery = function (fields) {
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
                                        "gte": 999295200000,
                                        "lte": 1001887200000,
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
    })
    return unwrapped;
}


function load(callback) {

    console.log('Loading');
    console.log(new Date());

    const fields = ["Year", "Month", "DayofMonth", "Origin", "Dest", "UniqueCarrier"]

    const query = createQuery(fields);

    // be sure to enable CORS in elasticsearch
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-http.html

    fetch('http://localhost:9200/expo2009_airline/_search', {
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
        })
        .then(handleData);

    function handleData(data) {
        console.log('Loading done');
        console.log(new Date());
        //console.log(data);
        console.log(data.hits.total);
        console.log(data.hits.hits[0]);
        const flights = data.hits.hits.map((hit) => unwrap(hit, fields));
        //console.log(flights);
        console.log(flights[0]);

        const cf = crossfilter(flights);

        console.log('Conversion done');
        console.log(new Date());
        callback && callback(cf);

    }

}

