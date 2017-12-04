rdcp.linechartDefaults = {};

rdcp.linechartAdapter = [];

rdcp.linechart = function (id, ds, params, p) {
    var $chart = rdcp.id(id);

    var settings = rdcp.extend({}, rdcp.linechartDefaults, p);
    settings = rdcp.adapt(settings, rdcp.linechartAdapter);


}