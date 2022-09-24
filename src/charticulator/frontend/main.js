// The `Streamlit` object exists because our html file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.

function sendValue(value) {
  Streamlit.setComponentValue(value)
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event) {
  // Only run the render code the first time the component is loaded.
  if (!window.rendered) {
    // You most likely want to get the data passed in like this
    // const {input1, input2, input3} = event.detail.args
    fetch(`${CHARTICULATOR_CONFIG.WorkerURL}`).then(
      (responce) => {
        if (!responce.ok) {
          throw Error(
            `Loading worker script from ${
              CHARTICULATOR_CONFIG.WorkerURL
            } failed`
          );
        }
        responce.text().then((script) => {
          window.CharticulatorContainer.initialize().then(() => {
            const { template, tables, events, mapping } = event.detail.args;

            const width = document.getElementsByTagName("body")[0].getBoundingClientRect().width;
            const height = document.getElementsByTagName("body")[0].getBoundingClientRect().height;

            const chartJSON = JSON.parse(template);

            const chartTemplate = new CharticulatorContainer.ChartTemplate(
              chartJSON
            );

            // default assign
            tables.forEach(table => {
              chartTemplate.assignTable(
                table.name,
                table.name
              );
              table.columns.forEach(column => {
                chartTemplate.assignColumn(
                  table.name,
                  column.name,
                  column.name
                );
              })
            });

            const dataset = {
              name: "default",
              tables
            };

            const instance = chartTemplate.instantiate(dataset);
            const { chart } = instance;

            const container = new CharticulatorContainer.ChartContainer({ chart }, dataset);
            container.mount("root", width, height);
            window.addEventListener("resize", function() {
              container.resize(
                document.getElementsByTagName("body")[0].getBoundingClientRect().width,
                document.getElementsByTagName("body")[0].getBoundingClientRect().height
              );
            });

            if (events && events.selection) {
              container.addSelectionListener((table, rowIndices) => {
                sendValue({event: "selection", table, rowIndices});
              });
            }

            if (events && events.mouseEnter) {
              container.addMouseEnterListener((table, rowIndices) => {
                sendValue({event: "mouseEnter", table, rowIndices});
              });
            }

            if (events && events.mouseLeave) {
              container.addMouseLeaveListener((table, rowIndices) => {
                sendValue({event: "mouseLeave", table, rowIndices});
              });
            }
            if (events && events.contextMenu) {
              container.addContextMenuListener((table, rowIndices, options) => {
                sendValue({event: "contextMenu", table, rowIndices, options});
              });
            }
          });

          Streamlit.events.addEventListener("setDataset", (dataSet) => {
            console.log('setDataset', dataSet);
          });

          Streamlit.events.addEventListener("setTemplate", (dataSet) => {
            console.log('setTemplate', dataSet);
          });

          Streamlit.events.addEventListener("setProperty", (property) => {
            console.log('setProperty', property);
          });

          Streamlit.events.addEventListener("filterPlotSegment", (filter) => {
            console.log('filterPlotSegment', filter);
          });

          Streamlit.events.addEventListener("filterPlotSegment", (filter) => {
            console.log('filterPlotSegment', filter);
          });
        });
      }
    );

    // You'll most likely want to pass some data back to Python like this
    sendValue({})
    window.rendered = true;
  }
}

// Render the component whenever python send a "render event"
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);
// Tell Streamlit that the component is ready to receive events
Streamlit.setComponentReady()
// Render with the correct height, if this is a fixed-height component
Streamlit.setFrameHeight(600)
