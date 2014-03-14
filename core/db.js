var MongoClient = require('mongodb').MongoClient,
    Q = require('q'),
    config = require('../config'),
    errorHandler = require('./error-handler');

var query = function(cb) {
	MongoClient.connect(config.db.mongo.connection, function(err, db) {
		if (err) {
			throw err;
		}

		cb(db, function() {
			db.close();
		});
	});
}

var insert = function(collectionName, item) {
	var deferred = Q.defer();

	query(function(db, cb) {
		db.collection(collectionName).insert(item, function(err, items) {
			if (err) {
				return deferred.reject(err);
			}

			deferred.resolve(items);
			cb();
		});
	});

	return deferred.promise;
}

module.exports = {
	insert: insert
};
