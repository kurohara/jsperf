
var MongoClient = require('mongodb').MongoClient;

var MongoStore = function MongoStore() {
  this.db = null;
  this.lastInsert = null;
  this.operations = [];
  this.url = "mongodb://localhost:27017/";
  this.dbname = "statdata";
  this.collectionName = "test";
};

function _finished(error, result) {
  var lastOp;
  if (error === null && result === null) {
    lastOp = { op: null };
  } else {
    lastOp = this.operations.shift();
  }
  console.log(lastOp.op);
  try {
    switch (lastOp.op) {
    case 'CONNECT':
      this.db = result;
      break;
    case 'INSERT':
      break;
    default:
      break;
    }
    if (lastOp.cb) {
      lastOp.cb(error, result);
    }
    
    // for next operataion
    if (this.operations.length > 0) {
      var op = this.operations[0];
      this.op = op.op;
      this.cb = op.cb;
      switch (op.op) {
      case 'CONNECT':
	MongoClient.connect(this.url + this.dbname, this.options, _finished.bind(this));
	break;
      case 'INSERT':
	if (this.db) {
	  this.lastInsert = null;
	  var collection = this.db.collection(this.collectionName);
	  console.log(op.data);
	  collection.bulkWrite(op.data, op.options, _finished.bind(this));
	}
	break;
      case 'FETCH':
	break;
      case 'CLOSE':
	if (this.db) {
	  this.db.close();
	}
	break;
      default:
	break;
      }
    }
  } catch(e) {
    console.log(e);
  }
}

MongoStore.prototype = {
  connect: function(url, opts) {
    if (url) {
      this.url = url;
    }
    this.options = (opts ? opts : {});
    this.operations.push({ op: "CONNECT" });
    _finished.call(this, null, null);
  },
  database: function(dbname) {
    this.dbname = dbname;
  },
  collection: function(colname) {
    this.collectionName = colname;
  },
  fetch: function(condition) {
  },
  insert: function(jsondata) {
    var insertOp;
    var qempty = this.operations.length === 0 ? true : false;
    console.log("qempty: " + qempty);
    if (this.lastInsert) {
      insertOp = this.lastInsert;
    } else {
      insertOp = { op: 'INSERT', data: [] };
      this.operations.push(insertOp);
      this.lastInsert = insertOp;
    }
    insertOp.data.push({ insertOne: jsondata });
    if (qempty) {
      _finished.call(this, null, null);
    }
  },
  close: function() {
    var qempty = this.operations.length === 0 ? true : false;
    console.log("qempty: " + qempty);
    this.operations.push({ op: 'CLOSE' });
    if (qempty) {
      _finished.call(this, null, null);
    }
  },
};
MongoStore.prototype.constructor = MongoStore;

module.exports = MongoStore;
////
