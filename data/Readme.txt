- https://www.statistik-nord.de
- https://www.govdata.de/
- https://de.wikipedia.org/wiki/Portal:Statistik/Datensaetze

Daten_fuer_die_Stadtteilprofile_2014
------------------------------------

Quelle
- https://www.statistik-nord.de/fileadmin/Dokumente/Datenbanken_und_Karten/Daten_fuer_die_Stadtteilprofile_2014.xlsx

Export als CSV
- Komplett als CSV (Windows) exportieren (ist dann ISO-8859-1)
- Im Editor laden, als UTF-8 speichern
- Alle Header-Zeilen löschen, bis auf die relevanteste (nutzt D3 zum erzeugen der Feldnamen)

Felder
Stadtgebiet;Bevölkerung;Unter 18-Jährige;Anteil der unter 18-Jährigen in %; 65-Jährige und Ältere;Anteil der 65-Jährigen und Älteren in %;Ausländerinnen und Ausländer;Ausländeranteil in %;Bevölkerung mit Migrations-hintergrund;Anteil der Bevölkerung mit Migrations-hintergrund in %;Unter 18-Jährige mit Migrations-hintergrund;Anteil der unter 18-Jährigen mit Migrations-hintergrund in %;Haushalte;Personen je Haushalt;Einpersonen-haushalte;Anteil der Einpersonen-haushalte in %;Haushalte mit Kindern;Anteil der Haushalte mit Kindern in %;Alleinerziehende;Anteil der Haushalte von Alleinerziehenden in %;Fläche in km²;Bevölkerungs-dichte;Geburten;Sterbefälle;Zuzüge;Zuzüge aus dem Hamburger Umland;Fortzüge;Fortzüge in das Hamburger Umland;Wanderungssaldo;Sozial-versicherungs-pflichtig Beschäftigte (Dez 2013);Beschäftigten-quote in % (Dez 2013);Arbeitslose (Dez 2013);Arbeitslosenanteil in % (Dez 2013);Jüngere Arbeitslose (Dez 2013);Arbeitslosenanteil Jüngerer in % (Dez 2013);Ältere Arbeitslose (Dez 2013);Arbeitslosenanteil Älterer in % (Dez 2013);Leistungs-empfänger/-innen nach SGB II (Dez 2013);Anteil der Leistungs-empfänger/-innen nach SGB II in % (Dez 2013);Unter 15-Jährige in Mindestsicherung (Dez 2013);Anteil der unter 15-Jährigen in Mindestsicherung in % (Dez 2013);Bedarfs-gemeinschaften nach SGB II (Dez 2013);Lohn- und Einkommen-steuerpflichtige (2010);Durchschnitt-liches Einkommen je Steuerpflichtigen in EUR (2010);Wohngebäude (2013);Wohnungen (2013);Bezugsfertige Wohnungen (2013);Wohnungen in Ein- und Zweifamilien-häusern (2013);Anteil der Wohnungen in Ein- und Zweifamilien-häusern in % (2013);Wohnungsgröße in m² (2013);Wohnfläche je Einwohner/-in in m² (2013);Sozialwohnungen (Jan 2014);Sozialwohnungs-anteil in % (Jan 2014);Sozialwohnungen mit Bindungsauslauf bis 2019;Sozialwohnungen mit Bindungsauslauf bis 2019 in %;Preise für Grundstücke in EUR/m² (Jan 2014);Preise für Ein- bzw Zwei-familienhäuser in EUR/m² (Jan 2014);Preise für Eigentums-wohnungen in EUR/m² (Jan 2014);Kindergärten und Vorschulklassen (März 2014);Grundschulen (2013/2014);Schülerinnen und Schüler der Sekundarstufe I (2013/2014);Anteil der Schülerinnen und Schüler in Stadtteilschulen und Schulformen mit mehreren Bildungsgängen in % (2013/2014);Anteil der Schülerinnen und Schüler in Gymnasien in % (2013/2014);Niedergelassene Ärzte (Dez 2013);Allgemeinärzte (Dez 2013);Zahnärzte (Nov 2013);Apotheken (Nov 2013);Private PKW (Jan 2014);PKW-Dichte (Jan 2014)

9_11
----

Quelle
- http://stat-computing.org/dataexpo/2009/
- http://stat-computing.org/dataexpo/2009/the-data.html

Frage: Wie hat sich der Luftverkehr nach 9/11 verändert?

