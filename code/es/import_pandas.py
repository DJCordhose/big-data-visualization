from time import time
from pyelasticsearch import ElasticSearch, bulk_chunks
import pandas as pd

ES_HOST = 'http://localhost:9200/'
INDEX_NAME = "expo2009_pandas_dev"
DOC_TYPE = "flight"

es = ElasticSearch(ES_HOST)

# init index
try :
    es.delete_index(INDEX_NAME)
    print('Deleting %s'%(INDEX_NAME))
except :
    print('ERROR: Deleting %s failed!'%(INDEX_NAME))
    pass
es.create_index(INDEX_NAME)

# https://pyelasticsearch.readthedocs.io/en/latest/api/#pyelasticsearch.ElasticSearch.put_mapping
# https://www.elastic.co/guide/en/elasticsearch/reference/current/null-value.html
mapping = {
    'flight': {
        'properties': {
            'SecurityDelay': {
                'type': 'integer',
                'null_value': -1
            },
            'FlightNum': {
                'type': 'string'
            },
            'Origin': {
                'type': 'string'
            },
            'LateAircraftDelay': {
                'type': 'integer',
                'null_value': -1
            },
            'NASDelay': {
                'type': 'integer',
                'null_value': -1
            },
            'ArrTime': {
                'type': 'integer'
            },
            'AirTime': {
                'type': 'integer'
            },
            'DepTime': {
                'type': 'integer'
            },
            'Month': {
                'type': 'string'
            },
            'CRSElapsedTime': {
                'type': 'integer'
            },
            'DayofMonth': {
                'type': 'string'
            },
            'Distance': {
                'type': 'integer'
            },
            'CRSDepTime': {
                'type': 'integer',
            },
            'DayOfWeek': {
                'type': 'string'
            },
            'CancellationCode': {
                'type': 'string'
            },
            'Dest': {
                'type': 'string'
            },
            'DepDelay': {
                'type': 'integer'
            },
            'TaxiIn': {
                'type': 'integer'
            },
            'UniqueCarrier': {
                'type': 'string'
            },
            'ArrDelay': {
                'type': 'integer'
            },
            'Cancelled': {
                'type': 'boolean'
            },
            'Diverted': {
                'type': 'boolean'
            },
            'message': {
                'type': 'string'
            },
            'TaxiOut': {
                'type': 'integer'
            },
            'ActualElapsedTime': {
                'type': 'integer'
            },
            'CarrierDelay': {
                'type': 'integer',
                'null_value': -1
            },
            '@timestamp': {
                'format': 'strict_date_optional_time||epoch_millis',
                'type': 'date'
            },
            'Year': {
                'type': 'string'
            },
            'WeatherDelay': {
                'type': 'integer',
                'null_value': -1
            },
            'CRSArrTime': {
                'type': 'integer'
            },
            'TailNum': {
                'type': 'string'
            }
        }
    }
}
es.put_mapping(index=INDEX_NAME, doc_type=DOC_TYPE,mapping=mapping )

t0 = time()
print('Loading data')
# http://pandas.pydata.org/pandas-docs/stable/generated/pandas.read_csv.html
# df = pd.read_csv('../../data/2001/2001.csv',
#                  encoding='iso-8859-1', engine='c')
offset = 0
number_rows = 1000
df = pd.read_csv('../../data/2001/2001.csv',
                 encoding='iso-8859-1', engine='c',
                 skiprows=offset, nrows=number_rows)

# wc -l /Users/olli/Development/ml/raw_data/expo2009_airline/2001.csv
# > 5967781
print("Time loading", len(df), "rows, total: 6M rows, 573M total size:", round(time() - t0, 3), "s")
# should be 5967780 data sets, as the first one contains the name of the columns

# Transformation steps
# 1. np.nan becomes -1
# 2. create @timestamp out of %{Year}-%{Month}-%{DayofMonth};%{CRSDepTime} / "YYYY-MM-dd;HHmm"
# 3. convert cancelled and diverted to boolean

# (1)
df.fillna(-1, inplace=True)
print("NaN filled:", round(time() - t0, 3), "s")

# (2)
# 2400 is not a valid time
df['CRSDepTime'] = df.apply(lambda row: 2359 if row['CRSDepTime'] == 2400 else row['CRSDepTime'],axis=1)
df['@timestamp'] = df.apply(lambda row: pd.Timestamp('%s-%s-%s;%04d'%(row['Year'], row['Month'], row['DayofMonth'], row['CRSDepTime'])),axis=1)
print("Timestamps added:", round(time() - t0, 3), "s")

# (3)
df['Cancelled'] = df.apply(lambda row: False if row['Cancelled'] == 0 else True,axis=1)
df['Diverted'] = df.apply(lambda row: False if row['Diverted'] == 0 else True,axis=1)
print("Booleans converted:", round(time() - t0, 3), "s")

# http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.to_dict.html
records = df.to_dict(orient='records')
# hoping to free some memory
df = None
print("dataframe converted to record", round(time() - t0, 3), "s")

# https://pyelasticsearch.readthedocs.io/en/latest/api/#pyelasticsearch.ElasticSearch.bulk
def documents(records):
    for flight in records:
        yield es.index_op(flight)

# bulk_chunks() breaks your documents into smaller requests for speed:
for chunk in bulk_chunks(documents(records=records),
                         docs_per_chunk=500,
                         bytes_per_chunk=10000):
    # We specify a default index and doc type here so we don't
    # have to repeat them in every operation:
    es.bulk(chunk, doc_type=DOC_TYPE, index=INDEX_NAME)

print("data import complete", round(time() - t0, 3), "s")

res = es.refresh(INDEX_NAME)
print(res)