/*
 * jsperf
 * library entry point of jsperf.
 *
 * Copyright (c) 2015 kurohara
 * Licensed under the MIT license.
 */

'use strict';
module.exports = {
  Controller: require('./perfcontroller'),
  /**
   * this method is for test the 'monitor', be called from test program of monitors
   */
  TryProcess: function(obj, testdata, dsdata) {
    var DS = function() {
      this.database = function(name) {
	dsdata.database = name;
      };
      this.collection = function(name) {
	dsdata.collection = name;
      };
      this.connect = function(url, options) {
	dsdata.connected = true;
      };
      this.insert = function(data) {
	if (! dsdata.inserted) {
	  dsdata.inserted = [];
	}
	dsdata.inserted.push(data);
      };
      this.close = function() {
	dsdata.closed = true;
      };
    };
    var controller;
    if (obj instanceof this.Controller) {
      controller = obj;
    } else {
      controller = new this.Controller(obj, new DS());
    }
    controller._processdata(testdata);
    return controller;
  },
};

