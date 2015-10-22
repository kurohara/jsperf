//var waitfor = require('wait.for');
var spawn = require('child_process').spawn;
var child = spawn('/usr/bin/vm_stat', [ '1' ]);
child.stdout.on('data', function(chunk) {
  console.log('data:::::'+chunk);
});

console.log('started*******');

