var cp = require("child_process");
var exec = ep.exec;

var Nodeperf = module.export = function Nodeperf() {
};

Nodeperf.prototype = {
  init: function(conf) {
    this.probe = conf.probe;
    this.processor = conf.processor;
  },
  run: function() {
    this.probe.start();
  },
};

////////////////////
var sleep = require('sleep-async')().sleep;

var conf = {
  probe = {
  };
  processor = {
  };
};

var p = new Nodeperf();
p.init(conf);
p.run();

sleep(20 * 1000,function() {
  p.stop();
});

