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

    var context = $('#context')[0].getContext('3d');

    // Intiializer
    symbolVis.prototype.init = function (scope) {

        // Do this every data update
        this.onDataUpdate = dataUpdate;
        function dataUpdate(data) {
            //context.rect();
            //context.fill();

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