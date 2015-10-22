var Controller = require('../lib/perfcontroller');
var monitor = require('jsperf.monitor.vm_stat');
var Datastore = require('jsperf.datastore.mongo');

var controller = new Controller(monitor, new Datastore());
controller.start();

