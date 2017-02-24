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

    // Intiializer
    symbolVis.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;
        
        // Do this every data update
        function dataUpdate(data) {
            if (data) {
                // Add variables to angular scope
                scope.value = data.Value;
                scope.time = data.Time;
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
                Width: 150
            }
        }
    };
    CS.symbolCatalog.register(definition);
})(window.Coresight);