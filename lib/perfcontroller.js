/**
 * perfcontroller.js
 * Controller module for jsperf suite.
 *
 * Copyright(C) 2015 Hiroyoshi Kurohara(Microgadget,inc.) all rights reserved.
 */
var jisonmod = require('jison-semi-passive');
var spawn = require('child_process').spawn;
var dbname = "jsperf";

var PerfController = function PerfController(monitor, datastore) {
  // setup monitor
  if (monitor.syntax) {
    this.processor = new PerfController.Parser(monitor.syntax);
    this.processor.yy.controller = this;
    this.processor_state = { iseof: false };
    this.remaindata = "";
    this.dataname = monitor.dataname;
  } else {
  }
  if (monitor.oscommand) {
    this.oscommand = monitor.oscommand;
    this.args = monitor.args;
  } else {
  }
  
  // setup datastore
  this.datastore = datastore;
};
PerfController.Parser = jisonmod.Parser;
PerfController.prototype = {
  _processdata: function(chunk) {
    var str = chunk.toString('utf8');
    var inl = str.lastIndexOf('\n');
    if (inl >= 0) {
      this.processor.parse(this.remaindata + str.substr(0, inl + 1), this.processor_state);
      this.remaindata = str.substr(inl + 1);
    } else {
      this.remaindata += str;
    }
  },
  _processclose: function() {
    this.process_data.iseof = true;
    this.processor.parse(this.remaindata, this.processor_state);
  },
  start: function() {
    this.child = spawn(this.oscommand, this.args);
    this.child.stdout.on('data', this._processdata.bind(this));
    this.child.stdout.on('close', this._processclose.bind(this));
  },
  stop: function() {
    this.child.kill('SIGTERM');
  },
  connect: function() {
    this.datastore.database(dbname);
    this.datastore.connect();
    this.datastore.collection(this.dataname);
  },
  close: function() {
    this.datastore.close();
  },
  send: function(data) {
    this.datastore.insert(data);
  },
  keys: function(keys) {
    /* if datastore requires table schema has defined before data insert, do it here */
  },
};
PerfController.prototype.constructor = PerfController;

module.exports = PerfController;
