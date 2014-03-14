var dal = require('../dal/users'),
    Q =  require('q');


var service = {
	create: function(data) {
		return dal.create(data);
	}
};

module.exports = service;
