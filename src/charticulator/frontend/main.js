// The `Streamlit` object exists because our html file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sendValue(value) {
    Streamlit.setComponentValue(value);
}
/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run the render code the first time the component is loaded.
        if (!window.rendered) {
            yield window.CharticulatorContainer.initialize();
            const { template, tables, events, mapping } = event.detail.args;
            const width = document.getElementsByTagName("body")[0].getBoundingClientRect().width;
            const height = document.getElementsByTagName("body")[0].getBoundingClientRect().height;
            const chartJSON = JSON.parse(template);
            const chartTables = chartJSON.tables;
            const chartTemplate = new CharticulatorContainer.ChartTemplate(chartJSON);
            let error = "";
            // check tables
            if (chartTables) {
                chartTables.forEach((chartTable, index) => {
                    if (chartTable.type == null && index == 0) {
                        chartTable.type = "main";
                    }
                    if (chartTable.type == null && index == 1) {
                        chartTable.type = "links";
                    }
                    const dataTable = tables.find(t => t.type === chartTable.type);
                    if (dataTable) {
                        chartTable.columns.forEach(chartColumn => {
                            const dataColumn = dataTable.columns.find(c => c.name === chartColumn.name);
                            if (!dataColumn) {
                                if (mapping[chartColumn.name] && dataTable.columns.find(c => c.name === mapping[chartColumn.name])) {
                                    chartTemplate.assignColumn(chartTable.name, chartColumn.name, mapping[chartColumn.name]);
                                }
                                else {
                                    error = `Chart requres '${chartColumn.name}' column in '${chartTable.name}' table`;
                                }
                            }
                            else {
                                chartTemplate.assignColumn(chartTable.name, chartColumn.name, dataColumn.name);
                            }
                        });
                        chartTemplate.assignTable(chartTable.name, dataTable.name);
                    }
                    else {
                        if (mapping && mapping[chartTable.name] && tables.find(t => t.name === mapping[chartTable.name])) {
                            chartTemplate.assignTable(chartTable.name, mapping[chartTable.name]);
                        }
                        else {
                            error = `Chart requres table ${chartTable.name}`;
                        }
                    }
                });
            }
            if (error) {
                const root = document.getElementById('root');
                if (root) {
                    root.textContent = error;
                }
                sendValue({ event: "error", error });
                window.rendered = true;
                return;
            }
            // if no mapping columns we assume columns match with template columns
            if (!mapping) {
                // default assign
                tables.forEach(table => {
                    chartTemplate.assignTable(table.name, table.name);
                    table.columns.forEach(column => {
                        chartTemplate.assignColumn(table.name, column.name, column.name);
                    });
                });
            }
            const dataset = {
                name: "default",
                tables
            };
            const instance = chartTemplate.instantiate(dataset);
            const { chart } = instance;
            const container = new CharticulatorContainer.ChartContainer({ chart }, dataset);
            container.mount("root", width, height);
            window.addEventListener("resize", function () {
                container.resize(document.getElementsByTagName("body")[0].getBoundingClientRect().width, document.getElementsByTagName("body")[0].getBoundingClientRect().height);
            });
            if (events && events.selection) {
                container.addSelectionListener((table, rowIndices) => {
                    sendValue({ event: "selection", table, rowIndices });
                });
            }
            if (events && events.mouseEnter) {
                container.addMouseEnterListener((table, rowIndices) => {
                    sendValue({ event: "mouseEnter", table, rowIndices });
                });
            }
            if (events && events.mouseLeave) {
                container.addMouseLeaveListener((table, rowIndices) => {
                    sendValue({ event: "mouseLeave", table, rowIndices });
                });
            }
            if (events && events.contextMenu) {
                container.addContextMenuListener((table, rowIndices, options) => {
                    sendValue({ event: "contextMenu", table, rowIndices, options });
                });
            }
            Streamlit.events.addEventListener("setDataset", (dataSet) => {
                console.log('setDataset', dataSet);
            });
            Streamlit.events.addEventListener("setTemplate", (dataSet) => {
                console.log('setTemplate', dataSet);
            });
            Streamlit.events.addEventListener("setProperty", (property) => {
                console.log('setProperty', property);
            });
            // Streamlit.events.addEventListener("filterPlotSegment", (filter) => {
            //   console.log('filterPlotSegment', filter);
            // });
            // Streamlit.events.addEventListener("filterPlotSegment", (filter) => {
            //   console.log('filterPlotSegment', filter);
            // });
            // You'll most likely want to pass some data back to Python like this
            sendValue({});
            window.rendered = true;
        }
        return Promise.resolve();
    });
}
// Render the component whenever python send a "render event"
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);
// Tell Streamlit that the component is ready to receive events
Streamlit.setComponentReady();
// Render with the correct height, if this is a fixed-height component
Streamlit.setFrameHeight(600);
