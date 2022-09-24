var CHARTICULATOR_CONFIG = {
    "Extensions": [
        { "script": "extensions/powerbi_visual_builder.js", 
        "initialize": "let extension = new CharticulatorPowerBIVisualBuilder.PowerBIVisualBuilder('scripts/container.bundle.js');\napplication.addExtension(extension);\n" }
    ],
    "MapService": {
        
    },
    "MainView": {
        "ColumnsPosition": "left",
        "EditorPanelsPosition": "left",
        "ToolbarPosition": "top"
    },
    "LegalNotices": {
        "privacyStatementHTML": "<p>\n  <b>A note about privacy:</b>\n  We collect anonymous usage information such as the number of charts you create, the number of components in each chart, and the size of imported datasets. \n  Except these statistics, your data remains on your machine and is not shared with <a title=\"Microsoft\" href=\"http://microsoft.com\">Microsoft</a>.  If you have privacy concerns, Charticulator can be built from source and hosted on your own server.\n  By using this service, you agree to\n  <a title=\"Microsoft\" href=\"http://microsoft.com\">Microsoft</a>'s\n  <a title=\"Privacy\" href=\"https://go.microsoft.com/fwlink/?LinkId=521839\">Privacy Statement</a>\n  and\n  <a title=\"Terms of Use\" href=\"https://go.microsoft.com/fwlink/?LinkID=760869\">Terms of Use</a>.\n</p>\n<p>\n  <a href=\"https://go.microsoft.com/fwlink/?LinkId=521839\">Privacy & cookies</a> |\n  <a href=\"https://go.microsoft.com/fwlink/?LinkID=760869\">Terms of use</a> |\n  <a href=\"http://go.microsoft.com/fwlink/?LinkId=506942\">Trademarks</a> |\n  <a href=\"http://choice.microsoft.com/\">About our ads</a> |\n  Copyright 2021 Microsoft Corporation\n</p>\n"
    }, 
    "WorkerURL": "./charticulator/dist/scripts/worker.bundle.js",
    "ContainerURL": "./charticulator/dist/scripts/container.bundle.js"
};
