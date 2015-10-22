var Controller = require('./perfcontroller');
var monitor = require('./perf.monitor.vm_stat');
var Datastore = require('./perf.datastore.mongo');

var controller = new Controller(monitor, new Datastore());
controller.start();

