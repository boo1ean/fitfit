var dal = require('../dal/users'),
    crypt = require('../crypt'),
    _ = require('lodash');

var needToSave = function(clientData, user) {
	return !user.data || clientData.updatedAt > user.data.updatedAt;
};

var expand = function(row) {
	return _.omit(row, 'password');
};

var service = {
	create: function(data) {
		data.password = crypt.cryptPassword(data.password);
		return dal.create(data).then(expand);
	},

	sync: function(data, user) {
		return dal.findByEmail(user.email).then(function(user) {
			if (needToSave(data, user)) {
				dal.updateByEmail(user.email, { data: data });
			}

			return user.data;
		}).then(expand);
	}
};

module.exports = service;
