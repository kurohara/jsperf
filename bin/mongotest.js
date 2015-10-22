var MongoStore = new require('./perf.datastore.mongo');

var mongo = new MongoStore();

mongo.database("statstore");
mongo.collection("vm_stat");

mongo.connect();

for (var i = 0;i < 10;++i) {
  mongo.insert({ test: "data" + i });
}

mongo.close();

