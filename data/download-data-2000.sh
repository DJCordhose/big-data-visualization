#!/bin/bash
curl -O http://stat-computing.org/dataexpo/2009/2000.csv.bz2
bzip2 -d 2000.csv.bz2
mv 2000.csv raw