Datenfelder
1	Year	1987-2008
2	Month	1-12
3	DayofMonth	1-31
4	DayOfWeek	1 (Monday) - 7 (Sunday)
5	DepTime	actual departure time (local, hhmm)
6	CRSDepTime	scheduled departure time (local, hhmm)
7	ArrTime	actual arrival time (local, hhmm)
8	CRSArrTime	scheduled arrival time (local, hhmm)
9	UniqueCarrier	unique carrier code
10	FlightNum	flight number
11	TailNum	plane tail number
12	ActualElapsedTime	in minutes
13	CRSElapsedTime	in minutes
14	AirTime	in minutes
15	ArrDelay	arrival delay, in minutes
16	DepDelay	departure delay, in minutes
17	Origin	origin IATA airport code
18	Dest	destination IATA airport code
19	Distance	in miles
20	TaxiIn	taxi in time, in minutes
21	TaxiOut	taxi out time in minutes
22	Cancelled	was the flight cancelled?
23	CancellationCode	reason for cancellation (A = carrier, B = weather, C = NAS, D = security)
24	Diverted	1 = yes, 0 = no
25	CarrierDelay	in minutes
26	WeatherDelay	in minutes
27	NASDelay	in minutes
28	SecurityDelay	in minutes
29	LateAircraftDelay	in minutes

Vorverarbeitung
- http://stat-computing.org/dataexpo/2009/unix-tools.html
- Alle Flüge des von Juli bis Dezember herausgefiltert:
  - awk -F, '$2 == "9" || $2 == "8" || $2 == "10" || $2 == "11" || $2 == "12" || $2 == "7"' 2001.csv >2001_07to12.csv
  - wc -l 2001_07to12.csv : 2864540 (fast 3 Millionen Datensätze)
  - ls -l 2001_07to12.csv : 288734190 (fast 300 MB)
- Titelzeile mit Namen der Spalten extrahieren und den Datensätzen voranstellen
  - head 2001.csv
  - erste Zeile in der Konsole kopieren
  - vi head.csv
  - hineinkopieren
  - cat head.csv 2001_07to12.csv >2001_07to12_withHead.csv
- Nur wichtige Datenfelder behalten
  - Month,DayofMonth,UniqueCarrier,AirTime,ArrDelay,DepDelay,Origin,Dest,Distance
  - die letzten Spalten wären spannend, sind aber immer 'NA'
  - Wir müssen die Sprache auf C stellen, weil es sonst 'Illegal byte sequence' gibt
  - http://stackoverflow.com/questions/11287564/getting-sed-error-illegal-byte-sequence-in-bash
  - export LC_ALL=C
  - cut -f2,3,9,14,15,16,17,18,19 -d, 2001_07to12_withHead.csv >selection.csv
  - wc -l selection.csv : 2864541 (fast 3 Millionen Datensätze)
  - ls -l selection.csv : 84499516 (fast 85 MB)
- Das kann von Chrome in wenigen Sekunden lokal geladen werden
- Jede Dimension dauert ordentlich (2-3 Sekunden)
- Für Demo das ganze vorher einmal laden
- Um aus 07to12 nur einige Monate herauszulösen
  - awk -F, '$1 == "9" || $1 == "10"' 07to12.csv > 09_10.csv
  - awk -F, '$1 == "9" || $1 == "10" || $1 == "11"' 07to12.csv > 09to11.csv

Cancelled herausfiltern:
- awk -F, '$22 == "0"' 2001.csv >2001_not_canceled.csv
- awk -F, '$22 != "0"' 2001.csv >2001_canceled.csv
- Cancelled: 1
- Anzahl der gecancelten 2001 (5%)
  - 0231198
- Gesamt-Flüge:
  - 5967781
- awk -F, '$2 == "9" || $2 == "10" || $2 == "11"' 2001_not_canceled.csv >2001_09to11.csv
- cat head_complete.csv 2001_09to11.csv >2001_09to11_head.csv
- cut -f2,3,9,14,15,16,17,18,19 -d, 2001_09to11_head.csv >09to11.csv
- awk -F, '$1 == "9"' 09to11.csv >09.csv
- cat head_selection.csv 09.csv >09_with_head.csv

Hadoop

- Import all 2001 flights (600MB) into hdfs: bin/hdfs dfs -put 2001.csv flights
- is it there?: bin/hdfs dfs -ls flights
  - Found 1 items
  - -rw-r--r--   1 olli supergroup  600411462 2015-09-29 13:47 flights/2001.csv
- how to to the other stuff above with hadoop
  - http://www.sasanalysis.com/2014/04/10-popular-linux-commands-for-hadoop.html?m=1


Cassandra
- Import and Export CSV directly into table using cqlsh
  - http://docs.datastax.com/en/cql/3.1/cql/cql_reference/copy_r.html
- https://github.com/killrweather/killrweather/wiki/6.-Cassandra-Exercises-on-Killrvideo-Data
-