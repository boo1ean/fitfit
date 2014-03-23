var dal = require('../dal/users'),
    crypt = require('../crypt'),
    _ = require('lodash');

var expand = function(row) {
	return _.omit(row, 'password');
};

var service = {
	create: function(data) {
		data.password = crypt.cryptPassword(data.password);
		return dal.create(data).then(expand);
	},

	get: function(user) {
		return dal.findByEmail(user.email).then(function(user) {
			return user.data;
		});
	},

	save: function(data, user) {
		return dal.updateByEmail(user.email, { data: data });
	}
};

module.exports = service;
