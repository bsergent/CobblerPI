/*
 * CobblerPI Symbol
 * Written by Asa Whitley, Ben Sergent V, & Isaac Way
 * Note that the IIS server must be reset for the symbol to appear.
 *  1. Open cmd as an administrator
 *  2. Run iisreset /stop
 *  3. Run iisreset /start
 */

(function (CS) {
    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

    var canvas;
    var context;
    var scaleX;
    var scaleY;
    var dataWidth = 5;
    var dataHeight = 5;

    // Intializer
    symbolVis.prototype.init = function (scope) {

        canvas = $('#cobblerCanvas');
        context = canvas[0].getContext('2d');

        // Do this every data update (every 5s)
        this.onDataUpdate = function (data) {
            updateScale(); // TODO This should be in a resize listener in case data is frozen
            var color = [];
            for (var y = 0; y < dataHeight; y++) {
                for (var x = 0; x < dataWidth; x++) {
                    // Boxes
                    for (var c = 0; c < 3; c++) color[c] = Math.round(Math.random() * 9);
                    context.beginPath();
                    context.fillStyle = '#' + color[0] + '' + color[1] + '' + color[2];
                    context.rect(x * scaleX, y * scaleY, scaleX, scaleY);
                    context.fill();
                    context.closePath();

                    // Labels
                    for (var c = 0; c < 3; c++) color[c] = 9 - color[c];
                    context.beginPath();
                    context.fillStyle = '#' + color[0] + '' + color[1] + '' + color[2];
                    context.font = '12px Verdana';
                    context.fillText(color[0] + color[1] + color[2], (x * scaleX) + (scaleX / 3), (y * scaleY) + (scaleY * 2.5 / 4));
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
        
        function updateScale() {
            canvas.attr('width', canvas.width());
            canvas.attr('height', canvas.height());
            scaleX = canvas.width() / dataWidth;
            scaleY = canvas.height() / dataHeight;
            scaleX = Math.floor(scaleX);
            scaleY = Math.floor(scaleY);
            console.log('canvasWidth (' + canvas.width() + ') / dataWidth (' + dataWidth + ') = scaleX (' + scaleX + ')');
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