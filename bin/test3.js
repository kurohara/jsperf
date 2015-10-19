
var AbstractString = require('./AbstractString');

var str = new AbstractString(process.stdin);
process.stdin.resume();

while (true) {
  var c = c.charAt(0);
  if (c === "") {
    break;
  }
  c = c.slice(1);
}
