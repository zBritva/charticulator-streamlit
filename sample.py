import streamlit as st
import pandas as pd

from charticulator import charticulator

# read charticulator template 
chartFile = open('./streamlit_sample.tmplt', 'r')
chart = chartFile.read()

# read or create dataset

data = {
    "Country": ["Iceland", "Luxembourg", "Estonia", "Latvia", "Slovenia"],
    "Population": [0.352722, 0.60795, 1.321977, 1.92717,2.07005],
    "Geographic Location": ["Europe", "Europe", "Europe", "Europe", "Europe"]
}

table = pd.DataFrame(data)

# transform data to charticulator structure
def columns(col):
    return {
        "name": col,
        "displayName": col,
        "type": "string",
    }

def row(row, columns):
    r = {}

    for index, col in enumerate(columns):
        r[col] = row[1][col]

    return r

# create list of columns for charticulator dataset
columnsList = list(map(columns, table.columns))
# data rows
rowsList = list(map(lambda r: row(r, table.columns), table.iterrows()))

# create dataset for component
chartDataset = [{
    "name": "dataset_name",
    "displayName": "Population",
    "columns": columnsList,
    "rows": rowsList,
    "type": "Main" # main table
}]

# create instance of chartticulator
chart = charticulator(
    chart,
    # List of tables. There are main and links tables can be passed. Main table is mandatory 
    chartDataset,
    # Mapping dataset columns to template columns
    {
        # "Country": "Country",
        # "Population": "Population",
        # "Geographic Location": "Geographic Location"
    },
    # Event types switcher
    {
        "selection": True
    }
)

st.write(chart)