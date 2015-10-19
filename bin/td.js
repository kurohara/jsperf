var _ = require('underscore');
var fs = require('fs');
var jisonmod = require('./jison-semi-passive');

var syntax = fs.readFileSync('test.jison', 'utf8');
var parser = new jisonmod.Parser(syntax);

var state = {iseof: false};
parser.parse("1abc test 1.0 (this 5.3)\n", state);
parser.parse("aaa bbb ccc ddd\n", state);
parser.parse("1 2 3 4\n", state);
parser.parse("1.2 3.4 5.6 7.8\n", state);
parser.parse("aaa bbb ccc ddd\n", state);
state.iseof = true;
parser.parse("1.2 3.4 5.6 7.8\n", state);
