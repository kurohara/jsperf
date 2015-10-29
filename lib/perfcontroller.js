/**
 * perfcontroller.js
 * Controller module for jsperf suite.
 *
 * Copyright(C) 2015 Hiroyoshi Kurohara(Microgadget,inc.) all rights reserved.
 */
var _ = require('underscore');
var jisonmod = require('jison-semi-passive');
var spawn = require('child_process').spawn;
var dbname = "jsperf";

var DEFLEX = "deflex.l";

/**
 * default datastore
 */
function MemoryDatastore() {
  this.store = [];
}
MemoryDatastore.prototype = {
  connect: function(url, options) {
    this.store = [];
  },
  database: function(dbname) {
  },
  collection: function(colname) {
  },
  close: function() {
  },
  insert: function(data) {
    this.store.push(data);
  },
  fetch: function(condition) {
    // ignore condition
    return this.store;
  },
};
MemoryDatastore.prototype.constructor = MemoryDatastore;

/**
 */
function genParser(grammer) {
  var fs = require('fs');
  var ebnfparser = require('ebnf-parser');
  var lexparser = require('lex-parser');
  var bnfjson = ebnfparser.parse(grammer);
  var lex = lexparser.parse(fs.readFileSync(require('path').resolve(__dirname, DEFLEX), 'utf8'));
  if (! bnfjson.lex) {
    bnfjson.lex = {};
  }
  bnfjson.lex = _.extend(bnfjson.lex, lex);
  return new PerfController.Parser(bnfjson);
}

var PerfController = function PerfController(Monitor, Datastore) {
  if (Monitor instanceof String) {
    this.Monitor = require(Monitor);
  } else {
    this.Monitor = Monitor;
  }
  if (!Datastore) {
    this.datastore = new MemoryDatastore();
  } else {
    if (Datastore instanceof String) {
      this.datastore = new require(Datastore);
    } else {
      this.datastore = new Datastore();
    }
  }
  this.monitorInterval = 1;
  this._setupMonitor();
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
    this.processor_state.iseof = true;
    this.processor.parse(this.remaindata, this.processor_state);
  },
  _setupMonitor: function() {
    // setup monitor
    var monitor = new this.Monitor({interval: this.monitorInterval});
    if (monitor.syntax) {
      this.processor = genParser(monitor.syntax);
      this.processor.yy.controller = this;
      this.processor_state = { iseof: false };
      this.remaindata = "";
      this.dataname = monitor.dataname;
    } else {
    }
    if (monitor.oscommand) {
      this.oscommand = monitor.oscommand;
      this.args = monitor.args;
    } else if (monitor.callback) {
      this.callback = monitor.callback;
      this.args = monitor.args;
      this.interval = monitor.interval;
    } else {
    }
  },
  setInterval: function(interval) {
    this.monitorInterval = interval;
    this._setupMonitor();
  },
  monStart: function() {

    // start monitor
    this.child = spawn(this.oscommand, this.args);
    this.child.stdout.on('data', this._processdata.bind(this));
    this.child.stdout.on('close', this._processclose.bind(this));
  },
  monStop: function() {
    this.child.kill('SIGTERM');
  },
  dsConnect: function() {
    this.datastore.database(dbname);
    this.datastore.connect();
    this.datastore.collection(this.dataname);
  },
  dsClose: function() {
    this.datastore.close();
  },
  dsSend: function(data) {
    this.datastore.insert(data);
  },
  dsKeys: function(keys) {
    /* if datastore requires table schema has defined before data insert, do it here */
  },
};
PerfController.prototype.constructor = PerfController;

module.exports = PerfController;
