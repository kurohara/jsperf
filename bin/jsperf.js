/**
 * jsperf cli.
 * *** UNDER CONSTRUCTION, FOR BEHAVIOR TEST ***
 * Uses mongodb as datastore, and monitors vm_stat command output.
 *
 * Copyright(C) 2015 Hiroyoshi Kurohara(Microgadget,inc.) all rights reserved.
 */
var Controller = require('../lib/perfcontroller');
var monitor = require('jsperf.monitor.vm_stat');
var Datastore = require('jsperf.datastore.mongo');

var controller = new Controller(monitor, new Datastore());
controller.start();

