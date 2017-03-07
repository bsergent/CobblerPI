/*
 * CobblerPI Symbol
 * Written by Asa Whitley, Ben Sergent V, & Isaac Way
 */

(function (CS) {
    'use strict';
    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

    var canvas;
    var context;
    var scaleX;
    var scaleY;
    var dataWidth = 5;
    var dataHeight = 5;

    // Intializer
    symbolVis.prototype.init = function (scope, elem) {

        scope.scale = 1;
        var id = 'cobblerPlot_' + Math.random().toString(36).substr(2,16);
        var svgJ = elem.find('svg:first');
        svgJ.attr('id', id);
        var svg = svgJ[0];
        var seriesNames = [];
        var seriesColors = [];
        var minTime;
        var maxTime;
        var minValue;
        var maxValue;
        var symbolWidth;
        var symbolHeight;

        function convertToChartData(data) {
            var series = [];
            data.Data.forEach(function(item) {
                var t = {};
                t.name = item.Label;
                t.data = item.Values.map(function(obj) {
                    var date = new Date(obj.Time);
                    // please note, Number(obj.Value) will only work with numbers with . as the decimal separator
                    return [Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()), Number(obj.Value)];
                });
                series.push(t);
            });
            return series;
        }

        function parseSVG(s) {
            var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
            div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
            var frag = document.createDocumentFragment();
            while (div.firstChild.firstChild)
                frag.appendChild(div.firstChild.firstChild);
            return frag;
        }

        // Do this every data update (every 5s)
        this.onDataUpdate = function (data) {
            var minTime = Number.MAX_VALUE;
            var maxTime = 0;
            var minValue = Number.MAX_VALUE;
            var maxValue = 0;
            if (data) {
                var series = convertToChartData(data);
                svgJ.html('');
                // Find max/min
                series.forEach(function (set, index) {
                    if (set.name) {
                        seriesNames[index] = set.name;
                        seriesColors[index] = '#'+Math.random().toString(16).substr(2,1)+Math.random().toString(16).substr(2,1)+Math.random().toString(16).substr(2,1);
                    }
                    set.data.forEach(function (point, pointIndex) {
                        if (point[0] > maxTime) maxTime = point[0];
                        if (point[0] < minTime) minTime = point[0];
                        if (point[1] > maxValue) maxValue = point[1];
                        if (point[1] < minValue) minValue = point[1];
                    });
                });
                // New Draw
                var independent = [];
                var drawnX;
                var drawnY;
                series.forEach(function (set, index) {
                    if (index == 0) {
                        // Set the first series as independent variable
                        set.data.forEach(function (point, pointIndex) {
                            independent.push(point[1]);
                        });
                    } else {
                        // Set the rest of the series as dependent variables in varying colors
                        set.data.forEach(function (point, pointIndex) {
                            drawnX = (independent[pointIndex]-minTime)/(maxTime-minTime)*symbolWidth;
                            drawnY = (symbolHeight)-(point[1]-minValue)/(maxValue-minValue)*symbolHeight;
                            console.log('<circle cx="'+drawnX+'" cy="'+drawnY+'" r="3" fill="'+seriesColors[index]+'"/>');
                            svg.appendChild(parseSVG('<circle cx="'+drawnX+'" cy="'+drawnY+'" r="3" fill="'+seriesColors[index]+'"/>'));
                        });
                    }
                });

                // Legacy Draw
                /*var drawnX;
                var drawnY;
                series.forEach(function (set, index) {
                    set.data.forEach(function (point, pointIndex) {
                        // We can't actually just do this since it would be the same as a simple trend line for each series without the trend part
                        drawnX = (point[0]-minTime)/(maxTime-minTime)*symbolWidth;
                        drawnY = (symbolHeight)-(point[1]-minValue)/(maxValue-minValue)*symbolHeight;
                        console.log('<circle cx="'+drawnX+'" cy="'+drawnY+'" r="3" fill="'+seriesColors[index]+'"/>');
                        svg.appendChild(parseSVG('<circle cx="'+drawnX+'" cy="'+drawnY+'" r="3" fill="'+seriesColors[index]+'"/>'));
                    });
                });*/
                // Add variables to angular scope
                //scope.value = data.Value;
                //scope.time = data.Time;
                /*if (data.Label) {
                    scope.label = data.Label;
                }*/
            }
        };
        this.onResize = function (width, height) {
            symbolWidth = width;
            symbolHeight = height;
            //scope.scale = Math.min(width / 400, height / 400);
            svgJ.html('');
            // TODO Redraw last data update so there's not a delay
        };
    };

    var definition = {
        typeName: 'Scatter Plot', // Internal name used by Coresight
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple, // .Single .Multiple
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Interval: 400,
                Height: 400,
                Width: 400,
                BackgroundColor: 'rgba(30,30,30,0.75)',
                TextColor: 'rgb(200,200,200)',
            }
        },
        configTitle: 'Format Symbol', // Creates context menu for editing the config
        StateVariables: [ 'MultistateColor' ]
    };
    CS.symbolCatalog.register(definition);
})(window.PIVisualization);