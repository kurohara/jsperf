'use strict';

var jsperf = require('../lib/jsperf.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var y = (function () {/*
%start block
%%
block
	: words EOF
	{ yy.controller.dsSend($1); }
;
words
	: SYMBOL
	{ $$ = []; $$.push($1); }
	| words SYMBOL
	{ $1.push($2); $$ = $1; }
;
%%

*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

var indata = "abc def";

var Monitor = function Monitor() {
  this.syntax = y;
  this.dataname = "test";
}
Monitor.prototype = {
};
Monitor.prototype.constructor = Monitor;

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    var controller = new jsperf.Controller(Monitor);
    controller._processdata(indata);
    controller._processclose();
    var parsed = controller.datastore.fetch({});
    test.ok(true);
    test.done();
  },
};
