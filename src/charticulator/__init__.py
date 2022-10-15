from pathlib import Path
from typing import Optional
from typing import Any

import streamlit as st
import streamlit.components.v1 as components

import pandas as pd;

# Tell streamlit that there is a component called charticulator,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend").absolute()
_component_func = components.declare_component(
	"charticulator", path=str(frontend_dir)
)

# Create the python function that will be called
def charticulator(
    template: Any = None,
    tables: Any = None,
    mapping: Optional = None,
    events: Optional = {
        "selection": True,
        "mouseLeave": False,
        "mouseEnter": False,
        "contextMenu": False
    }
):
    """
    Charticulator is an interactive authoring tool that enables the creation of bespoke and reusable chart layouts.
    Charticulator is our response to most existing chart construction interfaces that require authors to choose from predefined chart layouts,
    thereby precluding the construction of novel charts
    """
    component_value = _component_func(
        template=template,
        tables=tables,
        mapping=mapping,
        events=events
    )

    return component_value


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


def main():
    st.write("# Charticulator")

    st.write("Charticulator enables you to create bespoke and reusable chart layouts without writing any code.")

    st.write("## Configure component")
    
    st.write("For rendering charts you must provide template and data")

    st.write("### Dataset")

    st.write("Load data from file or from another places")

    
    st.write("""
        ```
        population = pd.read_csv("./oecd_population_2018.csv");
        ```
    """)

    population = pd.read_csv("./oecd_population_2018.csv");
    st.write(population)


    st.write("### Template")

    st.write("""
        Template is JSON file with descriptions.\n
        You can use exsisting templates from https://charticulator.com/templates.html\n
        or create your own design in https://charticulator.com/app/index.html
    """)

    st.write("#### Read charticualtor template from file")

    st.write("""
        ```
        # read charticulator template\n
        chartFile = open('./streamlit_sample.tmplt', 'r')\n
        chart = chartFile.read()\n
        ```
    """)

    # read charticulator template 
    chartFile = open('./streamlit_sample.tmplt', 'r')
    chart = chartFile.read()

    st.write("#### Prepare data for charticulator")

    st.write("You need to create JSON with next structure:")

    st.write("""
        ```
        [
            {
                "name": "<Tablename>",
                "displayName": "<Table name to display for user>",
                "columns": [
                    {
                        "name": "<Column name>",
                        "displayName": "<Column name to display for user>",
                        "type": "<Type of colum: string, number, boolean, date, image [base64 string] >",
                        "metadata": {
                            "kind": "<data kind: ordinal, categorical, numerical, temporal>"
                        }
                    }
                ],
                "type": "Main"
            },
            ...
        ]
        ```
    """)

    st.write('Code sample to loading Pandas dataframe content')

    st.write("""
        ```
        def columns(col):
            return {
                "name": col,
                "displayName": col,
                "type": "string",
            }

        def row(row, columns):
            r = \{\}

            for index, col in enumerate(columns):
                r[col] = row[1][col]

            return r

        # create list of columns for charticulator dataset
        columnsList = list(map(columns, population.columns))
        # data rows
        rowsList = list(map(lambda r: row(r, population.columns), population.iterrows()))

        # create dataset for component
        populationTableDataset = [{
            "name": "oecd_population_2018",
            "displayName": "Population",
            "columns": columnsList,
            "rows": rowsList,
            "type": "Main" # main table
        }]
        ```
    """)

    # create list of columns for charticulator dataset
    columnsList = list(map(columns, population.columns))
    # data rows
    rowsList = list(map(lambda r: row(r, population.columns), population.iterrows()))

    # create dataset for component
    populationTableDataset = [{
        "name": "oecd_population_2018",
        "displayName": "Population",
        "columns": columnsList,
        "rows": rowsList,
        "type": "main" # main table
    }]

    st.write('Initialize component with template and data')

    st.write("""
        ```
        chart = charticulator(
            chart,
            # List of tables. There are main and links tables can be passed. Main table is mandatory 
            populationTableDataset,
            # Mapping dataset columns to template columns
            # It is optional if template columns and data colums are same
            {
                "Country": "Country",
                "Population": "Population",
                "Geographic Location": "Geographic Location"
            },
            # Even types switcher
            {
                "selection": True
            }
        )
        ```
    """)

    st.write("## Rendered chart")

    chart = charticulator(
        chart,
        # List of tables. There are main and links tables can be passed. Main table is mandatory 
        populationTableDataset,
        # Mapping dataset columns to template columns
        {
            "Country": "Country",
            "Population": "Population",
            "Geographic Location": "Geographic Location"
        },
        # Even types switcher
        {
            "selection": True
        }
    )

    st.write("## Events")

    st.write("""
        Charticulator fires event to user interaction:
        * selecting data point on user click
        * mouse enter
        * mouse leave
    """)

    # Charticulator fires event to user interaction (data point selection, mouse enter, mouse out)
    st.write("Event content")
    
    if chart and chart['event']:
        st.write('Event type: ' + chart["event"])

    st.write(chart)

    st.write("Event related data")
    if chart and chart.get('rowIndices'):
        for index, rowIndex in enumerate(chart['rowIndices']):
            st.write(rowsList[rowIndex])


if __name__ == "__main__":
    main()
