var dal = require('../dal/users'),
    crypt = require('../crypt');


var service = {
	create: function(data) {
		data.password = crypt.cryptPassword(data.password);
		return dal.create(data);
	}
};

module.exports = service;
