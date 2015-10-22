var jisonmod = require('jison-semi-passive');
var spawn = require('child_process').spawn;

var PerfController = function PerfController() {
};
PerfController.Parser = jisonmod.Parser;
PerfController.prototype = {
  addMonitor: function(mon) {
    if (mon.syntax) {
      this.processor = new PerfController.Parser(mon.syntax);
      this.processor.yy.controller = this;
      this.processor_state = { iseof: false };
      this.remaindata = "";
    } else {
    }
    if (mon.oscommand) {
      this.oscommand = mon.oscommand;
      this.args = mon.args;
    } else {
    }
  },
  start: function() {
    this.child = spawn(this.oscommand, this.args);
    this.child.stdout.on('data', function(chunk) {
      var str = chunk.toString('utf8');
      var inl = str.lastIndexOf('\n');
      if (inl >= 0) {
	this.processor.parse(this.remaindata + str.substr(0, inl + 1), this.processor_state);
	this.remaindata = str.substr(inl + 1);
      } else {
	this.remaindata += str;
      }
    }.bind(this));
    this.child.stdout.on('close', function() {
      this.process_data.iseof = true;
      this.processor.parse(this.remaindata, this.processor_state);
    }.bind(this));
  },
  stop: function() {
    this.child.kill('SIGTERM');
  },
  connect: function() {
    console.log("connect");
  },
  close: function() {
    console.log("close");
  },
  send: function(data) {
    console.log(data);
  },
  keys: function(keys) {
    console.log(keys);
  },
};
PerfController.prototype.constructor = PerfController;

module.exports = PerfController;
