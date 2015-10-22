var Controller = require('./perfcontroller');
var monitor = require('./perf.monitor.vm_stat');

var controller = new Controller();
controller.addMonitor(monitor);
controller.start();

