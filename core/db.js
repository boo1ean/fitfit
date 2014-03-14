var mongoose = require('mongoose'),
    Q = require('q'),
    errorHandler = require('./error-handler');

var deferred = Q.defer();

mongoose.connect('mongodb://localhost/test');

db.on('error', errorHandler);

db.once('open', function() {

});

return deferred.promise;
