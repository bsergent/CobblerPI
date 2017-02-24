/*
 * CobblerPI Symbol
 * Written by Asa Whitley, Ben Sergent V, & Isaac Way
 */

(function (CS) {
    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

    // Intiializer
    symbolVis.prototype.init = function () {
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