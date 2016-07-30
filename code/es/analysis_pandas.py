from time import time

import numpy as np
import matplotlib.pyplot as plt
from sklearn import preprocessing

import seaborn as sns

import pandas as pd

IMG_DIR = '../../analysis'
DPI=120

t0 = time()
print('Generating rows to skip')
s = 10000  # desired sample size
n = 5967780
rows_to_skip = sorted(np.random.choice(np.arange(1, n + 1), (n - s), replace=False))
print('Rows to skip: ', len(rows_to_skip))
# 5957780
# Time loading 5967780 rows, total: 6M rows, 573M total size: 21.295 s
print("Time generating: ", round(time() - t0, 3), "s")

print('Loading data')
# http://pandas.pydata.org/pandas-docs/stable/generated/pandas.read_csv.html
df = pd.read_csv('../../data/2001/2001.csv',
                 encoding='iso-8859-1', engine='c',
                 skiprows=rows_to_skip)
print("Time loading", len(df), "rows, total: 6M rows, 573M total size:", round(time() - t0, 3), "s")

# print(df.head())

# http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html
# turn those text labels into numerical
text_cols = [u'UniqueCarrier' , u'Origin', u'Dest']
le = preprocessing.LabelEncoder()
for c in text_cols:
    # print (c,set(df[c].values))
    flist = list(set(df[c].values))
    # print(flist)
    le.fit(flist)
    leo = le.transform(flist)
    print (c,flist,leo)
    df[c+'_'] = df[c]
    df[c+'_'].replace(flist,value=leo,inplace=True,axis=0)

df.fillna(-1, inplace=True)

cols_for_correlation = [
    u'DayOfWeek',
    u'DepTime',
    u'ArrTime',
    u'ArrDelay',
    u'Distance',
    u'UniqueCarrier_',
    u'Origin_', u'Dest_'
]
plt.clf()
sns.corrplot(df[cols_for_correlation])
figure = plt.gcf()
figure.set_size_inches(8, 6)
plt.savefig(IMG_DIR+'/corr.png', dpi = DPI)


def plot(col1, col2):
    plt.clf()
    sns.jointplot(df[col1],df[col2],dropna=True, kind="hex")
    figure = plt.gcf()
    figure.set_size_inches(8, 6)
    plt.savefig('%s/%s_%s.png'%(IMG_DIR, col1, col2), dpi = DPI)

# more details for correlations found
plot('ArrTime', 'DepTime')
plot('Distance', 'UniqueCarrier_')
plot('Origin_', 'UniqueCarrier_')

