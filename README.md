# jsperf  

This software is for analyzing streaming log output especially of system statistics command.  
The name 'jsperf' may be changed in future, I have no good idea about the name suitable for this software just now.  

jsperf is organized with 3 components.  

1. Controller(or main driver of this software).  
2. Monitor.  
3. Datasource.

The Monitor and Datasource are pluggable, currently, there are just one module for each of components.
The monitor.vm_stat  is a monitor for the 'vm_stat' command.  
The datasource.mongo is a data source for mongodb.  

In the Monitor components, jsperf is using [jison-semi-passive](https://github.com/kurohara/jison-semi-passive.git) as input analyzer, so you can define your own analyzer by writing bnf of input stream.  

## Getting Started
Install the module with: 
```
npm install kurohara/jsperf
```
You also need to install Monitor module and Datastore module, currently, only 'vm_stat' monitor and 'mongodb' datastore is exist.
```
npm install kurohara/jsperf.monitor.vm_stat
npm install kurohara/jsperf.datastore.mongo
```

After installing, you need to start mongodb.  

Then start jsperf like:  

`node bin/jsperf.js -m vm_stat -d mongo`  
will start jsperf, currently just inserts vm_stat output into mongodb.  

or
`node bin/jsperf.js` to see the command line help.  


To stop jsperf, just type Ctrl-C.  

You can check the data with doing:  

````
$ mongo
> use jsperf
> db.vm_stat.find()
````

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
