# nodeperf [![Build Status](https://secure.travis-ci.org//nodeperf.png?branch=master)](http://travis-ci.org//nodeperf)

This software is for analyzing streaming log output especially of system statistics command.  
The name 'jsperf' may be changed in future, I have no good idea about the name suitable for this software just now.  

jsperf is organized with 3 components.  

1. Controller(or main driver of this software).  
2. Monitor.  
3. Datasource.

The Monitor and Datasource are pluggable, currently, there are just one module for each of components.
The monitor.vm_stat  is a monitor for the 'vm_stat' command.  
The datasource.mongo is a data source for mongodb.  

jsperf is using jison-semi-passive as input analyzer, so you can define your own analyzer by writing bnf of input stream.  

## Getting Started
Install the module with: `npm install kurohara/jsperf`

After installing, you need to start mongodb because only mongodb datasource is provided currently.  

`node bin/jsperf.js`

will start jsperf, currently just inserts vm_stat output into mongodb.  

To stop jsperf, just type Ctrl-C.  

You can check the data with doing:  

`
$ mongo
> use jsperf
> db.vm_stat.find()
`

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 kurohara  
Licensed under the MIT license.
