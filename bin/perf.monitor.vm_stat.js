var fs = require('fs');

var monitor = module.exports = {
  syntax: fs.readFileSync('vm_stat.jison', 'utf8'),
  oscommand: "/usr/bin/vm_stat",
  args: [ "1" ],
};


