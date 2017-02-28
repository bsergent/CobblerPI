/*
 * CobblerPI Symbol
 * Written by Asa Whitley, Ben Sergent V, & Isaac Way
 * Note that the IIS server must be reset for the symbol to appear.
 *  1. Open cmd as an administrator
 *  2. Run iisreset /stop
 *  3. Run iisreset /start
 */

// PI Dev Club RSS https://pisquare.osisoft.com/community/feeds/allcontent?community=2004&showProjectContent=false&recursive=true

(function (CS) {
    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

    var context;
    var tileWidth = 30;

    // Intializer
    symbolVis.prototype.init = function (scope) {

        context = document.getElementById('cobblerCanvas').getContext('2d');//$('#cobblerCanvas')[0].getContext('3d');

        // Do this every data update (every 5s)
        this.onDataUpdate = dataUpdate;
        function dataUpdate(data) {
            var color = [];
            for (var y = 0; y < 5; y++) {
                for (var x = 0; x < 5; x++) {
                    // Boxes
                    for (var c = 0; c < 3; c++) color[c] = Math.round(Math.random() * 9);
                    context.beginPath();
                    context.fillStyle = '#' + color[0] + '' + color[1] + '' + color[2];
                    context.rect(x * tileWidth, y * tileWidth, tileWidth, tileWidth);
                    context.fill();
                    context.closePath();

                    // Labels
                    for (var c = 0; c < 3; c++) color[c] = 9 - color[c];
                    context.beginPath();
                    context.fillStyle = '#' + color[0] + '' + color[1] + '' + color[2];
                    context.font = '12px Verdana';
                    context.fillText(color[0] + color[1] + color[2], (x * tileWidth) + (tileWidth / 3), (y * tileWidth) + (tileWidth * 2.5 / 4));
                    context.closePath();
                }
            }

            if (data) {
                // Add variables to angular scope
                //scope.value = data.Value;
                //scope.time = data.Time;
                if (data.Label) {
                    scope.label = data.Label;
                }
            }
        }
    };

    var definition = {
        typeName: 'cobbler', // Internal name used by Coresight
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single, // Change to .Multiple if we use more than one data source
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'Value',
                Height: 150,
                Width: 150,
                BackgroundColor: 'rgb(255,0,0)',
                TextColor: 'rgb(0,255,0)',
                ShowLabel: true,
                ShowTime: false
            }
        },
        configTitle: 'Format Symbol', // Creates context menu for editing the config
        StateVariables: [ 'MultistateColor' ]
    };
    CS.symbolCatalog.register(definition);
})(window.PIVisualization);