/**
 * jsperf cli.
 *
 * Copyright(C) 2015 Hiroyoshi Kurohara(Microgadget,inc.).
 * E-mail: kurohara@yk.rim.or.jp, kurohara@microgadget-inc.com
 * Lisenced under MIT the lincense.
 */
var Controller = require('../lib/jsperf').Controller;

var program = require('commander');

program.version('0.1.0')
  .option('-m, --monitor [module]', 'Specify the name of monitor module', '')
  .option('-d, --data [module]', 'Specify the name of datastore module', '')
  .parse(process.argv);

function load_module(prefix, modulename) {
  if (modulename.indexOf(prefix) >= 0) {
    return require(modulename);
  } else {
    return require(prefix + modulename);
  }
}

if (program.monitor.length > 0 && program.data.length > 0) {
  var Monitor = load_module('jsperf.monitor.', program.monitor);
  var Datastore = load_module('jsperf.datastore.', program.data);

  var controller = new Controller(Monitor, Datastore);
  controller.monStart();

} else {
  program.outputHelp();
}
