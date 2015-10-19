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
// test snippet
var fs = require('fs');
var sleep = require('sleep-async')().sleep;

var conf = {
  probe = {
    type: 'process',
    path: '/usr/bin/vm_stat',
  };
  processor = {
    grammer: {
    },
  };
};

conf.processor.grammer = fs.readFileSync('test.jison', 'utf8');

var p = new Nodeperf();
p.init(conf);
p.run();

sleep(20 * 1000,function() {
  p.stop();
});

